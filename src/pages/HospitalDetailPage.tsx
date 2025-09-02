import { useParams, Link } from 'react-router-dom'; // 1. Import Link
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Heart, Building, Phone, Mail } from 'lucide-react';
import { Hospital } from '../components/HospitalCard';

const allHospitals: Hospital[] = [
    {
      id: 1,
      name: 'Manipal Hospital',
      location: 'Yeshwanthpur, Bengaluru',
      distance: 12.5,
      waitTime: 90,
      availableOrgans: ['Kidney', 'Liver'],
      estimatedCost: 75000,
      image: 'https://lh3.googleusercontent.com/p/AF1QipM7AQrfv060jLrF9AlQSqVarhchPT1u5lJ9ZK_n=s1360-w1360-h1020-rw',
    },
    {
      id: 2,
      name: 'Kauvery Hospital',
      location: 'Electronic City, Bengaluru',
      distance: 25.1,
      waitTime: 120,
      availableOrgans: ['Heart', 'Lung'],
      estimatedCost: 150000,
      image: 'https://lh3.googleusercontent.com/p/AF1QipMJc-AVIYBlr29F49J60od25n86Xe9rUM0kKWwS=s1360-w1360-h1020-rw',
    },
    {
      id: 3,
      name: 'Fortis Hospital',
      location: 'Bannerghatta Road, Bangalore',
      distance: 8.2,
      waitTime: 45,
      availableOrgans: ['Kidney', 'Pancreas', 'Liver'],
      estimatedCost: 62000,
      image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npn6XUSNH-gR6D-9Kz6vRVr33_P25xu6kOWORhKPxV3A3dYnOecNwxXWiETDs70_isW-uWuvPauoRWj4zNinJ57CnGsYw8AtbxF9OOzqwR-Yz8WHnKcQMydxs_31Pt88zaFIVBRCA=s1360-w1360-h1020-rw',
    },
     {
      id: 4,
      name: 'Apollo Hospitals',
      location: 'Bannerghatta, Bengaluru',
      distance: 10.8,
      waitTime: 150,
      availableOrgans: ['Lung'],
      estimatedCost: 125000,
      image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nocNjfNGKtenJs7p1K_B_-IX0q16IslKGNn8r28BMrbbIcIg0KpAd9MdTLitRHBxpHoWJEexLlU_uWYO04fPKBkTIGZsS2iQKeIVOyOyITaVbtd2EcOLUVBcLpl4E-QlUuFpx8=s1360-w1360-h1020-rw',
    }
];

function HospitalDetailPage() {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  
  const hospital = allHospitals.find(h => h.id.toString() === hospitalId);

  if (!hospital) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 pt-28 text-center">
        <h1 className="text-4xl font-bold text-text-primary">Hospital Not Found</h1>
        <p className="text-text-secondary mt-4">We couldn't find the hospital you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="pt-20">
        <div className="relative h-[50vh] w-full overflow-hidden">
            <img src={hospital.image} alt={hospital.name} className="absolute inset-0 h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute bottom-0 left-0 w-full p-8 md:p-12"
            >
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-text-primary">{hospital.name}</h1>
                    <p className="mt-2 flex items-center text-text-secondary text-lg">
                        <MapPin className="h-5 w-5 mr-2 text-primary" /> {hospital.location}
                    </p>
                </div>
            </motion.div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-surface p-6 rounded-lg border border-border">
                            <Clock className="h-8 w-8 text-primary mb-2" />
                            <p className="text-sm text-text-secondary">Avg. Wait Time</p>
                            <p className="text-2xl font-bold">{hospital.waitTime} Days</p>
                        </div>
                        <div className="bg-surface p-6 rounded-lg border border-border">
                            <DollarSign className="h-8 w-8 text-primary mb-2" />
                            <p className="text-sm text-text-secondary">Est. Cost</p>
                            <p className="text-2xl font-bold">${hospital.estimatedCost.toLocaleString()}</p>
                        </div>
                        <div className="bg-surface p-6 rounded-lg border border-border">
                            <Heart className="h-8 w-8 text-primary mb-2" />
                            <p className="text-sm text-text-secondary">Transplants</p>
                            <p className="text-2xl font-bold">{hospital.availableOrgans.length}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-text-primary mb-6">Transplant Availability</h2>
                        <div className="space-y-4">
                            {hospital.availableOrgans.map(organ => (
                                <div key={organ} className="flex items-center justify-between bg-surface p-6 rounded-lg border border-border">
                                    <span className="text-xl font-medium">{organ}</span>
                                    {/* 2. Change the button to a Link */}
                                    <Link 
                                        to={`/schedule/${hospital.id}/${organ}`}
                                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                                    >
                                        Schedule Consultation
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                         <h2 className="text-3xl font-bold text-text-primary mb-4">About {hospital.name}</h2>
                         <p className="text-text-secondary leading-relaxed">
                            {hospital.name} is a leading medical institution renowned for its advanced transplant programs and patient-centric care. Our state-of-the-art facilities and world-class surgical teams are dedicated to achieving the best possible outcomes for our patients. We specialize in complex procedures and are committed to reducing wait times through innovation and efficient coordination.
                         </p>
                    </div>

                </div>

                <div className="bg-surface p-8 rounded-lg border border-border h-fit">
                    <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center"><Building className="h-6 w-6 mr-3 text-primary"/>Contact & Location</h3>
                    <div className="space-y-4 text-text-secondary">
                        <p className="flex items-start">
                            <MapPin size={16} className="mr-3 mt-1 flex-shrink-0 text-primary"/>
                            <span>{hospital.location}, 123 Health St.</span>
                        </p>
                        <p className="flex items-center">
                            <Phone size={16} className="mr-3 flex-shrink-0 text-primary"/>
                            <span>(555) 123-4567</span>
                        </p>
                         <p className="flex items-center">
                            <Mail size={16} className="mr-3 flex-shrink-0 text-primary"/>
                            <span>contact@{hospital.name.toLowerCase().replace(/\s+/g, '')}.org</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default HospitalDetailPage;