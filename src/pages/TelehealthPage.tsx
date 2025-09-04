import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Video, Calendar, UserCheck, ShieldCheck, HeartHandshake, Phone, MessageSquare, ArrowRight, ChevronDown, X, Check, Loader2, Brain, GitMerge, Users } from 'lucide-react';

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

const specialties = [
    { icon: HeartHandshake, title: "General Consultation", description: "For common ailments like colds, flu, infections, and general health check-ups." },
    { icon: Brain, title: "Mental Wellness", description: "Speak with therapists and psychiatrists for stress, anxiety, and mental health support." },
    { icon: Users, title: "Family Medicine", description: "Holistic care for all members of your family, from children to seniors." },
    { icon: GitMerge, title: "Specialist Opinion", description: "Get a second opinion or consultation from specialists in various fields like cardiology, dermatology, etc." },
];
const howItWorks = [
    { number: "01", title: "Choose a Specialty", description: "Select the medical specialty you need and browse available doctors." },
    { number: "02", title: "Book Your Slot", description: "Pick a date and time that fits your schedule for a video consultation." },
    { number: "03", title: "Consult Online", description: "Connect with your doctor via a secure video call and receive your e-prescription." },
];
const faqs = [
    { question: "Is Telehealth effective for diagnosis?", answer: "Telehealth is highly effective for a wide range of common conditions, follow-up consultations, and mental health support. For conditions requiring a physical examination or diagnostic tests, your online doctor will guide you on the next steps, which may include an in-person visit." },
    { question: "Is my consultation private and secure?", answer: "Absolutely. We use a HIPAA-compliant platform with end-to-end encryption for all our video consultations. Your privacy and the security of your medical information are our top priorities." },
    { question: "Can I get a prescription through a video consultation?", answer: "Yes, our doctors can issue an e-prescription if they deem it medically necessary during your consultation. This digital prescription can be used at our partner pharmacies or any pharmacy of your choice." },
    { question: "What equipment do I need for a telehealth visit?", answer: "All you need is a smartphone, tablet, or computer with a camera, microphone, and a stable internet connection. No special software is required; you can connect directly through your web browser." },
];

// --- MAIN PAGE COMPONENT ---
const TelehealthPage = () => {
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
                        Telehealth Services
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
                        <AnimatedWords text="Expert Medical Advice," el="span" />
                        <br />
                        <span className="text-primary"><AnimatedWords text="Anytime, Anywhere." el="span" /></span>
                    </h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }} className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
                        Connect with top-tier doctors and specialists through secure video consultations. Get professional medical advice, second opinions, and e-prescriptions without leaving your home.
                    </motion.p>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }} className="mt-8">
                        <motion.button onClick={() => setIsBookingModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-primary/90">
                            Book a Consultation <Video className="ml-2 h-4 w-4" />
                        </motion.button>
                    </motion.div>
                </motion.div>
                <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" style={{ opacity: arrowOpacity }} animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <ChevronDown className="h-8 w-8 text-gray-500" />
                </motion.div>
            </motion.section>

            {/* Specialties Section */}
            <section className="py-20 md:py-32 bg-surface border-y border-border">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <AnimatedWords text="Consultations for Every Need" el="h2" className="text-4xl font-bold text-text-primary" />
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">Access a wide range of medical specialties from our team of expert doctors.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {specialties.map((service, i) => (
                            <motion.div key={i} whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }} className="bg-background p-8 rounded-2xl border border-border text-center">
                                <service.icon className="h-12 w-12 text-primary mx-auto mb-6" />
                                <h3 className="text-xl font-bold mb-2 text-text-primary">{service.title}</h3>
                                <p className="text-text-secondary">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
             {/* How It Works Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                     <div className="text-center mb-16">
                        <AnimatedWords text="Booking a Consultation is Simple" el="h2" className="text-4xl font-bold text-text-primary" />
                    </div>
                    <div className="max-w-4xl mx-auto">
                        {howItWorks.map((step, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, delay: i * 0.2 }} className="flex items-start md:items-center gap-8 my-12">
                                <span className="text-6xl font-bold text-primary/20">{step.number}</span>
                                <div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2">{step.title}</h3>
                                    <p className="text-text-secondary text-lg">{step.description}</p>
                                </div>
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
                    <Video className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold text-text-primary">Ready to Talk to a Doctor?</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-text-secondary">Book your secure video consultation now and get the expert medical advice you need, right from your home.</p>
                    <div className="mt-8">
                        <motion.button onClick={() => setIsBookingModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
                           Book a Consultation
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
                        {step === 2 && <BookingStep2 key={2} prevStep={prevStep} nextStep={nextStep} setFormData={setFormData} />}
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
            <h2 className="text-2xl font-bold mb-6 text-center">Select a Specialty</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    {specialties.map(service => (
                        <label key={service.title} className="flex items-center p-4 border border-border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                            <input type="radio" name="service" value={service.title} required className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-3 font-medium text-text-primary">{service.title}</span>
                        </label>
                    ))}
                </div>
                <button type="submit" className="w-full mt-4 bg-primary text-white font-semibold py-3 rounded-lg">Next</button>
            </form>
        </motion.div>
    );
};

const BookingStep2 = ({ prevStep, nextStep, setFormData }: { prevStep: () => void, nextStep: () => void, setFormData: React.Dispatch<any> }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form).entries());
        setFormData((prev: any) => ({ ...prev, ...data }));
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            nextStep();
        }, 1500);
    };

    return (
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ ease: 'easeInOut' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Patient & Scheduling</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-text-secondary">Patient's Full Name</label>
                    <input type="text" name="patientName" required className="w-full p-2 mt-1 border border-border rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-text-secondary">Contact Number</label>
                    <input type="tel" name="phone" required className="w-full p-2 mt-1 border border-border rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-text-secondary">Preferred Date & Time</label>
                    <input type="datetime-local" name="datetime" required className="w-full p-2 mt-1 border border-border rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-4">
                    <button type="button" onClick={prevStep} className="text-sm font-semibold">Back</button>
                    <button type="submit" disabled={isLoading} className="bg-primary text-white font-semibold py-3 px-6 rounded-lg disabled:bg-gray-300 transition-colors flex items-center">
                        {isLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                        Confirm Booking
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
        <h2 className="text-2xl font-bold mb-2">Consultation Booked!</h2>
        <p className="text-text-secondary mb-6">Your request has been received. You will receive an SMS and email with the consultation link and details shortly.</p>
        <button onClick={closeModal} className="w-full bg-primary text-white font-semibold py-3 rounded-lg">Done</button>
    </motion.div>
);

export default TelehealthPage;
