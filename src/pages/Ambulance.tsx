import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Ambulance, MapPin, ShieldCheck, Clock, Check, Loader2, X, ChevronDown, Phone, User, Siren, Activity } from 'lucide-react';

// --- HELPER COMPONENTS ---

const AnimatedWords = ({ text, el: Wrapper = 'span', className, stagger = 0.08 }: { text: string, el?: keyof JSX.IntrinsicElements, className?: string, stagger?: number }) => {
    const words = text.split(" ");
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: stagger, delayChildren: i * 0.04 } }),
    };
    const child = {
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
        hidden: { opacity: 0, y: 20, transition: { type: "spring", damping: 12, stiffness: 100 } },
    };
    return (
        <Wrapper>
            <motion.span className={className} variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.8 }}>
                {words.map((word, index) => (
                    <motion.span variants={child} className="inline-block" style={{ marginRight: '0.25em' }} key={index}>{word}</motion.span>
                ))}
            </motion.span>
        </Wrapper>
    );
};

// --- DATA ---

const ambulanceTypes = [
    { icon: Siren, title: "Advanced Life Support (ALS)", description: "Equipped with ventilators, ECG, and advanced medical equipment for critical patients." },
    { icon: Activity, title: "Basic Life Support (BLS)", description: "For patients who need medical transportation with basic monitoring and oxygen support." },
    { icon: Ambulance, title: "Patient Transport Vehicle", description: "For stable patients who need transportation to and from medical facilities for check-ups." },
];
const features = [
    { icon: Clock, title: "24/7 Availability", description: "Our services are available around the clock, 365 days a year, for any emergency." },
    { icon: ShieldCheck, title: "Certified Paramedics", description: "Every ambulance is staffed with highly trained and certified medical professionals." },
    { icon: MapPin, title: "Live GPS Tracking", description: "Track your ambulance in real-time from the moment it's dispatched until it arrives." },
];
const faqs = [
    { question: "How quickly can an ambulance arrive?", answer: "Arrival time varies based on your location and traffic conditions. Our dispatch system always assigns the nearest available ambulance to ensure the fastest possible response. You can see the estimated time of arrival (ETA) in real-time on our app." },
    { question: "What information do I need to provide when booking?", answer: "Please be ready to provide the patient's name, age, a brief description of the medical condition, the exact pickup address, and the destination (if known). This information helps us dispatch the appropriate type of ambulance and crew." },
    { question: "Can a family member accompany the patient?", answer: "Yes, typically one or two family members can accompany the patient in the ambulance, depending on the vehicle's capacity and the patient's condition. Please confirm with the dispatch team when you book." },
    { question: "How is payment handled for the ambulance service?", answer: "Payment can be made securely through our online platform at the time of booking or directly to the ambulance crew via various digital payment methods. We aim for a cashless and hassle-free experience." },
];

// --- MAIN PAGE COMPONENT ---
const AmbulanceBookingPage = () => {
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const arrowOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="overflow-x-hidden">
             <AnimatePresence>
                {isBookingModalOpen && <BookingModal closeModal={() => setIsBookingModalOpen(false)} />}
            </AnimatePresence>

            {/* Hero Section */}
            <motion.section ref={heroRef} className="h-screen flex items-center justify-center text-center relative pt-20">
                 <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent"></div>
                 <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="container mx-auto px-4 md:px-6 z-10">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }} className="inline-block bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full mb-4">
                        Ambulance Services
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
                        <AnimatedWords text="Reliable Emergency Transport," el="span" />
                        <br />
                        <span className="text-primary"><AnimatedWords text="On-Demand." el="span" /></span>
                    </h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }} className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
                       Fast, reliable, and professionally staffed. Book a fully equipped ambulance with real-time tracking in just a few taps. Your safety is our priority.
                    </motion.p>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }} className="mt-8">
                        <motion.button onClick={() => setIsBookingModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-primary/90">
                            Book an Ambulance Now <Siren className="ml-2 h-4 w-4" />
                        </motion.button>
                    </motion.div>
                </motion.div>
                <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" style={{ opacity: arrowOpacity }} animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <ChevronDown className="h-8 w-8 text-gray-500" />
                </motion.div>
            </motion.section>

            {/* Ambulance Types Section */}
            <section className="py-20 md:py-32 bg-surface border-y border-border">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <AnimatedWords text="Our Fleet of Ambulances" el="h2" className="text-4xl font-bold text-text-primary" />
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">Equipped to handle any medical situation with the utmost care.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {ambulanceTypes.map((service, i) => (
                            <motion.div key={i} whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }} className="bg-background p-8 rounded-2xl border border-border text-center">
                                <service.icon className="h-12 w-12 text-primary mx-auto mb-6" />
                                <h3 className="text-xl font-bold mb-2 text-text-primary">{service.title}</h3>
                                <p className="text-text-secondary">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
             {/* Features Section */}
            <section className="py-20 md:py-32">
                 <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <AnimatedWords text="Why Trust Synergy for Transport?" el="h2" className="text-4xl font-bold text-text-primary" />
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">We provide a service that is not just fast, but also safe, reliable, and transparent.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div key={i} className="bg-surface p-8 rounded-2xl border border-border">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-text-primary">{feature.title}</h3>
                                <p className="text-text-secondary">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                 </div>
            </section>
            
            {/* FAQ Section */}
            <section className="py-20 md:py-32 bg-surface border-y border-border">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <AnimatedWords text="Your Questions, Answered" el="h2" className="text-4xl font-bold text-text-primary" />
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-background border border-border rounded-xl overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left p-6">
                                    <span className="text-lg font-medium text-text-primary">{faq.question}</span>
                                    <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }}>
                                        <ChevronDown className="h-6 w-6 text-primary" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                {openFaq === index && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                                        <p className="p-6 pt-0 text-text-secondary">{faq.answer}</p>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Final CTA */}
            <section className="py-20 md:py-32 text-center">
                <div className="container mx-auto px-4 md:px-6">
                    <Ambulance className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold text-text-primary">In an Emergency, Every Second Matters.</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-text-secondary">Don't wait. Book a Synergy ambulance now for a fast and safe response.</p>
                    <div className="mt-8">
                        <motion.button onClick={() => setIsBookingModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
                           Book an Ambulance
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// --- BOOKING MODAL & STEPS ---
const BookingModal = ({ closeModal }: { closeModal: () => void }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-background rounded-2xl w-full max-w-lg shadow-xl relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && <BookingStep1 key={1} nextStep={nextStep} setFormData={setFormData} />}
                        {step === 2 && <BookingStep2 key={2} prevStep={prevStep} nextStep={nextStep} />}
                        {step === 3 && <BookingSuccess key={3} closeModal={closeModal} />}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

const BookingStep1 = ({ nextStep, setFormData }: { nextStep: () => void, setFormData: React.Dispatch<any> }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form).entries());
        setFormData((prev: any) => ({ ...prev, ...data }));
        nextStep();
    };

    return (
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ ease: 'easeInOut' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Patient Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-text-secondary">Patient's Full Name</label>
                    <input type="text" name="patientName" required className="w-full p-2 mt-1 border border-border rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-text-secondary">Patient's Age</label>
                    <input type="number" name="age" required className="w-full p-2 mt-1 border border-border rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-text-secondary">Briefly Describe Condition</label>
                    <textarea name="condition" required className="w-full p-2 mt-1 border border-border rounded-md" rows={3}></textarea>
                </div>
                <button type="submit" className="w-full mt-4 bg-primary text-white font-semibold py-3 rounded-lg">Next</button>
            </form>
        </motion.div>
    );
};

const BookingStep2 = ({ prevStep, nextStep }: { prevStep: () => void, nextStep: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            nextStep();
        }, 1500);
    };

    return (
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ ease: 'easeInOut' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Pickup & Destination</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-text-secondary">Pickup Address</label>
                    <input type="text" name="pickupAddress" required className="w-full p-2 mt-1 border border-border rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-text-secondary">Destination (Hospital or Address)</label>
                    <input type="text" name="destination" required className="w-full p-2 mt-1 border border-border rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-4">
                    <button type="button" onClick={prevStep} className="text-sm font-semibold">Back</button>
                    <button type="submit" disabled={isLoading} className="bg-primary text-white font-semibold py-3 px-6 rounded-lg disabled:bg-gray-300 transition-colors flex items-center">
                        {isLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                        Confirm & Dispatch
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const BookingSuccess = ({ closeModal }: { closeModal: () => void }) => (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.2, type: 'spring' } }} className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
            <Check size={32}/>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Ambulance Dispatched!</h2>
        <p className="text-text-secondary mb-6">The nearest ambulance is on its way. You will receive an SMS with a tracking link and the driver's details shortly. Please keep your phone line open.</p>
        <button onClick={closeModal} className="w-full bg-primary text-white font-semibold py-3 rounded-lg">Done</button>
    </motion.div>
);

export default AmbulanceBookingPage;
