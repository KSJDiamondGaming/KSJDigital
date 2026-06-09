import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

export default function App() {
  return (
    <main className="site">
      <Navbar />
      <Home />
      <Footer />
    </main>
  );
}