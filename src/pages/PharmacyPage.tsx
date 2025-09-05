import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Pill, UploadCloud, FileCheck2, Truck, ShieldCheck, MessageSquare, Repeat, Package, Search, ArrowRight, ChevronDown, Star, X, Check, Loader2 } from 'lucide-react';
import { getPrescriptionDetailsFromImage } from '../services/gemini'; // Import our new AI service

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
// ... (All data arrays like howItWorksSteps, features, etc. remain unchanged)
const howItWorksSteps = [
    { icon: UploadCloud, title: "1. Upload Prescription", description: "Securely upload a photo of your prescription. Our system will instantly digitize it." },
    { icon: FileCheck2, title: "2. Pharmacist Verification", description: "One of our certified pharmacists will review and verify your prescription for accuracy and safety." },
    { icon: Truck, title: "3. Fast, Discreet Delivery", description: "Receive your medication in discreet packaging, delivered right to your doorstep." },
];
const features = [
    { icon: ShieldCheck, title: "Verified Medications", description: "We source all medications from reputable manufacturers and licensed distributors." },
    { icon: MessageSquare, title: "Pharmacist Consultations", description: "Have questions? Schedule a confidential consultation with our expert pharmacists online." },
    { icon: Repeat, title: "Automatic Refills", description: "Set up subscription refills for your chronic medications and never miss a dose." },
    { icon: Package, title: "Discreet Packaging", description: "Your privacy is paramount. All orders are shipped in plain, secure packaging." },
];
const productCategories = [
    { name: "Vitamins & Supplements", image: "https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Personal Care", image: "https://plus.unsplash.com/premium_photo-1661597206779-b6643eac8213?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Baby & Mom Care", image: "https://images.unsplash.com/photo-1724667593663-54c6bb73e7ce?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Medical Devices", image: "https://images.unsplash.com/photo-1654512041772-446bd165a3b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];
const featuredProducts = [
    { name: "Omega-3 Fish Oil", price: "24.99", rating: 4.8, image: "https://images.pexels.com/photos/208518/pexels-photo-208518.jpeg" },
    { name: "Vitamin D3 Gummies", price: "18.50", rating: 4.9, image: "https://images.pexels.com/photos/14433550/pexels-photo-14433550.jpeg" },
    { name: "Digital Thermometer", price: "15.00", rating: 4.7, image: "https://images.pexels.com/photos/3873176/pexels-photo-3873176.jpeg" },
    { name: "Hypoallergenic Soap", price: "8.99", rating: 4.9, image: "https://www.cetaphil.com/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dw2e3cbf8c/052384-GSC-16oz_Front.PNG" },
];
const faqs = [
  { question: "How do I upload a prescription?", answer: "Simply click the 'Upload Prescription' button, and you'll be prompted to take a photo or upload an image file of your prescription. Our system is secure and HIPAA compliant." },
  { question: "What are your delivery times?", answer: "We offer same-day delivery in metro areas for orders placed before 2 PM. For other locations, expect delivery within 1-3 business days. You can track your order in real-time." },
  { question: "Is my personal and medical information secure?", answer: "Absolutely. We use end-to-end encryption for all data transmissions and adhere to the strictest privacy standards to protect your sensitive information." },
  { question: "Can I speak to a pharmacist?", answer: "Yes, you can schedule a free and confidential video or phone consultation with one of our licensed pharmacists through your user dashboard." },
];


// --- MAIN PAGE COMPONENT ---
const PharmacyPage = () => {
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const arrowOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const howItWorksRef = useRef(null);
    const isInView = useInView(howItWorksRef, { once: true, amount: 0.3 });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    return (
        <div className="overflow-x-hidden">
            <AnimatePresence>
                {isUploadModalOpen && <UploadModal closeModal={() => setIsUploadModalOpen(false)} />}
            </AnimatePresence>
            
            {/* Sections remain unchanged... */}
            <motion.section ref={heroRef} className="h-screen flex items-center justify-center text-center relative pt-20">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent"></div>
                <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="container mx-auto px-4 md:px-6 z-10">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }} className="inline-block bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full mb-4">
                        Synergy Pharmacy
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
                        <AnimatedWords text="Your Health," el="span" />
                        <br />
                        <span className="text-primary"><AnimatedWords text="Delivered with Care." el="span" /></span>
                    </h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }} className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
                        Skip the queues and manage your prescriptions with ease. Upload, manage, and receive your medication right at your doorstep, all from one secure platform.
                    </motion.p>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }} className="mt-8">
                        <motion.button onClick={() => setIsUploadModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-primary/90">
                            Upload Prescription <UploadCloud className="ml-2 h-4 w-4" />
                        </motion.button>
                    </motion.div>
                </motion.div>
                <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" style={{ opacity: arrowOpacity }} animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <ChevronDown className="h-8 w-8 text-gray-500" />
                </motion.div>
            </motion.section>

            <section ref={howItWorksRef} className="py-20 md:py-32 bg-surface border-y border-border">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: 'easeOut' }}>
                        <h2 className="text-4xl font-bold text-text-primary">A Seamless Process</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">From upload to delivery, we've simplified every step.</p>
                    </motion.div>
                    <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 }}}} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {howItWorksSteps.map((step, i) => (
                            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' }}}} className="text-center p-8">
                                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6"><step.icon size={32}/></div>
                                <h3 className="text-2xl font-bold mb-3 text-text-primary">{step.title}</h3>
                                <p className="text-text-secondary">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            
            <section className="py-20 md:py-32">
                 <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <AnimatedWords text="Our Commitment to You" el="h2" className="text-4xl font-bold text-text-primary" />
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">Experience a pharmacy service that prioritizes your safety, privacy, and convenience.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div key={i} whileHover={{ y: -8 }} className="bg-surface p-8 rounded-2xl border border-border">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-text-primary">{feature.title}</h3>
                                <p className="text-text-secondary">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                 </div>
            </section>

            <section className="py-20 md:py-32 bg-surface border-y border-border">
                 <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <AnimatedWords text="Explore Our Range" el="h2" className="text-4xl font-bold text-text-primary" />
                         <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">Beyond prescriptions, we offer a wide array of health and wellness products.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {productCategories.map((category, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="relative aspect-square rounded-2xl overflow-hidden group">
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <AnimatedWords text="Popular Health Essentials" el="h2" className="text-4xl font-bold text-text-primary" />
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">Shop our curated selection of top-rated wellness products.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product, i) => (
                           <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-surface rounded-2xl border border-border overflow-hidden group flex flex-col">
                                <div className="aspect-square w-full overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-text-primary flex-grow">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-lg font-semibold text-primary">${product.price}</p>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="h-4 w-4" fill="currentColor" />
                                            <span>{product.rating}</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 bg-primary/10 text-primary font-semibold py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">Add to Cart</button>
                                </div>
                           </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
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

            <section className="py-20 md:py-32 text-center">
                <div className="container mx-auto px-4 md:px-6">
                    <Pill className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold text-text-primary">Ready to Simplify Your Pharmacy Experience?</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-text-secondary">Create an account or upload your first prescription to get started.</p>
                    <div className="mt-8 flex justify-center gap-4">
                        <motion.button onClick={() => setIsUploadModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
                            Upload Prescription
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-surface">
                            Browse Products
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// --- PRESCRIPTION UPLOAD MODAL & STEPS ---
type PrescriptionData = {
    patientName: string;
    medications: { name: string; dosage: string; instructions: string }[];
};

const UploadModal = ({ closeModal }: { closeModal: () => void }) => {
    const [step, setStep] = useState(1);
    const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-background rounded-2xl w-full max-w-lg shadow-xl relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && <UploadStep1 key={1} setPrescriptionData={setPrescriptionData} nextStep={nextStep} />}
                        {step === 2 && <UploadStep2 key={2} prevStep={prevStep} nextStep={nextStep} prescriptionData={prescriptionData} />}
                        {step === 3 && <UploadSuccess key={3} closeModal={closeModal} />}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

const UploadStep1 = ({ setPrescriptionData, nextStep }: { setPrescriptionData: (data: PrescriptionData) => void, nextStep: () => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = async (files: FileList | null) => {
        if (files && files[0]) {
            const uploadedFile = files[0];
            setFile(uploadedFile);
            setIsProcessing(true);
            try {
                const data = await getPrescriptionDetailsFromImage(uploadedFile);
                setPrescriptionData(data);
                nextStep();
            } catch (error) {
                console.error("Failed to process prescription:", error);
                // You could add error handling UI here
            } finally {
                setIsProcessing(false);
            }
        }
    };
    
    const onDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    return (
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ ease: 'easeInOut' }} className="text-center">
            <h2 className="text-2xl font-bold mb-2">Upload Your Prescription</h2>
            <p className="text-text-secondary mb-6">Our AI will read it to speed up your order.</p>
            <label onDragEnter={onDragEnter} onDragOver={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}
                className={`relative cursor-pointer border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-10 transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}>
                {isProcessing ? (
                    <>
                        <Loader2 className="h-12 w-12 mb-4 text-primary animate-spin" />
                        <span className="text-sm text-text-secondary font-semibold">Analyzing...</span>
                    </>
                ) : (
                    <>
                        <UploadCloud className={`h-12 w-12 mb-4 transition-colors ${file ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-sm text-text-secondary">
                            {file ? <span className="font-semibold text-primary">{file.name}</span> : 'PNG, JPG, or PDF. Max 10MB.'}
                        </span>
                    </>
                )}
                <input type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} accept="image/png, image/jpeg, application/pdf" disabled={isProcessing} />
            </label>
            <p className="text-xs text-gray-400 mt-4">Your data is encrypted and processed securely.</p>
        </motion.div>
    );
};

const UploadStep2 = ({ prevStep, nextStep, prescriptionData }: { prevStep: () => void, nextStep: () => void, prescriptionData: PrescriptionData | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [patientName, setPatientName] = useState(prescriptionData?.patientName || '');

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
            <h2 className="text-2xl font-bold mb-6 text-center">Confirm Details</h2>
            
            {prescriptionData && prescriptionData.medications.length > 0 && (
                <div className="mb-6 bg-surface p-4 rounded-lg border border-border">
                    <h3 className="text-sm font-semibold text-text-secondary mb-2">Medications Detected by AI:</h3>
                    <ul className="space-y-2">
                        {prescriptionData.medications.map((med, index) => (
                            <li key={index} className="text-sm p-2 bg-background rounded-md">
                                <strong className="text-primary">{med.name}</strong> ({med.dosage}) - <span className="text-text-secondary">{med.instructions}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-text-secondary">Patient's Full Name (from prescription)</label>
                    <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} required className="w-full p-2 mt-1 border border-border rounded-md" />
                </div>
                <div>
                    <label className="text-sm font-medium text-text-secondary">Mobile Number</label>
                    <input type="tel" required className="w-full p-2 mt-1 border border-border rounded-md"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-text-secondary">Delivery Address</label>
                    <input type="text" required className="w-full p-2 mt-1 border border-border rounded-md"/>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <button type="button" onClick={prevStep} className="text-sm font-semibold">Back</button>
                    <button type="submit" disabled={isLoading} className="bg-primary text-white font-semibold py-3 px-6 rounded-lg disabled:bg-gray-300 transition-colors flex items-center">
                        {isLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                        Confirm Order
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const UploadSuccess = ({ closeModal }: { closeModal: () => void }) => (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.2, type: 'spring' } }} className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
            <Check size={32}/>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
        <p className="text-text-secondary mb-6">Your prescription has been received. Our pharmacists will review it and you'll be notified via SMS when your order is dispatched.</p>
        <button onClick={closeModal} className="w-full bg-primary text-white font-semibold py-3 rounded-lg">Done</button>
    </motion.div>
);

export default PharmacyPage;