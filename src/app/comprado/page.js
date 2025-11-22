'use client';

import { useRouter } from 'next/navigation';
import styles from '../styles/comprado.module.css';

const purchasedCourses = [
  { id: 1, title: 'IA Expertising Management', duration: '120 Horas' },
  { id: 2, title: 'IA Expertising Management', duration: '120 Horas' },
  { id: 3, title: 'IA Expertising Management', duration: '120 Horas' },
];

export default function Comprado() {
  const router = useRouter();

  return (
    <div className={styles.compradoContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Compra finalizada!</h1>
        <p className={styles.subtitle}>Parabéns! Você possui novos cursos adquiridos!</p>
      </div>

      <div className={styles.coursesGrid}>
        {purchasedCourses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <img src="/productbg.png" alt={course.title} className={styles.courseImage} />
            <div className={styles.courseInfo}>
              <p className={styles.courseName}>{course.title}</p>
              <span className={styles.courseDuration}>{course.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.backButton}
        onClick={() => router.push('/home')}
      >
        Voltar ao início
      </button>
    </div>
  );
}
