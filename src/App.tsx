import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FindHospitalPage from './pages/FindHospitalPage';
import HospitalDetailPage from './pages/HospitalDetailPage';
import SchedulePage from './pages/SchedulePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import EmergencyPage from './pages/EmergencyPage.tsx'; // Added import for EmergencyPage

const Layout = () => {
  return (
    // By removing className="relative", we fix the stacking issue.
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty("--x", `${x}px`);
    target.style.setProperty("--y", `${y}px`);
  };

  return (
    <div 
      className="min-h-screen bg-background text-text-primary" 
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: `
          radial-gradient(
            circle at var(--x) var(--y),
            hsla(175, 100%, 70%, 0.25),
            transparent 30vw
          ),
          radial-gradient(
            circle,
            rgba(156, 163, 175, 0.4) 1px,
            transparent 1px
          )
        `,
        backgroundSize: `auto, 20px 20px`,
      }}
    >
      {/* This 'relative' is needed for the background effect, but the one in Layout was causing the issue. */}
      <div className="relative">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="find-a-hospital" element={<FindHospitalPage />} />
              <Route path="hospital/:hospitalId" element={<HospitalDetailPage />} />
              <Route path="schedule/:hospitalId/:organ" element={<SchedulePage />} />
              <Route path="about" element={<AboutUsPage />} /> 
              <Route path="contact" element={<ContactUsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="emergency" element={<EmergencyPage />} /> {/* Added route for EmergencyPage */}
            </Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;