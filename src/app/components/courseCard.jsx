import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/courseCard.module.css';

export default function CourseCard({ course }) {
  return (
    <Link href="/carrinho" className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardImageContainer}>
          <Image 
            src={course.image} 
            alt={course.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.imageTextOverlay}>
            <h3 className={styles.cardTitle}>{course.title}</h3>
            <span className={styles.durationBadge}>
                {course.duration}
            </span>
          </div>

        </div>
        
        <div className={styles.cardContent}>
            <div className={styles.priceContainer}>
              <span className={styles.currentPrice}>R${course.price}</span>
              {course.originalPrice && (
                <span className={styles.originalPrice}>R${course.originalPrice}</span>
              )}
            </div>
        </div>
      </div>
    </Link>
  );
}