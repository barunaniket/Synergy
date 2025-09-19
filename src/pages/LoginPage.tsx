// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Hospital, LogIn, UserPlus, X } from 'lucide-react';

// Animation variants for the modal forms
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } },
  exit: { opacity: 0, scale: 0.9, y: 50 },
};

// Reusable Form Component
const AuthForm = ({ isRegister = false, userType }: { isRegister?: boolean, userType: 'Patient' | 'Hospital' }) => (
  <form className="space-y-4">
    {isRegister && userType === 'Patient' && (
      <div>
        <label className="text-sm font-medium text-text-secondary">Full Name</label>
        <input type="text" required className="w-full p-2 mt-1 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
      </div>
    )}
    {isRegister && userType === 'Hospital' && (
      <div>
        <label className="text-sm font-medium text-text-secondary">Hospital Name</label>
        <input type="text" required className="w-full p-2 mt-1 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
      </div>
    )}
    <div>
      <label className="text-sm font-medium text-text-secondary">Email Address</label>
      <input type="email" required className="w-full p-2 mt-1 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
    </div>
    <div>
      <label className="text-sm font-medium text-text-secondary">Password</label>
      <input type="password" required className="w-full p-2 mt-1 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
    </div>
    {isRegister && (
       <div>
        <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
        <input type="password" required className="w-full p-2 mt-1 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
      </div>
    )}
    <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
      {isRegister ? 'Register' : 'Login'}
    </button>
  </form>
);

// Modal Component
const AuthModal = ({ mode, userType, closeModal }: { mode: 'login' | 'register', userType: 'Patient' | 'Hospital', closeModal: () => void }) => {
  const isRegister = mode === 'register';
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-surface rounded-xl shadow-2xl w-full max-w-md border border-border"
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-text-primary">{mode === 'login' ? 'Login' : 'Register'} as a {userType}</h2>
          <button onClick={closeModal} className="text-text-secondary hover:text-text-primary"><X /></button>
        </div>
        <div className="p-6">
          <AuthForm isRegister={isRegister} userType={userType} />
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Login Page Component
function LoginPage() {
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register'; userType: 'Patient' | 'Hospital' }>({
    isOpen: false,
    mode: 'login',
    userType: 'Patient',
  });

  const openModal = (mode: 'login' | 'register', userType: 'Patient' | 'Hospital') => {
    setModalState({ isOpen: true, mode, userType });
  };

  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  return (
    <>
      <AnimatePresence>
        {modalState.isOpen && <AuthModal mode={modalState.mode} userType={modalState.userType} closeModal={closeModal} />}
      </AnimatePresence>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center pt-20">
        
        {/* Patient Section */}
        <motion.div 
          className="w-full lg:w-1/2 h-screen flex flex-col items-center justify-center p-8 bg-surface text-center"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <User className="h-20 w-20 text-primary mb-6" />
          <h1 className="text-4xl font-bold text-text-primary">For Patients</h1>
          <p className="mt-4 max-w-md text-text-secondary">
            Access your dashboard, manage appointments, and find the care you need quickly and efficiently.
          </p>
          <div className="mt-8 flex gap-4">
            <button onClick={() => openModal('login', 'Patient')} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white shadow hover:bg-primary/90">
              <LogIn className="mr-2 h-4 w-4" /> Patient Login
            </button>
            <button onClick={() => openModal('register', 'Patient')} className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-8 py-3 text-sm font-medium shadow-sm hover:bg-background">
              <UserPlus className="mr-2 h-4 w-4" /> Register
            </button>
          </div>
        </motion.div>

        {/* Hospital Section */}
        <motion.div 
          className="w-full lg:w-1/2 h-screen flex flex-col items-center justify-center p-8 bg-background text-center"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Hospital className="h-20 w-20 text-primary mb-6" />
          <h1 className="text-4xl font-bold text-text-primary">For Hospitals</h1>
          <p className="mt-4 max-w-md text-text-secondary">
            Manage your institution's profile, update capacity in real-time, and connect with patients in need of your specialized services.
          </p>
          <div className="mt-8 flex gap-4">
             <button onClick={() => openModal('login', 'Hospital')} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white shadow hover:bg-primary/90">
               <LogIn className="mr-2 h-4 w-4" /> Hospital Login
            </button>
            <button onClick={() => openModal('register', 'Hospital')} className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-8 py-3 text-sm font-medium shadow-sm hover:bg-surface">
              <UserPlus className="mr-2 h-4 w-4" /> Register
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default LoginPage;