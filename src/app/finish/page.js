'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/finish.module.css';
import cartStyles from '../styles/carrinho.module.css';

const paymentOptions = [
  {
    id: 'pix',
    label: 'PIX',
    description: '',
    icon: '/pix.png',
  },
  {
    id: 'mastercard',
    label: 'MasterCard **** 1234',
    description: '',
    icon: '/mastercard.png',
  },
  {
    id: 'visa',
    label: 'VISA **** 1234',
    description: '',
    icon: '/visa.png',
  },
];

 export default function Finish() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState('pix');
  const subtotal = '199,99';
  const discount = '19,99';
  const total = '180,00';

  return (
    <div className={styles.finishContainer}>
      <h1 className={styles.title}>Finalizar compra</h1>

      <div className={styles.finishContent}>
        <div className={styles.paymentColumn}>
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.paymentOption} ${
                selectedPayment === option.id ? styles.paymentOptionSelected : ''
              }`}
              onClick={() => setSelectedPayment(option.id)}
            >
              <div className={styles.paymentInfo}>
                <img src={option.icon} alt={option.label} className={styles.paymentIcon} />
                <span className={styles.paymentLabel}>{option.label}</span>
              </div>
              <img
                src={selectedPayment === option.id ? '/selected.png' : '/notselected.png'}
                alt={selectedPayment === option.id ? 'Selecionado' : 'Não selecionado'}
                className={styles.selectorIcon}
              />
            </button>
          ))}

          <button type="button" className={styles.addPayment}>
            + Adicionar forma de pagamento
          </button>
        </div>

        <div className={`${cartStyles.summaryCard} ${styles.orderSummary}`}>
          <h2 className={cartStyles.summaryTitle}>Pedido</h2>

          <div className={cartStyles.summarybox}>
            <div className={cartStyles.summaryRow}>
              <span>Subtotal</span>
              <span>R$ {subtotal}</span>
            </div>

            <div className={cartStyles.summaryRow}>
              <span>Desconto</span>
              <span>R$ {discount}</span>
            </div>
          </div>

          <div className={cartStyles.summaryTotal}>
            <span className={cartStyles.totalstyle}>Total</span>
            <span className={cartStyles.pricestyle}>
              <p className={styles.moneyicon}>R$</p> {total}
            </span>
          </div>

          <button
            type="button"
            className={cartStyles.continueBtn}
            onClick={() => router.push('/comprado')}
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}
