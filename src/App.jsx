import Header from './components/Header';
import Home from './pages/Home';
import Portals from './pages/Portals';
import Footer from './components/Footer';

export default function App() {
  const path = window.location.pathname;
  const isPortalsRoute = path === '/portals' || path.startsWith('/portals/');

  if (isPortalsRoute) {
    return <Portals />;
  }

  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}
