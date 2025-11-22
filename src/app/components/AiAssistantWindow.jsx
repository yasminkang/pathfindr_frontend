'use client';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/aiAssistantWindow.module.css';

export default function AiAssistantWindow() {
  const [windowState, setWindowState] = useState('collapsed');
  const [userMessages, setUserMessages] = useState(["O que é o PathFindr?"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  
  // Chat state for entrevista modal
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const chatMessagesEndRef = useRef(null);

  const toggleWindow = () => {
    setWindowState(prev => prev === 'collapsed' ? 'expanded' : 'collapsed');
  };

  const handleHistoryClick = () => {
    console.log('打开历史记录');
  };

  const aiMessages = [
    "Olá, tudo bem?  Vamos estudar o que hoje?",
    "Estou te esperando"
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('.assistantInput');
    if (input.value.trim()) {
      setUserMessages(prev => [...prev, input.value.trim()]);
      input.value = '';
    }
  };

  const handleEntrevistaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (chatMessagesEndRef.current && isModalOpen) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isModalOpen]);

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const history = chatMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: history,
        }),
      });

      console.log('API response status:', response.status);

      let data;
      try {
        const responseText = await response.text();
        console.log('API response text:', responseText);
        
        if (!response.ok) {
          try {
            data = JSON.parse(responseText);
          } catch {
            data = { success: false, error: `API returned ${response.status}: ${responseText}` };
          }
          throw new Error(data.error || `API returned ${response.status}`);
        }
        
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse API response:', parseError);
          throw new Error('Resposta da API inválida');
        }
      } catch (fetchError) {
        console.error('Error processing API response:', fetchError);
        throw fetchError;
      }

      console.log('API response data:', data);

      if (data.success && data.response) {
        // Add AI response to chat
        const aiMessage = {
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle error - show actual error message from API
        const errorMessage = {
          type: 'ai',
          content: data.error || 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, errorMessage]);
        console.error('API returned error:', data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'ai',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal positioning to fill main container (beside sidebar) and prevent scrolling
  useEffect(() => {
    if (!isModalOpen) {
      // Re-enable scrolling when modal closes
      document.body.style.overflow = '';
      return;
    }

    // Disable body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    if (!modalRef.current) return;

    const updateModalPosition = () => {
      const mainElement = document.querySelector('main');
      
      if (mainElement && modalRef.current) {
        const rect = mainElement.getBoundingClientRect();
        // Use fixed height instead of main container's height to match other pages
        const fixedHeight = `calc(100vh - 2rem)`;
        modalRef.current.style.top = `${rect.top}px`;
        modalRef.current.style.left = `${rect.left}px`;
        modalRef.current.style.width = `74.9%`;
        modalRef.current.style.height = fixedHeight;
        modalRef.current.style.maxHeight = fixedHeight;
      }
    };

    // Update position on mount and resize
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateModalPosition();
      });
    });
    
    window.addEventListener('resize', updateModalPosition);
    
    return () => {
      window.removeEventListener('resize', updateModalPosition);
      // Re-enable scrolling when component unmounts or modal closes
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <div className={`${styles.assistantContainer} ${styles[windowState]}`}>
      <button 
        className={`${styles.toggleBtn} ${styles[`toggleBtn_${windowState}`]}`}
        onClick={toggleWindow}
        aria-label={windowState === 'collapsed' ? '打开AI助手' : '收起AI助手'}
      >
        {windowState === 'collapsed' ? (
          <img 
            src="/images/aimg.png" 
            alt="AI Assistant" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block', backgroundColor: 'none' }}
          />
        ) : (
          <span className={styles.closeIcon}>✕</span>
        )}
      </button>

      {windowState === 'expanded' && (
        <div className={styles.assistantPanel}>
          <div className={styles.chatContainer}>
            <div className={styles.aiMessageGroup}>
              <div className={styles.aiMessageList}>
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={styles.aiMessageContent}>
                    <p>{msg}</p>
                  </div>
                ))}
              </div>
              <div className={styles.aiAvatarWrapper}>
                <div className={styles.aiAvatar}>
                  <img src="/images/aiAvatar.png" alt="AI 助手头像" className={styles.avatarImage}/>
                </div>
                <button 
                  className={styles.historyIconBtn}
                  onClick={handleHistoryClick}
                  aria-label="查看聊天历史"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.quickCommandsSection}>
            <div className={styles.quickCommandsGrid}>
              <button className={styles.quickCmdBtn}>Me explique</button>
              <button className={styles.quickCmdBtn}>Anote isso para mim</button>
              <button className={styles.quickCmdBtnFull}>Me lembre disso depois</button>
            </div>
          </div>

          <form onSubmit={handleSendMessage} className={styles.inputSection}>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                  placeholder="Escrever..." 
                className={styles.assistantInput}
                required
              />
              <button type="submit" className={styles.sendBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className={styles.footerTagsContainer}>
              <div className={styles.footerTags}>
                <button type="button" className={styles.footerTag}>Progresso de hoje</button>
                <button type="button" className={styles.footerTag}>Pergunte</button>
                <button type="button" className={styles.footerTag}>Lembretes</button>
                <button type="button" className={styles.footerTag}>Reflexões</button>
                <button type="button" className={styles.footerTag} onClick={handleEntrevistaClick}>Entrevista</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {isModalOpen && (
        <div ref={modalRef} className={styles.entrevistaModal}>
          <button className={styles.closeModalBtn} onClick={handleCloseModal}>
            Voltar
          </button>
          <div className={styles.modalContent}>
            
            
            <div className={styles.chatMessages}>
              {chatMessages.length === 0 && (
                <div className={styles.welcomeMessage}>
                  <p>Olá! Sou seu assistente de questionário. Como posso te ajudar hoje?</p>
                </div>
              )}
              
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${styles.chatMessage} ${styles[`chatMessage_${msg.type}`]}`}
                >
                  <div className={styles.messageContent}>
                    {msg.type === 'ai' && (
                      <div className={styles.aiAvatarSmall}>
                        <img src="/images/aiAvatar.png" alt="AI" />
                      </div>
                    )}
                    <div className={styles.messageBubble}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className={`${styles.chatMessage} ${styles.chatMessage_ai}`}>
                  <div className={styles.messageContent}>
                    <div className={styles.aiAvatarSmall}>
                      <img src="/images/aiAvatar.png" alt="AI" />
                    </div>
                    <div className={styles.messageBubble}>
                      <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatMessagesEndRef} />
            </div>
            
            <form onSubmit={handleSendChatMessage} className={styles.chatInputForm}>
              <div className={styles.chatInputWrapper}>
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className={styles.chatInput}
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  className={styles.chatSendBtn}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}