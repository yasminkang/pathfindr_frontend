'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/home.module.css';
import CourseCard from '../components/courseCard.jsx';

const featuredCourses = [
  {
    id: 1,
    title: "IA Expertising Management",
    image: "/images/course1.png",
    buttonText: "Ver detalhes"
  },
  {
    id: 2,
    title: "Python Analytics Pro",
    image: "/images/SidebarProgress.png",
    buttonText: "Ver detalhes"
  },
  {
    id: 3,
    title: "UI/UX Design Mastery",
    image: "/images/buyProducBG2.png",
    buttonText: "Ver detalhes"
  }
];

const extendedCourses = [...featuredCourses, featuredCourses[0]];
const courses = [
  { id: 1, title: "IA Expertising Management", duration: "120 Horas", price: 199.99, image: "/images/course1.png" },
  { id: 2, title: "Design MultiV Learning", duration: "120 Horas", price: 199.99, image: "/images/SidebarProgress.png" },
  { id: 3, title: "Exo-Design in VR Multipoly", duration: "120 Horas", price: 199.99, image: "/images/buyProducBG2.png" }
];

const categories = [
  "Negócios & Gestão", "Artes & Design", "Saúde & Bem-estar", 
  "Engenharia & Indústria", "Ciências & Sociais", "Educação", 
  "Tech & Dados", "Meio Ambiente & Sustentabilidade"
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const isTransitioning = useRef(false);

  // 自动轮播逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning.current) {
        setCurrentIndex(prev => (prev + 1) % extendedCourses.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleTransitionEnd = () => {
      if (currentIndex === extendedCourses.length - 1) {
        track.style.transition = 'none';
        setCurrentIndex(0);
        setTimeout(() => track.style.transition = 'transform 0.8s ease-in-out', 50);
      }
      isTransitioning.current = false;
    };

    track.addEventListener('transitionend', handleTransitionEnd);
    return () => track.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="barra de pesquisa" 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.carouselWrapper}>
        <section className={styles.heroCarousel}>
          <div 
            ref={trackRef}
            className={styles.carouselTrack}
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: currentIndex === 0 ? 'none' : 'transform 0.8s ease-in-out'
            }}
          >
            {extendedCourses.map((course, index) => (
              <div key={`${course.id}-${index}`} className={styles.carouselSlide}>
                <div className={styles.slideImage}>
                  <Image 
                    src={course.image} 
                    alt={course.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
                <div className={styles.slideContent}>
                  <h2 className={styles.slideTitle}>{course.title}</h2>
                  <Link href="/courses">
                    <button className={styles.slideBtn}>{course.buttonText}</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.carouselIndicators}>
          {featuredCourses.map((_, index) => (
            <span
              key={index}
              className={`${styles.indicator} ${index === currentIndex % featuredCourses.length ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>

      <section className={styles.categoriesSection}>
        <div className={styles.categoriesList}>
          {categories.map((category, index) => (
            <button key={index} className={styles.categoryBtn}>{category}</button>
          ))}
        </div>
      </section>

      <section className={styles.coursesSection}>
        <div className={styles.coursesGrid}>
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}

