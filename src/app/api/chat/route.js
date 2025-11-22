export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || !message.trim()) {
      return Response.json(
        {
          success: false,
          error: 'Mensagem vazia',
        },
        { status: 400 }
      );
    }

    // Call the webhook API
    const webhookUrl = 'https://niikme.app.n8n.cloud/webhook/4b302ce0-d310-4604-8fad-0faad619c940/chat';
    
    console.log('Calling webhook with:', { message, historyLength: conversationHistory.length });
    
    // Based on working example, send JSON with message field
    // The working example uses: { personagem: selectedName, prompt }
    // For chat, we'll use: { message: message } or similar formats
    const requestBody = { chatInput: message };
    
    console.log('Sending to webhook:', JSON.stringify(requestBody, null, 2));
    
    let response;
    try {
      response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError) {
      console.error('Fetch error (network or CORS):', fetchError);
      throw new Error(`Erro ao conectar com o webhook: ${fetchError.message}`);
    }

    console.log('Webhook response status:', response.status);
    
    // Get response text first to avoid reading body twice
    const responseText = await response.text();
    console.log('Webhook response text:', responseText);
    
    if (!response.ok) {
      console.error('Webhook error response:', responseText);
      
      // Try to parse error response as JSON if possible
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: responseText };
      }
      
      const errorMessage = errorData.error || errorData.message || errorData.errorMessage || responseText || 'Erro desconhecido no webhook';
      throw new Error(`Erro no webhook (${response.status}): ${errorMessage}`);
    }

    // Try to parse JSON, but handle different response formats
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // If parsing fails, treat text as response
        data = { response: responseText, message: responseText, text: responseText };
      }
    } else {
      console.log('Webhook returned non-JSON content type:', contentType);
      // Try to parse as JSON anyway
      try {
        data = JSON.parse(responseText);
      } catch {
        // If not JSON, treat the text as the response
        data = { response: responseText, message: responseText, text: responseText };
      }
    }

    console.log('Webhook response data:', data);

    // Extract response from various possible formats
    const aiResponse = data.response || 
                       data.message || 
                       data.text || 
                       data.answer ||
                       data.content ||
                       (typeof data === 'string' ? data : null) ||
                       'Desculpe, não consegui processar sua mensagem.';

    return Response.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        error: error.message || 'Erro ao processar mensagem',
      },
      { status: 500 }
    );
  }
}

