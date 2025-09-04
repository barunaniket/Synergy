import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  Heart,
  Siren,
  HelpCircle,
  ChevronLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  ShieldAlert,
  Bot,
  HeartPulse,
  Wind,
  Brain,
  Bone,
  Eye,
  Activity,
  ArrowDown,
  ArrowRight,
  Droplets,
  Zap,
  BookOpen,
  BriefcaseMedical,
  ListChecks,
  ShieldPlus,
  Stethoscope,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- ENHANCED DATA STRUCTURE FOR EMERGENCIES ---
const emergencyTypes = [
    {
    id: 'transplant',
    title: 'Organ Transplant Alert',
    description: 'Urgent coordination for organ transplant procedures.',
    Icon: Heart,
    formFields: [
      { id: 'organ', label: 'Required Organ', type: 'select', options: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea'] },
      { id: 'bloodType', label: "Patient's Blood Type", type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    ],
    results: {
      title: 'Urgent Transplant Coordination',
      confirmation: 'Your request has been broadcast to transplant centers in our network. A coordinator from the first available match will contact you directly.',
      isTransplant: true,
      steps: [
        { text: 'We are locating suitable hospitals.', details: 'Our system is matching your request with real-time availability in our network.' },
        { text: "Prepare patient's medical records.", details: 'Have all relevant medical history, previous test results, and identification documents ready.' },
        { text: 'A specialist will contact you.', details: 'Once a match is found, a transplant coordinator from the hospital will reach out to you directly with further instructions.' },
      ],
      aiPrompt: 'The user requires an urgent organ transplant. Provide a calming message, explain that the system is searching for a hospital, and advise on what documents and information they should prepare while they wait for a call from a coordinator.',
    },
  },
  {
    id: 'cardiac',
    title: 'Cardiac Arrest / Heart Attack',
    description: 'Sudden loss of heart function, breathing, and consciousness.',
    Icon: HeartPulse,
    formFields: [
      { id: 'age', label: "Patient's Approximate Age", type: 'number', placeholder: 'e.g., 55' },
      { id: 'conscious', label: 'Is the person conscious?', type: 'select', options: ['Yes', 'No', 'Unsure'] },
    ],
    results: {
      title: 'Cardiac Emergency: Immediate Actions',
      confirmation: 'The nearest hospital with a cardiac unit has been alerted. Expect a call from a medical professional shortly.',
      steps: [
        { text: 'Call your local emergency number immediately.', details: 'Provide your exact location and state that someone is unconscious and not breathing.' },
        { text: 'Begin CPR if you are trained.', details: 'If the person is unconscious, start chest compressions. Push hard and fast in the center of the chest, at a rate of 100 to 120 compressions a minute.' },
        { text: 'Use an Automated External Defibrillator (AED) if available.', details: "Follow the device's voice prompts. It will analyze the heart rhythm and deliver a shock if needed." },
        { text: 'Do not give the person anything by mouth.', details: 'This includes water, food, or medication, as it could pose a choking hazard.' },
      ],
      aiPrompt: 'The user has reported a cardiac emergency. Provide immediate, clear, and calm guidance on performing CPR and using an AED while waiting for emergency services to arrive.',
    },
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    description: 'Uncontrolled bleeding from a wound that can be life-threatening.',
    Icon: Droplets,
    formFields: [
      { id: 'location', label: 'Location of the wound', type: 'text', placeholder: 'e.g., Arm, Leg, Chest' },
      { id: 'cause', label: 'Cause of injury (if known)', type: 'text', placeholder: 'e.g., Cut, Accident' },
    ],
    results: {
      title: 'Severe Bleeding: Control Measures',
      confirmation: 'Emergency services have been notified of a severe bleeding incident. A trauma-equipped unit is being routed. Expect a call to confirm details.',
      steps: [
        { text: 'Call for emergency help immediately.', details: 'This is a critical first step.' },
        { text: 'Apply firm, direct pressure on the wound.', details: 'Use a clean cloth, bandage, or your hands. Maintain pressure continuously.' },
        { text: 'Elevate the injured limb above the heart if possible.', details: 'This helps to reduce blood flow to the area.' },
        { text: 'Apply a tourniquet only if bleeding is severe and does not stop with direct pressure.', details: 'Place it 2-3 inches above the wound, but not on a joint. Tighten until bleeding stops. Note the time it was applied.' },
      ],
      aiPrompt: 'The user is dealing with severe bleeding. Guide them through applying direct pressure, elevation, and when and how to properly use a tourniquet.',
    },
  },
  {
    id: 'stroke',
    title: 'Stroke',
    description: 'A medical emergency where blood supply to the brain is interrupted.',
    Icon: Brain,
    formFields: [
      { id: 'symptoms', label: 'Observed Symptoms (F.A.S.T.)', type: 'text', placeholder: 'e.g., Face drooping, Arm weakness, Speech difficulty' },
      { id: 'time', label: 'When did symptoms first appear?', type: 'text', placeholder: 'e.g., 10 minutes ago' },
    ],
    results: {
      title: 'Suspected Stroke: F.A.S.T. Actions',
      confirmation: 'The nearest certified stroke center has been put on standby. An ambulance is being dispatched. You will be contacted for confirmation.',
      steps: [
        { text: 'Immediately call emergency services.', details: 'Time is critical in treating a stroke. Note the time the first symptoms appeared.' },
        { text: 'Remember the F.A.S.T. acronym:', details: 'Face Drooping, Arm Weakness, Speech Difficulty, Time to call for help.' },
        { text: 'Keep the person comfortable and reassured.', details: 'Lay them down on their side if they are unconscious to prevent choking.' },
        { text: 'Do not give them anything to eat or drink.', details: 'Their ability to swallow may be impaired.' },
      ],
      aiPrompt: 'A stroke is suspected. Reinforce the F.A.S.T. acronym and provide guidance on keeping the person safe and comfortable while waiting for the ambulance. Emphasize the importance of noting the time of symptom onset.',
    },
  },
  {
    id: 'allergic_reaction',
    title: 'Severe Allergic Reaction',
    description: 'Anaphylaxis is a severe, potentially life-threatening allergic reaction.',
    Icon: ShieldPlus,
    formFields: [
      { id: 'allergen', label: 'Known Allergen (if any)', type: 'text', placeholder: 'e.g., Peanut, Bee sting' },
      { id: 'symptoms', label: 'Primary Symptoms', type: 'text', placeholder: 'e.g., Swelling, Difficulty breathing' },
    ],
    results: {
      title: 'Anaphylaxis: Emergency Response',
      confirmation: 'Emergency services have been alerted to a severe allergic reaction. Paramedics are en route. Please describe the symptoms to the dispatcher.',
      steps: [
        { text: 'Call for emergency medical help immediately.', details: 'State that the person is having a severe allergic reaction (anaphylaxis).' },
        { text: 'Administer an epinephrine auto-injector (EpiPen) if available.', details: 'Press the device firmly against the outer thigh. Follow the instructions on the device.' },
        { text: 'Have the person lie flat on their back.', details: 'If they are having trouble breathing or are vomiting, let them sit up or lie on their side.' },
        { text: 'Loosen any tight clothing.', details: 'This will help with breathing and circulation. Cover them with a blanket if available.' },
      ],
      aiPrompt: 'The user is reporting a severe allergic reaction. Guide them on using an epinephrine auto-injector, positioning the person for comfort and safety, and what information to provide to emergency dispatchers.',
    },
  },
  {
    id: 'other',
    title: 'Other Emergency',
    description: 'For other urgent medical situations not listed above.',
    Icon: HelpCircle,
    formFields: [
      { id: 'situation', label: 'Briefly describe the situation', type: 'textarea', placeholder: 'e.g., Severe allergic reaction, possible fracture...' },
    ],
    results: {
      title: 'General Emergency Guidance',
      confirmation: 'Local emergency responders have been notified with the information you provided. Please keep your phone line open for their call.',
      steps: [
        { text: 'Call your local emergency number immediately.', details: 'This is the most important step in any medical emergency. Provide clear information to the dispatcher.' },
        { text: 'Do not move the person unless they are in immediate danger.', details: 'Moving someone with a potential neck or spine injury can cause further harm.' },
        { text: 'Stay on the line with the dispatcher.', details: 'They can provide life-saving instructions until help arrives.' },
        { text: 'Keep the person calm and warm.', details: 'Reassurance can help reduce shock and anxiety.' },
      ],
      aiPrompt: 'The user has an undefined emergency. Provide general, safe, and universally applicable first aid advice, emphasizing calling emergency services and not moving the patient unless necessary. Ask for more details to offer specific help.',
    },
  },
];

// Type definition for form data
type FormData = { [key: string]: string };

// Animation variants for premium feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

// --- MAIN PAGE COMPONENT ---
const EmergencyPage = () => {
  const [step, setStep] = useState('selection'); // 'selection', 'form', 'result'
  const [selectedEmergency, setSelectedEmergency] = useState(emergencyTypes[0]);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const bgTextOpacity = useTransform(scrollYProgress, [0, 0.5], [0.15, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleSelectEmergency = (emergency: typeof emergencyTypes[0]) => {
    setSelectedEmergency(emergency);
    const initialFormData = emergency.formFields.reduce((acc: FormData, field) => {
      acc[field.id] = '';
      return acc;
    }, { name: '', phone: '' });
    setFormData(initialFormData);
    setStep('form');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('result');
    }, 1500);
  };

  const handleGoBack = () => setStep('selection');

  const handleReset = () => {
    setStep('selection');
    setTimeout(() => setFormData({}), 300);
  };

  return (
    <div
      className="min-h-screen bg-white overflow-x-hidden"
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: 'radial-gradient(circle at center, #e9ecef 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(220, 38, 38, 0.1), transparent 40vw)`,
        }}
      />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center text-center pt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/20 via-white to-white" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: bgTextOpacity }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1585435557343-3b0929fb0483?q=80&w=2070&auto=format&fit=crop')`,
              filter: 'grayscale(20%)',
            }}
          />
          <div className="relative text-center">
            <h2 className="text-8xl md:text-9xl font-extrabold text-gray-200/50 uppercase tracking-tight">
              Rapid Response
            </h2>
            <h2 className="text-6xl md:text-7xl font-bold text-gray-200/50 uppercase tracking-tight">
              When Lives Are at Stake
            </h2>
          </div>
        </motion.div>
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="container mx-auto px-4 md:px-6 z-10 relative"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="inline-flex items-center bg-red-100/90 backdrop-blur-sm text-red-600 font-semibold px-6 py-3 rounded-full mb-6 shadow-lg"
          >
            <Siren className="w-5 h-5 mr-2" />
            Emergency Response System
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight"
          >
            Rapid Response, <br />
            <span className="text-red-600">When Lives Are at Stake.</span>
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed"
          >
            Our platform provides precise, real-time guidance to navigate medical emergencies effectively.
            <strong className="font-semibold"> For life-threatening situations, call emergency services now.</strong>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8"
          >
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-full bg-red-600 text-white px-8 py-4 text-lg font-medium shadow-lg hover:bg-red-700 transition-all duration-300"
            >
              Act Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          style={{ opacity: arrowOpacity }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-10 w-10 text-gray-500" />
        </motion.div>
      </motion.section>

      <HowSynergyHelpsSection />

      <main className="py-24 md:py-32 min-h-screen relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e9ecef_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <AnimatePresence mode="wait">
            {step === 'selection' && <EmergencySelection key="selection" onSelect={handleSelectEmergency} />}
            {step === 'form' && (
              <EmergencyForm
                key="form"
                emergency={selectedEmergency}
                formData={formData}
                isLoading={isLoading}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                onBack={handleGoBack}
              />
            )}
            {step === 'result' && <EmergencyResult key="result" result={selectedEmergency.results} onReset={handleReset} navigate={navigate} />}
          </AnimatePresence>
        </div>
      </main>

      <PreparednessGuide />
      <FooterCTA />
    </div>
  );
};

// --- ENHANCED SECTIONS ---

const slideshowImages = [
  '/dl.beatsnoop.com-final-g2DH7YbIa8.jpg',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg',
];

const HowSynergyHelpsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slideshowImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const imageRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-6deg', '6deg']);
  const shineX = useTransform(xSpring, [-0.5, 0.5], [-100, 200]);
  const shineY = useTransform(ySpring, [-0.5, 0.5], [-100, 200]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section ref={ref} className="py-24 md:py-36 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          ref={imageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative aspect-square w-full max-w-lg mx-auto"
        >
          <AnimatePresence>
            <motion.img
              key={currentIndex}
              src={slideshowImages[currentIndex]}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              alt="Medical professional"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl border border-gray-200"
            />
          </AnimatePresence>
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ background: `radial-gradient(circle 200px at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.3), transparent)`, transform: 'translateZ(20px)' }}
          />
        </motion.div>
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900">
            Synergy: Your Crisis Companion
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 leading-relaxed">
            Our platform leverages advanced technology to provide swift, reliable, and compassionate emergency guidance, ensuring you get the right care when it matters most.
          </motion.p>
          <div className="space-y-6">
            {[
              { icon: Zap, title: 'Instant Hospital Alerts', text: 'Notifies specialized medical facilities instantly, ensuring rapid response.' },
              { icon: MapPin, title: 'Precision Matching', text: 'Connects you with hospitals equipped for your specific emergency in real-time.' },
              { icon: Bot, title: 'AI-Guided Support', text: 'Delivers clear, step-by-step instructions powered by advanced AI.' },
            ].map((item) => (
              <motion.div key={item.title} variants={itemVariants} className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-red-100/90 text-red-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-xl text-gray-900">{item.title}</h4>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const PreparednessGuide = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const items = [
    { icon: BookOpen, title: 'Know Your Information', text: 'Keep a list of allergies, medications, and medical history for everyone in your family.' },
    { icon: BriefcaseMedical, title: 'Have a First-Aid Kit', text: 'Ensure your home and vehicle are equipped with a well-stocked first-aid kit.' },
    { icon: ListChecks, title: 'Make an Emergency Plan', text: 'Designate a meeting place and emergency contacts. Practice the plan with your family.' },
  ];

  return (
    <section ref={ref} className="py-24 md:py-36 bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e9ecef_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Prepare for Any Emergency</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Proactive preparation can make all the difference. Follow these steps to be ready.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -10, boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg text-center backdrop-blur-sm"
            >
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100/90 text-red-600 mb-6">
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FooterCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 md:py-36 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Stethoscope className="h-12 w-12 text-red-600 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Join the Synergy Network</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Connect with Synergy to access or provide life-saving care seamlessly, wherever you are.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/find-a-hospital"
              className="inline-flex h-12 items-center justify-center rounded-md bg-red-600 px-8 text-sm font-medium text-white shadow-lg hover:bg-red-700 transition-all duration-300"
            >
              Find a Hospital
            </a>
            <a
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-transparent px-8 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- SUB-COMPONENTS ---

const EmergencySelection = ({ onSelect }: { onSelect: (e: any) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.6 }}
    className="relative z-10"
  >
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Select Emergency Type</h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
        Choose the situation that best matches your emergency for tailored, life-saving guidance.
      </p>
    </div>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {emergencyTypes.map((emergency, i) => (
        <motion.div
          key={emergency.id}
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -12, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)' }}
          whileTap={{ scale: 0.98 }}
          className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg text-center cursor-pointer flex flex-col backdrop-blur-sm"
          onClick={() => onSelect(emergency)}
        >
          <div className="flex-grow">
            <motion.div
              className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100/90 text-red-600"
              animate={{ scale: [1, 1.15, 1], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <emergency.Icon size={32} />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">{emergency.title}</h3>
            <p className="text-gray-600">{emergency.description}</p>
          </div>
          <div className="mt-8">
            <span className="font-semibold text-red-600 inline-flex items-center">
              Select <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

const EmergencyForm = ({ emergency, formData, isLoading, onChange, onSubmit, onBack }: any) => (
  <motion.div
    initial={{ opacity: 0, x: '100%' }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: '-100%' }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
    className="max-w-2xl mx-auto"
  >
    <div className="text-center mb-12">
      <div className="flex justify-center items-center gap-4">
        <emergency.Icon className="h-12 w-12 text-red-600" />
        <h2 className="text-4xl font-bold text-gray-900">{emergency.title}</h2>
      </div>
      <p className="mt-4 text-gray-600">Provide critical details to ensure swift and accurate assistance.</p>
    </div>
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg backdrop-blur-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">
            Your Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={onChange}
            required
            placeholder="For contact purposes"
            className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-2">
            Your Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={onChange}
            required
            placeholder="So we can reach you"
            className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
      </div>
      <hr className="border-gray-200" />
      {emergency.formFields.map((field: any, i: number) => (
        <motion.div key={field.id} variants={itemVariants}>
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
            {field.label}
          </label>
          {field.type === 'select' ? (
            <select
              id={field.id}
              value={formData[field.id]}
              onChange={onChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
            >
              <option value="" disabled>
                Please select...
              </option>
              {field.options.map((opt: string) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.id}
              value={formData[field.id]}
              onChange={onChange}
              required
              rows={4}
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
            />
          ) : (
            <input
              type={field.type}
              id={field.id}
              value={formData[field.id]}
              onChange={onChange}
              required
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
            />
          )}
        </motion.div>
      ))}
      <div className="flex items-center justify-between pt-4">
        <motion.button
          type="button"
          onClick={onBack}
          className="inline-flex items-center rounded-md border border-gray-200 bg-transparent px-6 py-3 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </motion.button>
        <motion.button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? <Zap className="animate-spin h-5 w-5" /> : 'Get Guidance'}
        </motion.button>
      </div>
    </motion.form>
  </motion.div>
);

const EmergencyResult = ({ result, onReset, navigate }: any) => {
  const isTransplant = result.isTransplant || false;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-4xl mx-auto relative"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.2 } }}
        >
          <CheckCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{result.title}</h2>
        <p className="mt-4 text-green-700 bg-green-100/90 p-4 rounded-lg font-semibold text-lg backdrop-blur-sm">
          {result.confirmation}
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {result.steps.map((step: any, i: number) => (
            <motion.div
              key={i}
              className="flex items-start"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-red-600 text-white font-bold text-lg mr-5 mt-1">
                {i + 1}
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900">{step.text}</h4>
                <p className="text-gray-600">{step.details}</p>
              </div>
            </motion.div>
          ))}
          {isTransplant && (
            <motion.div variants={itemVariants}>
              <button
                onClick={() => navigate('/find-a-hospital')}
                className="w-full mt-6 inline-flex items-center justify-center rounded-md bg-red-600 px-8 py-4 text-base font-medium text-white shadow-lg hover:bg-red-700 transition-all duration-300"
              >
                Proceed to Find a Hospital <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
          )}
        </motion.div>
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5, ease: 'easeOut' } }}
        >
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="mr-3 text-red-600" /> Live Map
            </h3>
            <p className="text-gray-600 mb-4">
              Tracking nearest emergency services and ambulance routing in real-time.
            </p>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-blue-100/50"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
              />
              <span className="text-gray-500 z-10">Map loading...</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Bot className="mr-3 text-red-600" /> Synergy AI Assistant
            </h3>
            <p className="text-gray-600 mb-4">
              Our AI provides real-time, voice-guided assistance. Available soon.
            </p>
            <div className="w-full p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 italic">"{result.aiPrompt}"</p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="text-center mt-16">
        <motion.button
          onClick={onReset}
          className="inline-flex items-center rounded-md border border-gray-200 bg-transparent px-8 py-3 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Over or Report a Different Emergency
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EmergencyPage;