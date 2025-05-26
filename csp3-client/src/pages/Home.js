import React from 'react';
import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import { Container } from 'react-bootstrap';

import IntroSection from '../components/Homepage files/IntroSection';
import AboutSection from '../components/Homepage files/AboutSection';
import ContactSection from '../components/Homepage files/ContactSection';
import FeaturedProductsSection from '../components/Homepage files/FeaturedProductsSection';

import styles from '../components/css/Home.module.css';

export default function Home() {
    const bannerData = {
        title: "Welcome to The UA Shop",
        content: "Discover unique products tailored just for you. Quality, variety, and exceptional service.",
        destination: "/products",
        label: "Shop Now"
    };

    return (
        <React.Fragment>
            {/* Wrap Banner in a Container for width constraint */}
            <Container>
                <Banner data={bannerData} />
            </Container>

            <section className={styles.introSection}>
                <Container>
                    <IntroSection />
                </Container>
            </section>

            <section className={styles.featuredProductsSection}>
                <Container>
                    <FeaturedProductsSection />
                </Container>
            </section>

            <section className={styles.aboutSection}>
                <Container>
                    <AboutSection />
                </Container>
            </section>

            <section className={styles.contactSection}>
                <Container>
                    <ContactSection />
                </Container>
            </section>
        </React.Fragment>
    );
}