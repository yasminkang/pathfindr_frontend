'use client';

import { useRouter } from 'next/navigation';
import styles from '../styles/carrinho.module.css';

const cartItems = [
  {
    id: 1,
    title: 'IA Expertising Management',
    price: '199,99',
    image: '/productbg.png',
  },
  {
    id: 2,
    title: 'IA Expertising Management',
    price: '199,99',
    image: '/productbg.png',
  },
  {
    id: 3,
    title: 'IA Expertising Management',
    price: '199,99',
    image: '/productbg.png',
  },
];

 export default function Carrinho() {
   const router = useRouter();
  const subtotal = '199,99';
  const discount = '19,99';
  const total = '180,00';

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>Carrinho</h1>

      <div className={styles.cartContent}>
        <div className={styles.itemsList}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.productThumb}>
                <img src={item.image} alt={item.title} className={styles.productImage} />
              </div>

              <div className={styles.itemInfo}>
                <p className={styles.courseName}>{item.title}</p>
                <span className={styles.coursePrice}><p className={styles.moneyicon}>R$</p> {item.price}</span>
              </div>

              <button type="button" className={styles.removeBtn}>
                <img src="/trashPath.png" alt="Remover item" />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Pedido</h2>

        <div className={styles.summarybox}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>R$ {subtotal}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Desconto</span>
            <span>R$ {discount}</span>
          </div>
          </div>

          <div className={styles.summaryTotal}>
            <span className={styles.totalstyle}>Total</span>
            <span className={styles.pricestyle}><p className={styles.moneyicon}>R$</p> {total}</span>
          </div>

           <button
             type="button"
             className={styles.continueBtn}
             onClick={() => router.push('/finish')}
           >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
