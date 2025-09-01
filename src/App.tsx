import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FindHospitalPage from './pages/FindHospitalPage';

// This Layout component ensures the Navbar and Footer appear on every page
const Layout = () => {
  return (
    <div className="relative z-10">
      <Navbar />
      <main>
        {/* The Outlet component will render the current page */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="relative">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#D1D5DB_1px,transparent_1px)] [background-size:20px_20px] opacity-60"></div>
        
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="find-a-hospital" element={<FindHospitalPage />} />
              {/* We can add routes for Services, About, etc. later */}
            </Route>
          </Routes>
        </Router>

      </div>
    </div>
  );
}

export default App;

