'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/courseDetail.module.css';

// Course data
const courseData = {
  id: 1,
  title: "IA Expertising Management",
  bannerText: "kaleidoscope",
  bannerSubtext: "铜或稱鋼鐵、鋼材 是一種由鐵與其他元素結合而成的合金",
  image: "/images/course1.png",
  price: "199,99",
  installments: "x10 de R$19,99",
  features: [
    "Apostila Incluído",
    "Aulas imersivas",
    "Estudo pomodoro",
    "Interação com professores"
  ],
  creator: {
    name: "ExoMorf Company",
    role: "Criador",
    rating: '5.0',
    logo: "/logoBus.png"
  },
  quote: "O futuro pertence a quem compreende que toda tecnologia começa na consciência.",
  description: "O IA Expertising Management é uma especialização futurista que forma líderes capazes de unir visão humana e inteligência artificial para tomar decisões estratégicas em ecossistemas complexos. Aqui, você aprende não só a usar IA, mas a pensar com ela.",
  ods: {
    title: "ODS 9 - Indústria, Inovação e Infraestrutura",
    description: "O curso promove o desenvolvimento responsável de sistemas de IA, fortalecendo a inovação tecnológica, a automação inteligente e a criação de infraestruturas digitais avançadas."
  },
  attributes: {
    duration: "75h 30min",
    content: "17 módulos",
    level: "Iniciante"
  }
};

// Suggested courses
const suggestedCourses = [
  {
    id: 2,
    title: "Design MultiV Learning",
    duration: "120horas",
    price: "R$199,99",
    image: "/images/SidebarProgress.png"
  },
  {
    id: 3,
    title: "CyberBlow in VR Prism Bop",
    duration: "370horas",
    price: "R$199,99",
    image: "/images/buyProducBG2.png"
  }
];

export default function Course() {
  const router = useRouter();

  const goBack = () => {
    window.history.back();
  };

  const handleBuy = () => {
    router.push('/finish');
  };

  const handleAddToCart = () => {
    router.push('/carrinho');
  };

  return (
    <div className={styles.mainContent}>
      <button 
        className={styles.backBtn}
        onClick={goBack}
        aria-label="Voltar para a página anterior"
      >
         Voltar
      </button>

      <div className={styles.courseLayout}>
        {/* Main Content Area */}
        <div className={styles.courseMain}>
          {/* Course Banner */}
          <div className={styles.courseBanner}>
            <Image 
              src={courseData.image} 
              alt={courseData.title}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>

          {/* Course Info Section */}
          <div className={styles.courseInfo}>
           

            {/* Creator Info */}
            <div className={styles.creatorSection}>
              <div className={styles.creatorInfo}>
                <img src={courseData.creator.logo} alt={courseData.creator.name} className={styles.creatorLogo} />
                <div>
                  <p className={styles.creatorName}>{courseData.creator.name}</p>
                  <p className={styles.creatorRole}>{courseData.creator.role}</p>
                </div>
              </div>
              <div className={styles.rating}>
                <img src="/starPath.png" alt="star" className={styles.starIcon} />
                <span>{courseData.creator.rating}</span>
              </div>
            </div>

            {/* Quote */}
            <blockquote className={styles.quote}>
              &quot;{courseData.quote}&quot;
            </blockquote>

            {/* Description */}
            <div className={styles.descriptionSection}>
              <h3 className={styles.sectionTitle}>Descrição</h3>
              <p className={styles.descriptionText}>{courseData.description}</p>
            </div>

            {/* ODS Section */}
            <div className={styles.odsSection}>
              <h3 className={styles.sectionTitle}>{courseData.ods.title}</h3>
              <p className={styles.odsText}>{courseData.ods.description}</p>
            </div>

            {/* Course Attributes */}
            <div className={styles.attributesSection}>
              <div className={styles.attributeBox}>
                <span className={styles.attributeLabel}>Duração</span>
                <span className={styles.attributeValue}>{courseData.attributes.duration}</span>
              </div>
              <div className={styles.attributeBox}>
                <span className={styles.attributeLabel}>Conteúdo</span>
                <span className={styles.attributeValue}>{courseData.attributes.content}</span>
              </div>
              <div className={styles.attributeBox}>
                <span className={styles.attributeLabel}>Nível</span>
                <span className={styles.attributeValue}>{courseData.attributes.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <aside className={styles.suggestionsSidebar}>

        <div className={styles.courseHeader}>
              <h2 className={styles.courseTitle}>{courseData.title}</h2>
              
              {/* Course Features */}
              <ul className={styles.courseFeatures}>
                {courseData.features.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <img src="/verify.png" alt="check" className={styles.verifyIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Price and Buttons */}
              <div className={styles.priceSection}>
                <div className={styles.priceInfo}>
                  <span className={styles.price}>R$ {courseData.price}</span>
                  <span className={styles.installments}>{courseData.installments}</span>
                </div>
                <div className={styles.actionButtons}>
                  <button className={styles.buyBtn} onClick={handleBuy}>
                    Comprar
                  </button>
                  <button className={styles.cartBtn} onClick={handleAddToCart}>
                    <img src="/cartPath.png" alt="Add to cart" />
                  </button>
                </div>
              </div>
            </div>


          <h3 className={styles.suggestionsTitle}>Sugestões</h3>
          <div className={styles.suggestedCourses}>
            {suggestedCourses.map((course) => (
              <Link key={course.id} href="/courses" className={styles.suggestedCard}>
                <div className={styles.suggestedImage}>
                  <Image 
                    src={course.image} 
                    alt={course.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
                <div className={styles.suggestedInfo}>
                  <h4 className={styles.suggestedTitle}>{course.title}</h4>
                  <span className={styles.suggestedDuration}>{course.duration}</span>
                  <span className={styles.suggestedPrice}>{course.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
