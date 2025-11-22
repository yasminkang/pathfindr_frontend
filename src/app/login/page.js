'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../styles/login.module.css'

export default function Login(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Redireciona se já estiver autenticado (apenas se houver dados válidos)
    useEffect(() => {
        // Só verifica no cliente
        if (typeof window === 'undefined') return;
        
        const usuario = localStorage.getItem('usuario');
        if (usuario) {
            try {
                const usuarioData = JSON.parse(usuario);
                // Verificação mais rigorosa: precisa ter id_usuario E email_usuario
                if (usuarioData && 
                    usuarioData.id_usuario && 
                    typeof usuarioData.id_usuario !== 'undefined' &&
                    usuarioData.email_usuario) {
                    // Usuário válido, pode redirecionar
                    router.replace('/home');
                } else {
                    // Dados inválidos, limpar
                    localStorage.removeItem('usuario');
                }
            } catch (error) {
                // Erro ao parsear, limpar
                localStorage.removeItem('usuario');
            }
        }
    }, [router]);
   
    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        
        // Validações
        if (!email || !senha || !confirmarSenha) {
            setErro('Por favor, preencha todos os campos');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem');
            return;
        }

        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch('/api/auth/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email_usuario: email,
                    senha_usuario: senha,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setErro(data.error || 'Erro ao cadastrar. Tente novamente.');
                setCarregando(false);
                return;
            }

            // Cadastro bem-sucedido - fazer login automático
            console.log('Usuário cadastrado:', data.data);
            
            // Após cadastro, fazer login automático
            try {
                const loginResponse = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email_usuario: email,
                        senha_usuario: senha,
                    }),
                });

                const loginData = await loginResponse.json();
                if (loginResponse.ok && loginData.success && loginData.data) {
                    localStorage.setItem('usuario', JSON.stringify(loginData.data));
                }
            } catch (error) {
                console.error('Erro ao fazer login automático:', error);
            }
            
            router.push('/home');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setErro('Erro ao conectar com o servidor. Tente novamente.');
            setCarregando(false);
        }
    }

    return(
        <div className={styles.loginContainer}>
            <div className={styles.leftbox}>
            <h1 className={styles.title}>PathFindr</h1>
            <img src='/phrase.png' alt="Call to action frase" className={styles.phraseimg}/>
            <img src='/hichat1.png' alt='Clone conversando com o user' className={styles.cloneHey}/>
            </div>
            
            <div className={styles.rightbox}>
            <div className={styles.formbox}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputbox}>
                    <label>E-mail</label>
                    <div className={styles.writebox}>
                    <input
                    type='email'
                    value={email}
                    placeholder='Digite seu e-mail'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                    </div>
                    </div>

                    <div className={styles.inputbox}>
                    <label>Senha</label>
                    <div className={styles.writebox}>
                    <input
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    placeholder='Crie sua senha'
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    />

                    <img
                        src={mostrarSenha ? '/DontSee.png' : '/See.png'}
                        className={styles.eyesbtn}
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        alt="botão de ver ou não a senha"
                    />
                    </div>
                    </div>

                    <div className={styles.inputbox}>
                    <label>Confirmar senha</label>
                    <div className={styles.writebox}>
                    <input
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    placeholder='Confirme sua senha'
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    />

                    <img
                        src={mostrarConfirmarSenha ? '/See.png' : '/DontSee.png'}
                        className={styles.eyesbtn}
                        onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                        alt="botão de ver ou não a senha"
                    />
                    </div>
                    </div>

                    {erro && (
                        <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                            {erro}
                        </div>
                    )}
                    <button 
                        type="submit" 
                        className={styles.cadastrarBtn}
                        disabled={carregando}
                    >
                        <span className={styles.cadastrarText}>
                            {carregando ? 'Cadastrando...' : 'Cadastrar'}
                        </span>
                    </button>

                    <div className={styles.separator}>
                        <div className={styles.separatorLine}></div>
                        <span className={styles.separatorText}>ou</span>
                        <div className={styles.separatorLine}></div>
                    </div>

                    <div className={styles.socialLogin}>
                        <button type="button" className={styles.socialBtn}>
                            <img src='/googlePath.png' alt="Google" className={styles.socialIcon1} />
                        </button>
                        <button type="button" className={styles.socialBtn}>
                            <img src='/facePath.png' alt="Facebook" className={styles.socialIcon} />
                        </button>
                    </div>

                    <div className={styles.existingAccount}>
                        Já possui conta? <a href="/enter" className={styles.loginLink}>Acesse sua conta</a>
                    </div>

                </form>
            </div>
            </div>
        </div>
    )
}