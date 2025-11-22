'use client';

import { useState } from 'react';

import styles from '../styles/planos.module.css';

const PLAN_KEYS = {
  FREE: 'free',
  STANDARD: 'standard',
  PRO: 'pro',
};

export default function Planos() {
  const [selectedPlan, setSelectedPlan] = useState(PLAN_KEYS.FREE);
  const [hasInteracted, setHasInteracted] = useState(false);

  const renderCard = () => {
    if (selectedPlan === PLAN_KEYS.FREE) {
      return (
        <div className={styles.planosCard}>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Clone auto-personalizável que te ajuda</p><img src='/verify.png' className={styles.verifyIcon} /></div>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Cursos gratuitos da plataforma</p><img src='/verify.png' className={styles.verifyIcon} /></div>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Área de vagas e outras conexões</p><img src='/verify.png' className={styles.verifyIcon} /></div>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Descontos em cursos financiados</p><div className={styles.notVerify} /></div>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Destaque maior em vagas</p><div className={styles.notVerify} /></div>
          <h3 className={styles.infoend}>* Cada adesão financia uma transição justa para quem mais precisa</h3>
        </div>
      );
    }

    if (selectedPlan === PLAN_KEYS.STANDARD) {
      return (
        <div className={styles.planosCard}>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Descontos em cursos financiados</p><img src='/verify.png' className={styles.verifyIcon} /></div>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Destaque maior em vagas</p><img src='/verify.png' className={styles.verifyIcon} /></div>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Funcionalidades extras do clone</p><img src='/verify.png' className={styles.verifyIcon} /></div>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Clone com inteligência avançada</p><img src='/verify.png' className={styles.verifyIcon} /></div>
          <div className={styles.verifyItem}><p className={styles.infoplan}>Acesso completo a todos os cursos disponíveis</p><div className={styles.notVerify} /></div>
          <h3 className={styles.infoend}>* Cada adesão financia uma transição justa para quem mais precisa</h3>
        </div>
      );
    }

    return (
      <div className={styles.planosCard}>
        <div className={styles.verifyItem}><p className={styles.infoplan}>Clone com inteligência avançada</p><img src='/verify.png' className={styles.verifyIcon} /></div>
        <div className={styles.verifyItem}><p className={styles.infoplan}>Acesso completo a todos os cursos disponíveis</p><img src='/verify.png' className={styles.verifyIcon} /></div>
        <div className={styles.verifyItem}><p className={styles.infoplan}>Destaque principal em vagas</p><img src='/verify.png' className={styles.verifyIcon} /></div>
        <div className={styles.verifyItem}><p className={styles.infoplan}>Verificação do perfil profissional</p><img src='/verify.png' className={styles.verifyIcon} /></div>
        <div className={styles.verifyItem}><p className={styles.infoplan}>Cresça mais rapidamente na plataforma</p><img src='/verify.png' className={styles.verifyIcon} /></div>
        <h3 className={styles.infoend}>* Cada adesão financia uma transição justa para quem mais precisa</h3>
      </div>
    );
  };

  const handlePlanSelect = (planKey) => {
    setSelectedPlan(planKey);
    setHasInteracted(true);
  };

  return (
    <div className={styles.planosContainer}>
      <h1 className={styles.title}>Planos de assinatura</h1>

      <div className={styles.planroot}>
        {renderCard()}

        <div className={styles.plantyperoot}>
          <button
            type="button"
            className={selectedPlan === PLAN_KEYS.FREE ? `${styles.planbox} ${styles.plan1bg}` : styles.planboxnotselected}
            onClick={() => handlePlanSelect(PLAN_KEYS.FREE)}
          >
            <div>
              <p className={selectedPlan === PLAN_KEYS.FREE ? styles.themeplan : styles.themeplannotselected}>Gratuito</p>
              <h3 className={selectedPlan === PLAN_KEYS.FREE ? styles.typeplan : styles.typeplannotselected}>
                Seu plano atual
              </h3>
            </div>
            {selectedPlan === PLAN_KEYS.FREE ? (
              <img src='/selectedplan.png' className={styles.selected} />
            ) : (
              <div className={styles.notselected} />
            )}
          </button>

          <button
            type="button"
            className={selectedPlan === PLAN_KEYS.STANDARD ? `${styles.planbox} ${styles.plan2bg}` : styles.planboxnotselected}
            onClick={() => handlePlanSelect(PLAN_KEYS.STANDARD)}
          >
            <div>
              <p className={selectedPlan === PLAN_KEYS.STANDARD ? styles.themeplan : styles.themeplannotselected}>Padrão</p>
              <div className={styles.moneybox}>
                <p className={selectedPlan === PLAN_KEYS.STANDARD ? styles.moneyiconnotselected : styles.moneyicon}>R$</p>
                <h3 className={selectedPlan === PLAN_KEYS.STANDARD ? styles.typeplan : styles.typeplannotselected}>99,99</h3>
              </div>
            </div>
            {selectedPlan === PLAN_KEYS.STANDARD ? (
              <img src='/selectedplan.png' className={styles.selected} />
            ) : (
              <div className={styles.notselected} />
            )}
          </button>

          <button
            type="button"
            className={selectedPlan === PLAN_KEYS.PRO ? `${styles.planbox} ${styles.plan3bg}` : styles.planboxnotselected}
            onClick={() => handlePlanSelect(PLAN_KEYS.PRO)}
          >
            <div>
              <p className={selectedPlan === PLAN_KEYS.PRO ? styles.themeplan : styles.themeplannotselected}>Profissional</p>
              <div className={styles.moneybox}>
                <p className={selectedPlan === PLAN_KEYS.PRO ? styles.moneyiconnotselected : styles.moneyicon}>R$</p>
                <h3 className={selectedPlan === PLAN_KEYS.PRO ? styles.typeplan : styles.typeplannotselected}>199,99</h3>
              </div>
            </div>
            {selectedPlan === PLAN_KEYS.PRO ? (
              <img src='/selectedplan.png' className={styles.selected} />
            ) : (
              <div className={styles.notselected} />
            )}
          </button>
        </div>
      </div>

      {hasInteracted && (
        <button type="button" className={styles.moreButton}>
          Ver mais
        </button>
      )}
    </div>
  );
}