import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import BentoFeatures from './sections/BentoFeatures';
import Philosophy from './sections/Philosophy';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Navigation />
      <main>
        <Hero />
        <BentoFeatures />
        <Philosophy />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
