'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../styles/login.module.css'

export default function Enter(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
   
    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        
        // Validações
        if (!email || !senha) {
            setErro('Por favor, preencha todos os campos');
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch('/api/auth/login', {
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
                setErro(data.error || 'E-mail ou senha inválidos');
                setCarregando(false);
                return;
            }

            // Login bem-sucedido - salvar dados do usuário
            if (data.data) {
                localStorage.setItem('usuario', JSON.stringify(data.data));
            }
            
            console.log('Login bem-sucedido:', data.data);
            router.push('/home');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setErro('Erro ao conectar com o servidor. Tente novamente.');
            setCarregando(false);
        }
    }

    return(
        <div className={styles.loginContainer}>
            <div className={styles.leftbox}>
            <h1 className={styles.title}>PathFindr</h1>
            <img src='/phrase.png' alt="Call to action frase" className={styles.phraseimg}/>
            <img src='/hichat2.png' alt='Clone conversando com o user' className={styles.cloneHey}/>
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
                    placeholder='Digite sua senha'
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

                    {erro && (
                        <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>
                            {erro}
                        </div>
                    )}
                    <button 
                        type="submit" 
                        className={styles.cadastrarBtn}
                        disabled={carregando}
                    >
                        <span className={styles.cadastrarText}>
                            {carregando ? 'Entrando...' : 'Entrar'}
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
                        Ainda não possui uma conta? <a href="/login" className={styles.loginLink}>Cadastre-se</a>
                    </div>

                </form>
            </div>
            </div>
        </div>
    )
}