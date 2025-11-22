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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
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

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          error: data.detail || 'Erro ao fazer login',
        },
        { status: response.status }
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

