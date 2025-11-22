export async function POST(request) {
  try {
    const body = await request.json();
    const { email_usuario, senha_usuario } = body;

    if (!email_usuario || !senha_usuario) {
      return Response.json(
        {
          success: false,
          error: 'E-mail e senha são obrigatórios',
        },
        { status: 400 }
      );
    }

    // URL do backend FastAPI (Railway ou local)
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // Garante que a URL tenha protocolo
    if (backendUrl && !backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      backendUrl = `https://${backendUrl}`;
    }
    
    // Remove barra final se houver
    backendUrl = backendUrl.replace(/\/$/, '');
    
    const apiUrl = `${backendUrl}/usuarios/login`;

    console.log('Chamando backend para login:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_usuario,
        senha_usuario,
      }),
    });

    // Verifica o status antes de tentar parsear JSON
    if (!response.ok) {
      let errorMessage = 'Erro ao fazer login';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch (e) {
        // Se não conseguir parsear JSON, usa a mensagem padrão
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }
      
      return Response.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: response.status }
      );
    }

    // Se chegou aqui, a resposta foi OK
    const data = await response.json();
    
    // Valida se a resposta contém dados válidos
    if (!data || !data.id_usuario) {
      return Response.json(
        {
          success: false,
          error: 'Resposta inválida do servidor',
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Erro na API de login:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'Erro ao processar login',
      },
      { status: 500 }
    );
  }
}

