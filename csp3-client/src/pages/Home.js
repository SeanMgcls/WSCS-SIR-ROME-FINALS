import React from 'react';
import Banner from '../components/Banner';
import Highlights from '../components/Highlights'; // Keep your existing Highlights
import { Container } from 'react-bootstrap';

// Import the new sections you'll create
import IntroSection from '../components/Homepage files/IntroSection';
import AboutSection from '../components/Homepage files/AboutSection';
import ContactSection from '../components/Homepage files/ContactSection';
import FeaturedProductsSection from '../components/Homepage files/FeaturedProductsSection'; // Will wrap Highlights

// Import CSS module for home page sections
import styles from '../components/css/Home.module.css';

export default function Home() {
    const bannerData = { // Renamed from pageData to bannerData for clarity
        title: "Welcome to The UA Shop",
        content: "Discover unique products tailored just for you. Quality, variety, and exceptional service.",
        destination: "/products",
        label: "Shop Now"
    };

    return (
        <React.Fragment>
            {/* Existing Banner Section */}
            <Banner data={bannerData} />

            {/* New Introduction Section */}
            <section className={styles.introSection}>
                <Container>
                    <IntroSection />
                </Container>
            </section>

            {/* New Featured Products Section */}
            <section className={styles.featuredProductsSection}>
                <Container>
                    <FeaturedProductsSection />
                </Container>
            </section>

            {/* New About Us Section */}
            <section className={styles.aboutSection}>
                <Container>
                    <AboutSection />
                </Container>
            </section>

            {/* New Contact Section */}
            <section className={styles.contactSection}>
                <Container>
                    <ContactSection />
                </Container>
            </section>
        </React.Fragment>
    );
}


