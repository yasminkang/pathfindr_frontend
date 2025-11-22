'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../styles/login.module.css'

export default function Enter(){
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

                    <button type="submit" className={styles.cadastrarBtn}>
                        <span className={styles.cadastrarText}>Entrar</span>
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