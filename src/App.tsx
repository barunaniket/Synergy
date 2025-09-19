// src/App.tsx

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
import EmergencyPage from './pages/EmergencyPage';
import PharmacyPage from './pages/PharmacyPage';
import HomeCarePage from './pages/HomeCarePage';
import TelehealthPage from './pages/TelehealthPage';
import Ambulance from './pages/Ambulance';
import CuraPage from './pages/CuraPage';
import ArticlePage from './pages/ArticlePage';
import { Chatbot } from './components/Chatbot';
import LoginPage from './pages/LoginPage'; // <-- 1. IMPORT THE NEW PAGE

// This Layout is for all pages EXCEPT the AI pages
const DefaultLayout = () => {
  return (
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
            circle,
            rgba(156, 163, 175, 0.4) 1px,
            transparent 1px
          )
        `,
        backgroundSize: `20px 20px`,
      }}
    >
      <div className="relative">
        <Router>
          <Routes>
            {/* All standard pages go here, using the DefaultLayout */}
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<HomePage />} />
              <Route path="find-a-hospital" element={<FindHospitalPage />} />
              <Route path="hospital/:hospitalId" element={<HospitalDetailPage />} />
              <Route path="schedule/:hospitalId/:organ" element={<SchedulePage />} />
              <Route path="about" element={<AboutUsPage />} /> 
              <Route path="contact" element={<ContactUsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="emergency" element={<EmergencyPage />} />
              <Route path="pharmacy" element={<PharmacyPage />} />
              <Route path="home-visit" element={<HomeCarePage />} />
              <Route path="telehealth" element={<TelehealthPage />} />
              <Route path="ambulance" element={<Ambulance />} />
              <Route path="login" element={<LoginPage />} /> {/* <-- 2. ADD THE NEW ROUTE */}
            </Route>
            
            {/* The AI pages are separate and do NOT use the DefaultLayout */}
            <Route path="cura" element={<CuraPage />} />
            <Route path="article/:slug" element={<ArticlePage />} />
          </Routes>
        </Router>
        <Chatbot />
      </div>
    </div>
  );
}

export default App;