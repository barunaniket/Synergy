import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, HeartPulse, CheckCircle, ArrowRight, ArrowLeft, UploadCloud } from 'lucide-react'; // Import UploadCloud

const steps = [
  { id: 1, name: 'Patient Details', icon: User },
  { id: 2, name: 'Medical Information', icon: HeartPulse },
  { id: 3, name: 'Confirmation', icon: CheckCircle },
];

function SchedulePage() {
  const { hospitalId, organ } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    bloodType: 'A+',
    history: '',
  });
  const [medicalRecordFile, setMedicalRecordFile] = useState<File | null>(null); // New state for the file

  const nextStep = () => setCurrentStep(prev => (prev < steps.length ? prev + 1 : prev));
  const prevStep = () => setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  // New handler for the file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedicalRecordFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // In a real app, you would also handle the file upload here.
    console.log('Form Submitted:', { ...formData, medicalRecord: medicalRecordFile?.name });
    setCurrentStep(currentStep + 1);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 pt-28">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary">Schedule Consultation</h1>
          <p className="text-text-secondary mt-2">
            Booking for: <span className="font-semibold text-primary">{organ} Transplant</span>
          </p>
        </div>

        <div className="flex justify-between items-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step.id ? 'bg-primary border-primary text-white' : 'border-border'
                }`}
              >
                <step.icon size={20} />
              </div>
              <p className={`ml-4 font-medium ${currentStep >= step.id ? 'text-text-primary' : 'text-text-secondary'}`}>{step.name}</p>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-16 md:w-32 mx-4 ${currentStep > index + 1 ? 'bg-primary' : 'bg-border'}`}></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-surface p-8 rounded-lg border border-border min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                /* --- Step 1 Form --- */
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Step 1: Your Information</h2>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                    <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-text-secondary mb-2">Age</label>
                    <input type="number" id="age" value={formData.age} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
                  </div>
                   <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                    <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
                  </div>
                   <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                /* --- Step 2 Form with File Upload --- */
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Step 2: Medical Details</h2>
                    <div>
                        <label htmlFor="bloodType" className="block text-sm font-medium text-text-secondary mb-2">Blood Type</label>
                        <select id="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary">
                            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                            <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                        </select>
                    </div>
                    {/* --- New File Upload Input --- */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Previous Medical Records (Optional)</label>
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-background rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center p-6 hover:border-primary transition-colors">
                            <UploadCloud className="h-8 w-8 text-text-secondary" />
                            <span className="mt-2 text-sm text-text-secondary">
                                {medicalRecordFile ? medicalRecordFile.name : 'Click to upload a file'}
                            </span>
                        </label>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </div>
                    <div>
                        <label htmlFor="history" className="block text-sm font-medium text-text-secondary mb-2">Brief Medical History</label>
                        <textarea id="history" value={formData.history} onChange={handleChange} rows={4} className="w-full p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary"></textarea>
                    </div>
                </div>
              )}
              
              {currentStep === 3 && (
                 /* --- Step 3 Confirmation --- */
                 <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Step 3: Confirm Details</h2>
                    <p className="text-text-secondary">Please review your information before submitting.</p>
                    <div className="bg-background p-4 rounded-md border border-border space-y-2">
                        <p><strong>Booking for:</strong> <span className="font-semibold text-primary">{organ} Transplant</span></p>
                        <p><strong>Name:</strong> {formData.fullName}</p>
                        <p><strong>Age:</strong> {formData.age}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                        <p><strong>Blood Type:</strong> {formData.bloodType}</p>
                        {/* --- Display uploaded file name --- */}
                        <p><strong>Medical Record:</strong> {medicalRecordFile?.name || 'Not provided'}</p>
                        <p><strong>History:</strong> {formData.history || 'Not provided'}</p>
                    </div>
                 </div>
              )}
              
              {currentStep === 4 && (
                 /* --- Success Message --- */
                 <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold">Consultation Scheduled!</h2>
                    <p className="text-text-secondary mt-2">A representative from the hospital will contact you shortly to confirm the details.</p>
                    <Link to="/find-a-hospital" className="mt-6 inline-block bg-primary text-white font-semibold py-2 px-5 rounded-lg">
                        Back to Search
                    </Link>
                 </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {currentStep <= steps.length && (
            <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
                <button onClick={prevStep} className="inline-flex items-center rounded-md border border-border bg-transparent px-6 py-2 text-sm font-medium shadow-sm hover:bg-surface">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </button>
            ) : <div></div>}
            
            {currentStep < steps.length ? (
                <button onClick={nextStep} className="inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow hover:bg-primary/90">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            ) : (
                <button onClick={handleSubmit} className="inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow hover:bg-primary/90">
                    Confirm & Schedule
                </button>
            )}
            </div>
        )}
      </div>
    </div>
  );
}

export default SchedulePage;