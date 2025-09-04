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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- ENHANCED DATA STRUCTURE FOR EMERGENCIES ---
const emergencyTypes = [
  {
    id: 'cardiac',
    title: 'Cardiac Arrest / Heart Attack',
    description: 'Sudden loss of heart function, breathing, and consciousness.',
    Icon: HeartPulse,
    formFields: [
      { id: 'age', label: 'Patient\'s Approximate Age', type: 'number', placeholder: 'e.g., 55' },
      { id: 'conscious', label: 'Is the person conscious?', type: 'select', options: ['Yes', 'No', 'Unsure'] },
    ],
    results: {
      title: 'Cardiac Emergency: Immediate Actions',
      confirmation: 'The nearest hospital with a cardiac unit has been alerted. Expect a call from a medical professional shortly.',
      steps: [
        { text: 'Call your local emergency number immediately.', details: 'Provide your exact location and state that someone is unconscious and not breathing.' },
        { text: 'Begin CPR if you are trained.', details: 'If the person is unconscious, start chest compressions. Push hard and fast in the center of the chest, at a rate of 100 to 120 compressions a minute.' },
        { text: 'Use an Automated External Defibrillator (AED) if available.', details: 'Follow the device\'s voice prompts. It will analyze the heart rhythm and deliver a shock if needed.' },
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
    id: 'transplant',
    title: 'Organ Transplant Alert',
    description: 'Urgent coordination for organ transplant procedures.',
    Icon: Heart,
    formFields: [
      { id: 'organ', label: 'Required Organ', type: 'select', options: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea'] },
      { id: 'bloodType', label: 'Patient\'s Blood Type', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    ],
    results: {
        title: 'Urgent Transplant Coordination',
        confirmation: 'Your request has been broadcast to transplant centers in our network. A coordinator from the first available match will contact you directly.',
        isTransplant: true,
        steps: [
            { text: 'We are locating suitable hospitals.', details: 'Our system is matching your request with real-time availability in our network.' },
            { text: 'Prepare patient\'s medical records.', details: 'Have all relevant medical history, previous test results, and identification documents ready.' },
            { text: 'A specialist will contact you.', details: 'Once a match is found, a transplant coordinator from the hospital will reach out to you directly with further instructions.' },
        ],
        aiPrompt: 'The user requires an urgent organ transplant. Provide a calming message, explain that the system is searching for a hospital, and advise on what documents and information they should prepare while they wait for a call from a coordinator.',
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

// --- MAIN PAGE COMPONENT ---
const EmergencyPage = () => {
  const [step, setStep] = useState('selection'); // 'selection', 'form', 'result'
  const [selectedEmergency, setSelectedEmergency] = useState(emergencyTypes[0]);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleSelectEmergency = (emergency: typeof emergencyTypes[0]) => {
    setSelectedEmergency(emergency);
    const initialFormData = emergency.formFields.reduce((acc: FormData, field) => {
        acc[field.id] = '';
        return acc;
    }, { name: '', phone: '' }); // Add name and phone here
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
    <div className="overflow-x-hidden bg-background" onMouseMove={handleMouseMove} style={{
        backgroundImage: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(220, 38, 38, 0.08), transparent 40vw)`
    }}>
      <motion.section
        ref={heroRef}
        className="h-screen flex items-center justify-center text-center relative pt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/20 via-red-50/10 to-transparent"></div>
        
        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="container mx-auto px-4 md:px-6 z-10">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
             className="inline-block bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-full mb-4"
          >
            Emergency Response
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-bold text-gray-800"
          >
            Immediate Care, <br />
            <span className="text-red-600">When Every Second Counts.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            className="mt-6 max-w-3xl mx-auto text-lg text-gray-600"
          >
            This tool is designed to guide you through the immediate steps of a medical emergency. 
            <strong>If this is a life-threatening situation, call your local emergency number now.</strong>
          </motion.p>
        </motion.div>
        <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            style={{ opacity: arrowOpacity }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <ArrowDown className="h-8 w-8 text-gray-500" />
        </motion.div>
      </motion.section>

      <HowSynergyHelpsSection />

      <main className="py-20 md:py-28 min-h-screen relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(156,163,175,0.08)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="container mx-auto px-4 md:px-6 relative">
              <AnimatePresence mode="wait">
                {step === 'selection' && <EmergencySelection key="selection" onSelect={handleSelectEmergency} />}
                {step === 'form' && <EmergencyForm key="form" emergency={selectedEmergency} formData={formData} isLoading={isLoading} onChange={handleFormChange} onSubmit={handleFormSubmit} onBack={handleGoBack} />}
                {step === 'result' && <EmergencyResult key="result" result={selectedEmergency.results} onReset={handleReset} navigate={navigate} />}
              </AnimatePresence>
          </div>
      </main>
      
      <PreparednessGuide />

    </div>
  );
};

// --- NEW/UPDATED CONTENT SECTIONS ---
const slideshowImages = [
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
];

const HowSynergyHelpsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slideshowImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const imageRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ['7deg', '-7deg']);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-7deg', '7deg']);
    const shineX = useTransform(xSpring, [-0.5, 0.5], [-100, 200]);
    const shineY = useTransform(ySpring, [-0.5, 0.5], [-100, 200]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set((mouseX / width) - 0.5);
        y.set((mouseY / height) - 0.5);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <section ref={ref} className="py-20 md:py-32 bg-surface border-y border-border">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-16 items-center">
                <motion.div ref={imageRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, ease: 'easeOut' }} className="relative aspect-square w-full max-w-md mx-auto">
                    <AnimatePresence>
                        <motion.img
                            key={currentIndex}
                            src={slideshowImages[currentIndex]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            alt="Doctor using a tablet"
                            className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl"
                        />
                    </AnimatePresence>
                    <motion.div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: `radial-gradient(circle 200px at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.4), transparent)`, transform: 'translateZ(10px)' }}/>
                </motion.div>
                <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } } }}>
                    <motion.h2 variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }} className="text-4xl font-bold text-text-primary mb-6">How Synergy Helps in a Crisis</motion.h2>
                    <motion.p variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }} className="text-lg text-text-secondary mb-8">Our platform is more than a guide; it's a rapid response system. We use technology to cut through the chaos, providing clarity and connection when it's needed most.</motion.p>
                    <div className="space-y-6">
                        {[{ icon: Zap, title: 'Instant Hospital Alert System', text: 'Your submission instantly notifies the nearest appropriate medical facilities, giving them a critical head-start.' },
                         { icon: MapPin, title: 'Real-Time Availability Matching', text: 'We don\'t just find any hospital; we find the ones with the capacity and specialty to treat your specific emergency right now.' },
                         { icon: Bot, title: 'Guided Next Steps (AI-Powered)', text: 'Our system provides clear, calm instructions, preparing you for the next steps while you wait for professional help.' }
                        ].map((item) => (
                             <motion.div key={item.title} variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }} className="flex items-start">
                                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary"><item.icon /></div>
                                <div className="ml-4"><h4 className="font-bold text-lg text-text-primary">{item.title}</h4><p className="text-text-secondary">{item.text}</p></div>
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
        { icon: BookOpen, title: "Know Your Information", text: "Keep a list of allergies, medications, and medical history for everyone in your family." },
        { icon: BriefcaseMedical, title: "Have a First-Aid Kit", text: "Ensure your home and vehicle are equipped with a well-stocked first-aid kit." },
        { icon: ListChecks, title: "Make an Emergency Plan", text: "Designate a meeting place and emergency contacts. Practice the plan with your family." },
    ];

    return (
        <section ref={ref} className="py-20 md:py-32 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: 'easeOut' }}>
                    <h2 className="text-4xl font-bold text-text-primary">Be Prepared for Anything</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">A few simple steps can make a world of difference in an emergency. Here's how you can be ready.</p>
                </motion.div>
                <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 }}}} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, i) => (
                        <motion.div key={i} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' }}}} className="bg-surface p-8 rounded-2xl border border-border text-center">
                            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6"><item.icon size={32}/></div>
                            <h3 className="text-2xl font-bold mb-3 text-text-primary">{item.title}</h3>
                            <p className="text-text-secondary">{item.text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// --- SUB-COMPONENTS ---

// Step 1: Selection Grid
const EmergencySelection = ({ onSelect }: { onSelect: (e: any) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-text-primary">What is the nature of the emergency?</h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">Please select the option that best describes your situation to receive tailored guidance.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {emergencyTypes.map((emergency, i) => (
        <motion.div
          key={emergency.id}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.08 }}
          whileHover={{ scale: 1.05, y: -10, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
          className="bg-surface p-8 rounded-2xl border border-border text-center cursor-pointer flex flex-col"
          onClick={() => onSelect(emergency)} >
          <div className="flex-grow">
            <motion.div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6"
              animate={{ scale: [1, 1.1, 1], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }}}>
              <emergency.Icon size={32} />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 text-text-primary">{emergency.title}</h3>
            <p className="text-text-secondary">{emergency.description}</p>
          </div>
          <div className="mt-8">
            <span className="font-semibold text-primary inline-flex items-center">Select <ArrowRight className="ml-2 h-4 w-4" /></span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Step 2: Dynamic Form
const EmergencyForm = ({ emergency, formData, isLoading, onChange, onSubmit, onBack }: any) => (
  <motion.div
    initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '-100%' }} transition={{ duration: 0.5, ease: 'easeInOut' }}
    className="max-w-2xl mx-auto">
    <div className="text-center mb-12">
      <div className="flex justify-center items-center gap-4">
        <emergency.Icon className="h-10 w-10 text-primary" />
        <h2 className="text-4xl font-bold text-text-primary">{emergency.title}</h2>
      </div>
      <p className="mt-4 text-text-secondary">Please provide some crucial details to help us guide you.</p>
    </div>
    <form onSubmit={onSubmit} className="space-y-6 bg-surface p-8 rounded-2xl border border-border shadow-xl">
        <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Your Full Name</label>
                <input type="text" id="name" value={formData.name} onChange={onChange} required placeholder="For contact purposes" className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">Your Phone Number</label>
                <input type="tel" id="phone" value={formData.phone} onChange={onChange} required placeholder="So we can reach you" className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition" />
            </motion.div>
        </div>
        <hr className="border-border"/>
      {emergency.formFields.map((field: any, i: number) => (
        <motion.div key={field.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}>
          <label htmlFor={field.id} className="block text-sm font-medium text-text-secondary mb-2">{field.label}</label>
          {field.type === 'select' ? (
            <select id={field.id} value={formData[field.id]} onChange={onChange} required className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition">
              <option value="" disabled>Please select...</option>
              {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : field.type === 'textarea' ? (
             <textarea id={field.id} value={formData[field.id]} onChange={onChange} required rows={4} placeholder={field.placeholder} className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition" />
          ) : (
            <input type={field.type} id={field.id} value={formData[field.id]} onChange={onChange} required placeholder={field.placeholder} className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition" />
          )}
        </motion.div>
      ))}
      <div className="flex items-center justify-between pt-4">
         <motion.button type="button" onClick={onBack} className="inline-flex items-center rounded-md border border-border bg-transparent px-6 py-3 text-sm font-medium shadow-sm hover:bg-surface">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </motion.button>
          <motion.button type="submit" disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-primary/90 disabled:bg-primary/70 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {isLoading ? <Zap className="animate-spin h-5 w-5" /> : 'Get Guidance'}
          </motion.button>
      </div>
    </form>
  </motion.div>
);

// Step 3: Result and Action Plan
const EmergencyResult = ({ result, onReset, navigate }: any) => {
    const isTransplant = result.isTransplant || false;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.2 } }}>
                    <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                 </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary">{result.title}</h2>
                <p className="mt-4 text-green-700 bg-green-100 p-4 rounded-lg font-semibold text-lg">{result.confirmation}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <motion.div className="space-y-6" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } } }}>
                    {result.steps.map((step: any, i: number) => (
                        <motion.div key={i} className="flex items-start" variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}>
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg mr-5 mt-1">{i + 1}</div>
                            <div>
                                <h4 className="font-bold text-xl text-text-primary">{step.text}</h4>
                                <p className="text-text-secondary">{step.details}</p>
                            </div>
                        </motion.div>
                    ))}
                     {isTransplant && (
                        <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}>
                           <button onClick={() => navigate('/find-a-hospital')} className="w-full mt-6 inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-white shadow-lg transition-colors hover:bg-primary/90">
                              Proceed to Find a Hospital <ArrowRight className="ml-2 h-5 w-5" />
                           </button>
                        </motion.div>
                    )}
                </motion.div>
                <motion.div className="space-y-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5, ease: 'easeOut' } }}>
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-xl">
                        <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center"><MapPin className="mr-3 text-primary" /> Live Map</h3>
                        <p className="text-text-secondary mb-4">Displaying nearest emergency services and routing for incoming ambulance.</p>
                        <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                            <span className="text-gray-500">Map loading...</span>
                        </div>
                    </div>
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-xl">
                        <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center"><Bot className="mr-3 text-primary" /> Synergy AI Assistant</h3>
                        <p className="text-text-secondary mb-4">Our AI can provide real-time, voice-guided assistance. Launching soon.</p>
                         <div className="w-full p-4 bg-gray-200 rounded-lg">
                           <p className="text-sm text-gray-600 italic">"{result.aiPrompt}"</p>
                        </div>
                    </div>
                </motion.div>
            </div>
            <div className="text-center mt-16">
                 <motion.button onClick={onReset} className="inline-flex items-center rounded-md border border-border bg-transparent px-8 py-3 text-sm font-medium shadow-sm hover:bg-surface" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     Start Over or Report a Different Emergency
                 </motion.button>
            </div>
        </motion.div>
    );
};

export default EmergencyPage;

