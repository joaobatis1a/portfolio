import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Frontista from "./components/Frontista";
import Training from "./components/Training";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import StarBackground from "./components/StarBackground";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

function App() {
    return (
        <main className="bg-black text-white overflow-hidden">
            <h1 className="sr-only">João Batista, Desenvolvedor Front-End em Recife | React, Next.js e TypeScript</h1>
            <StarBackground />
            <div className="relative z-10">
                <Navbar />
                <div className="bg-black">
                    <Hero />
                </div>
                <About />
                <Skills />
                <Projects />
                <Frontista />
                <Training />
                <Experience />
                <Contact />
                <Footer />
                <BackToTop />
            </div>
        </main>
    );
}

export default App;
