'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();
  const progressPercent = 12;
  const progressWidth = `${165 * (progressPercent / 100)}px`;

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    router.push('/enter');
  };

  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.logo}>PathFindr</h1>
      
      <div className={styles.sidebarSearchContainer}>
        <h3>Sua carreira evolui, nós garantimos a transição</h3>
      </div>
      
      <div className={styles.navGroup}>
        <h2 className={styles.groupTitle}>Explorar</h2>
        <ul className={styles.navList}>
          <li>
            <Link href="/home" className={styles.navItem}>
              <span className={styles.navIcon}>
                <img 
                  src="/images/HomeIcon.png"
                  alt="Home" 
                  className={styles.iconImg}
                />
              </span>
              <span>Tela inicial</span>
            </Link>
          </li>
          <li>
            <Link href="#" className={styles.navItem}>
              <span className={styles.navIcon}>
                <img 
                  src="/images/ProgressoIcon.png"
                  alt="Progresso" 
                  className={styles.iconImg}
                />
              </span>
              <span>Seu Progresso</span>
            </Link>
          </li>
          <li>
            <Link href="#" className={styles.navItem}>
              <span className={styles.navIcon}>
                <img 
                  src="/images/EcossistemaIcon.png"
                  alt="Ecossistema" 
                  className={styles.iconImg}
                />
              </span>
              <span>Ecossistema</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className={styles.navGroup}>
        <h2 className={styles.groupTitle}>Conta</h2>
        <ul className={styles.navList}>
          <li>
            <Link href="/profile.html" className={styles.navItem}>
              <span className={styles.navIcon}>
                <img 
                  src="/images/ProfileIcon.png"
                  alt="Perfil" 
                  className={styles.iconImg}
                />
              </span>
              <span>Perfil</span>
            </Link>
          </li>
          <li>
            <Link href="#" className={styles.navItem}>
              <span className={styles.navIcon}>
                <img 
                  src="/images/ConfigIcon.png"
                  alt="Perfil" 
                  className={styles.iconImg}
                />
              </span>
              <span>Configurações</span>
            </Link>
          </li>
          <li>
            <Link href="/carrinho" className={styles.navItem}>
              <span className={styles.navIcon}>
                <img 
                  src="/images/CarrinhoIcon.png"
                  alt="Perfil" 
                  className={styles.iconImg}
                />
              </span>
              <span>Carrinho</span>
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className={styles.navItem}
              style={{
                background: 'none',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.75rem',
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit'
              }}
            >
              <span className={styles.navIcon}>
                <span style={{ fontSize: '20px' }}>🚪</span>
              </span>
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </div>
      
      <Link href="/planos" className={styles.premiumBtn} style={{width: '100%', textDecoration: 'none', display: 'block', color: 'inherit', color: '#FFF', textAlign: 'center'}}>Tenha premium</Link>
      
      <div className={styles.placeholderBox}>
        <img 
          src="/images/SidebarProgress.png"
          alt="Perfil" 
          className={styles.ProgressImg}
        />
        <span className={styles.progressTitle}>Continuar de onde parou?</span>
        <span className={styles.progressCourse}>IA Expertising Management</span>
        <div className={styles.progressBar}>
        <div className={styles.progressBackground}>
          <div
            className={styles.progressFill}
            style={{ width: progressWidth }}
          />
        </div>
        <span className={styles.progressText}>{progressPercent}%</span>
      </div>
    </div>
  </aside>
);
}