'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const checkAuth = () => {
      try {
        // Verifica se está no cliente (localStorage só existe no cliente)
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const usuario = localStorage.getItem('usuario');
        if (usuario) {
          // Verifica se os dados são válidos
          const usuarioData = JSON.parse(usuario);
          if (usuarioData && usuarioData.id_usuario) {
            setIsAuthenticated(true);
            setIsLoading(false);
          } else {
            localStorage.removeItem('usuario');
            setShouldRedirect(true);
            setIsLoading(false);
          }
        } else {
          setShouldRedirect(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('usuario');
        }
        setShouldRedirect(true);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (shouldRedirect && !isLoading) {
      router.replace('/enter');
    }
  }, [shouldRedirect, isLoading, router]);

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

  // Não renderiza nada se não estiver autenticado (já está redirecionando)
  if (!isAuthenticated || shouldRedirect) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Redirecionando...
      </div>
    );
  }

  // Só renderiza o conteúdo se estiver autenticado
  return <>{children}</>;
}

