'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../styles/login.module.css'

export default function Login(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
   
    function handleSubmit(e) {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Senha:', senha);
    console.log('Confirmar Senha:', confirmarSenha);
    router.push('/home');
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

                    <button type="submit" className={styles.cadastrarBtn}>
                        <span className={styles.cadastrarText}>Cadastrar</span>
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