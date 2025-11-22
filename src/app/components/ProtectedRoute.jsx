'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const checkAuth = () => {
      try {
        const usuario = localStorage.getItem('usuario');
        if (usuario) {
          // Verifica se os dados são válidos
          const usuarioData = JSON.parse(usuario);
          if (usuarioData && usuarioData.id_usuario) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('usuario');
            router.push('/enter');
          }
        } else {
          router.push('/enter');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('usuario');
        router.push('/enter');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    );
  }

  // Só renderiza o conteúdo se estiver autenticado
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

