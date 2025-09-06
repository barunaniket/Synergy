import { useParams, Link } from 'react-router-dom'; // 1. Import Link
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Heart, Building, Phone, Mail } from 'lucide-react';
import { Hospital } from '../components/HospitalCard';

const allHospitals: Hospital[] = [
  {
    id: 1,
    name: 'PES UNIVERSITY HOSPITAL',
    location: 'Electronic City, Bengaluru, Karnataka',
    distance: 17,
    waitTime: 50,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Pancreas', 'Cornea', 'GI', 'Pediatric'],
    estimatedCost: 100000,
    image: 'https://campaigns.pes.edu/mbbs/img/mbbs13.jpg',
  },
  {
    id: 2,
    name: 'Kauvery Hospital',
    location: 'Electronic City, Bengaluru, Karnataka',
    distance: 19,
    waitTime: 120,
    availableOrgans: ['Heart', 'Lung'],
    estimatedCost: 150000,
    image: 'https://lh3.googleusercontent.com/p/AF1QipMJc-AVIYBlr29F49J60od25n86Xe9rUM0kKWwS=s1360-w1360-h1020-rw',
  },
  {
    id: 3,
    name: 'Fortis Hospital',
    location: 'Bannerghatta Road, Bangalore, Karnataka',
    distance: 9,
    waitTime: 45,
    availableOrgans: ['Kidney', 'Pancreas', 'Liver'],
    estimatedCost: 62000,
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npn6XUSNH-gR6D-9Kz6vRVr33_P25xu6kOWORhKPxV3A3dYnOecNwxXWiETDs70_isW-uWuvPauoRWj4zNinJ57CnGsYw8AtbxF9OOzqwR-Yz8WHnKcQMydxs_31Pt88zaFIVBRCA=s1360-w1360-h1020-rw',
  },
  {
    id: 4,
    name: 'Apollo Hospitals',
    location: 'Bannerghatta, Bengaluru, Karnataka',
    distance: 11,
    waitTime: 150,
    availableOrgans: ['Lung'],
    estimatedCost: 125000,
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nocNjfNGKtenJs7p1K_B_-IX0q16IslKGNn8r28BMrbbIcIg0KpAd9MdTLitRHBxpHoWJEexLlU_uWYO04fPKBkTIGZsS2iQKeIVOyOyITaVbtd2EcOLUVBcLpl4E-QlUuFpx8=s1360-w1360-h1020-rw',
  },
  {
    id: 5,
    name: 'Manipal Hospital - Bengaluru',
    location: 'Yeshwanthpur, Bengaluru, Karnataka',
    distance: 16,
    waitTime: 90,
    availableOrgans: ['Kidney', 'Liver'],
    estimatedCost: 75000,
    image: 'https://lh3.googleusercontent.com/p/AF1QipM7AQrfv060jLrF9AlQSqVarhchPT1u5lJ9ZK_n=s1360-w1360-h1020-rw',
  },
  {
    id: 6,
    name: 'Indraprastha Apollo Hospital',
    location: 'Sarita Vihar, New Delhi',
    distance: 2145,
    waitTime: 100,
    availableOrgans: ['Heart', 'Pancreas', 'Corneal', 'Intestinal', 'GI'],
    estimatedCost: 225000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Apollo_Hospital_Indraprastha.jpg',
  },
  {
    id: 7,
    name: 'BLK Super Specialty Hospital',
    location: 'Pusa Road, New Delhi',
    distance: 2160,
    waitTime: 200,
    availableOrgans: ['Intestinal', 'Liver'],
    estimatedCost: 100000,
    image: 'https://img.bookimed.com/clinic_webp/5c87d1fac9370.webp',
  },
  {
    id: 8,
    name: 'AIIMS New Delhi',
    location: 'Ansari Nagar, New Delhi',
    distance: 2150,
    waitTime: 50,
    availableOrgans: ['Cartilage', 'Tendons', 'Ligaments', 'Heart', 'Skin'],
    estimatedCost: 200000,
    image: 'https://images.indianexpress.com/2017/07/aiims-759.jpg',
  },
  {
    id: 9,
    name: 'Max Super Speciality Hospital',
    location: 'Saket, New Delhi',
    distance: 2145,
    waitTime: 95,
    availableOrgans: ['Kidney', 'Liver', 'Lungs', 'Bone'],
    estimatedCost: 185000,
    image: 'https://static.hospidio.com/uploads/hospital/58/WhatsApp%20Image%202024-08-21%20at%205.40.40%20PM.jpeg.webp',
  },
  {
    id: 10,
    name: 'Sir Ganga Ram Hospital',
    location: 'Rajinder Nagar',
    distance: 2160,
    waitTime: 140,
    availableOrgans: ['Kidney', 'Ligaments', 'Lungs', 'Liver', 'Bone'],
    estimatedCost: 195000,
    image: 'https://content.jdmagicbox.com/v2/comp/delhi/y3/011pxx11.xx11.000640623069.c8y3/catalogue/sir-ganga-ram-hospital-old-rajender-nagar-delhi-hospitals-1fwofzdlnv.jpg',
  },
  {
    id: 11,
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    location: 'Andheri West, Mumbai',
    distance: 985,
    waitTime: 120,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Small Bowel', 'Bone Marrow'],
    estimatedCost: 200000,
    image: 'https://www.medicaltours.care/HealthTourism/img/background/Kokilaben_Ambani_Hospital_Mumbai.jpg',
  },
  {
    id: 12,
    name: 'Global Hospital',
    location: 'Parel West, Mumbai',
    distance: 980,
    waitTime: 50,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Intestine', 'Hand', 'Tissue'],
    estimatedCost: 250000,
    image: 'https://images.jdmagicbox.com/v2/comp/mumbai/99/022p1151699/catalogue/global-hospitals-mumbai-parel-mumbai-orthopaedic-doctors-cxe0jt8jwf.jpg',
  },
  {
    id: 13,
    name: 'Jaslok Hospital & Research Centre',
    location: 'Tardeo, Mumbai',
    distance: 980,
    waitTime: 100,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Lung'],
    estimatedCost: 150000,
    image: 'https://www.jointreplacementsurgeryhospitalindia.com/jaslok-hospital-mumbai-india/img/jaslok-hospital.jpg',
  },
  {
    id: 14,
    name: 'P. D. Hinduja National Hospital and Medical Research Centre',
    location: 'Mahim, Mumbai',
    distance: 990,
    waitTime: 75,
    availableOrgans: ['Kidney', 'Liver'],
    estimatedCost: 125000,
    image: 'https://hinduja-prod-assets.s3.ap-south-1.amazonaws.com/s3fs-public/2022-02/IPD%20Building%20%28West%20Block%29.png?VersionId=VqftVnoHJ93dyuJiFyU3TMBeDwqkWBhs',
  },
  {
    id: 15,
    name: 'Nanavati Super Speciality Hospital',
    location: 'Vile Parle, Mumbai',
    distance: 985,
    waitTime: 100,
    availableOrgans: ['Kidney', 'Liver'],
    estimatedCost: 155000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Nanavati_Super_Speciality_Hospital%2C_Mumbai%2C_Maharashtra%2C_India.jpg',
  },
  {
    id: 16,
    name: 'Apollo Hospitals',
    location: 'CBD Belapur, Navi Mumbai',
    distance: 1005,
    waitTime: 95,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Cornea'],
    estimatedCost: 200000,
    image: 'https://i.ytimg.com/vi/5-bnmyJqlko/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgYig7MA8=&rs=AOn4CLDM9PYsoGp7L6kPZgyZCK0Sw7kFNQ',
  },
  {
    id: 17,
    name: 'Fortis Hospital',
    location: 'Mulund West, Mumbai',
    distance: 1000,
    waitTime: 80,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Intestine'],
    estimatedCost: 172000,
    image: 'https://content3.jdmagicbox.com/v2/comp/mumbai/u6/022pxx22.xx22.120327123542.z3u6/catalogue/fortis-hospital-mulund-west-mumbai-multispeciality-hospitals-jzt0nrpc5a.jpg',
  },
  {
    id: 18,
    name: 'Apollo Multispecialty Hospital',
    location: 'Kolkata, West Bengal',
    distance: 1885,
    waitTime: 90,
    availableOrgans: ['Kidney', 'Liver', 'Bone Marrow'],
    estimatedCost: 195000,
    image: 'https://www.medijourney.co.in/uploads/51ba570fe68fc088e0a942bdf8700cdce7eb8b1d/1710399323apollo-hospitals-kolkata.webp',
  },
  {
    id: 19,
    name: 'Fortis Hospital & Kidney Institute',
    location: 'Anandapur, E.M. Bypass Road, Kolkata',
    distance: 1890,
    waitTime: 50,
    availableOrgans: ['Kidney'],
    estimatedCost: 175000,
    image: 'https://www.medicaltours.care/healthtourism/img/background/4fc2b35b-4c93-4511-a1da-da51211001fd_h_fortis_anandpur_2.jpg',
  },
  {
    id: 20,
    name: 'Apollo Gleneagles Hospitals',
    location: 'Canal Circular Road, Kolkata',
    distance: 1885,
    waitTime: 100,
    availableOrgans: ['Heart', 'Liver', 'Kidney'],
    estimatedCost: 100000,
    image: 'https://img.bookimed.com/clinic_webp/64f88f7e9e5e4.webp',
  },
  {
    id: 21,
    name: 'Manipal Hospitals',
    location: 'Mukundapur, Kolkata',
    distance: 1890,
    waitTime: 90,
    availableOrgans: ['Kidney', 'Liver', 'Pancreas'],
    estimatedCost: 125000,
    image: 'https://www.manipalhospitals.com/mukundapur/assets/images/about/About_US.webp',
  },
  {
    id: 22,
    name: 'Charnock Hospital',
    location: 'Central Kolkata',
    distance: 1895,
    waitTime: 55,
    availableOrgans: ['Kidney'],
    estimatedCost: 175000,
    image: "https://swheal.com/wp-content/uploads/2024/11/Charnock_hospital_3.jpg",
  },
  {
    id: 23,
    name: 'Medica Superspecialty Hospital',
    location: 'Mukundapur, Kolkata',
    distance: 1890,
    waitTime: 40,
    availableOrgans: ['Heart', 'Lung', 'Kidney'],
    estimatedCost: 225000,
    image: 'https://content.jdmagicbox.com/comp/kolkata/u5/033pxx33.xx33.110805105415.m8u5/catalogue/medica-superspecialty-hospital-mukundapur-kolkata-neurologists-f8qck.jpg',
  },
  {
    id: 24,
    name: 'Belle Vue Clinic',
    location: 'Elgin (Central Kolkata)',
    distance: 1880,
    waitTime: 30,
    availableOrgans: ['Kidney'],
    estimatedCost: 100000,
    image: 'https://content.jdmagicbox.com/v2/comp/kolkata/d8/033pxx33.xx33.170320133403.c2d8/catalogue/dr-d-pulai-belle-vue-clinic--circus-avenue-kolkata-neurologists-T2CQjLghII.jpg',
  },
  {
    id: 25,
    name: 'AMRI Hospitals',
    location: 'Dhakuria, Kolkata',
    distance: 1885,
    waitTime: 45,
    availableOrgans: ['Kidney', 'Liver'],
    estimatedCost: 125000,
    image: 'https://yapita-production.s3.ap-south-1.amazonaws.com/uploads/facility_photo/photo/50614af3-2592-40cb-9d7e-271a6864ef90/file.jpeg',
  },
  {
    id: 26,
    name: 'Apollo Hospitals',
    location: 'Jubilee Hills, Hyderabad',
    distance: 580,
    waitTime: 125,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Cornea', 'Pediatric'],
    estimatedCost: 245000,
    image: 'https://cdn.prod.website-files.com/659c9d2768dc328628d30423/659fd53f0ae747b468939795_4.jpg',
  },
  {
    id: 27,
    name: 'Yashoda Hospitals',
    location: 'Somajiguda, Hyderabad',
    distance: 580,
    waitTime: 95,
    availableOrgans: ['Kidney', 'Liver', 'Heart'],
    estimatedCost: 185000,
    image: 'https://www.healthtrip.com/_next/image?url=https%3A%2F%2Fd3fzwscyjtgllx.cloudfront.net%2Fhospitals%2Fimages%2FSJYEuZ1oD4FiDUt4SA4jQn0K1740634349393.jpg&w=1200&q=60',
  },
  {
    id: 28,
    name: 'KIMS Hospitals',
    location: 'Secunderabad, Hyderabad',
    distance: 570,
    waitTime: 150,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Bone Marrow', 'Cornea', 'Pancreas'],
    estimatedCost: 225000,
    image: 'https://content.jdmagicbox.com/v2/comp/secunderabad/i1/040pxx40.xx40.200129232112.c9i1/catalogue/kims-foundation-and-research-center-minister-road-secunderabad-research-centres-29ZIwoH5l2.jpg',
  },
  {
    id: 29,
    name: 'PACE Hospitals',
    location: 'Hitech City, Hyderabad',
    distance: 595,
    waitTime: 175,
    availableOrgans: ['Kidney', 'Liver', 'Pancreas', 'Intestine'],
    estimatedCost: 200000,
    image: 'https://travocure.com/wp-content/uploads/2021/09/WhatsApp-Image-2021-09-30-at-2.51.51-PM.jpeg',
  },
  {
    id: 30,
    name: 'AIG Hospitals',
    location: 'Gachibowli, Hyderabad',
    distance: 595,
    waitTime: 140,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Islet Cell'],
    estimatedCost: 275000,
    image: 'https://cdn.sanity.io/images/30p7so6x/eqt-public-web-prod/63f3ce7d565c2553e917e72fcb4f4f20ce20a173-1280x871.webp?rect=60,0,1161,871&w=1142&h=857&auto=format',
  },
  {
    id: 31,
    name: 'Care Hospitals',
    location: 'Banjara Hills, Hyderabad',
    distance: 585,
    waitTime: 110,
    availableOrgans: ['Kidney', 'Liver', 'Heart'],
    estimatedCost: 195000,
    image: 'https://cdn.credihealth.com/production/system/images/assets/29943/original/504.jpg',
  },
  {
    id: 32,
    name: 'Gleneagles Global Hospitals',
    location: 'Lakdi-Ka-Pul, Hyderabad',
    distance: 580,
    waitTime: 85,
    availableOrgans: ['Kidney', 'Liver', 'Heart'],
    estimatedCost: 210000,
    image: 'https://www.myhospitalnow.com/hospitals/storage/hospital_profile/Gleneagles_Hospitals_Lakdi_Ka_Pul_Hyderabad-1451510366_1719914005.jfif',
  },
  {
    id: 33,
    name: 'GEM Hospital',
    location: 'Perungudi, Chennai',
    distance: 355,
    waitTime: 120,
    availableOrgans: ['Kidney', 'Liver', 'Pancreas'],
    estimatedCost: 230000,
    image: 'https://www.practo.com/consumer-ui/_next/image?url=https%3A%2F%2Fimages1-fabric.practo.com%2Fpractices%2F1444411%2Fgem-hospital-chennai-658a78e057a5c.jpeg&w=3840&q=75',
  },
  {
    id: 34,
    name: 'Rela Hospital',
    location: 'Chromepet, Chennai',
    distance: 345,
    waitTime: 95,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Lungs'],
    estimatedCost: 275000,
    image: 'https://www.practo.com/consumer-ui/_next/image?url=https%3A%2F%2Fimages1-fabric.practo.com%2Fpractices%2F1224581%2Fdr-rela-institute-medical-centre-chennai-5f4f3ad26df0d.jpg&w=3840&q=75',
  },
  {
    id: 35,
    name: 'Apollo Transplant Program',
    location: 'Greams Road, Chennai',
    distance: 350,
    waitTime: 165,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Small Bowel'],
    estimatedCost: 245000,
    image: 'https://images.jdmagicbox.com/comp/visakhapatnam/q7/0891px891.x891.160929105718.b6q7/catalogue/apollo-hospitals-arilova-visakhapatnam-sonography-centres-xmm93vugjp.jpg',
  },
  {
    id: 36,
    name: 'MGM Healthcare',
    location: 'Aminjikarai, Chennai',
    distance: 355,
    waitTime: 135,
    availableOrgans: ['Liver', 'Kidney'],
    estimatedCost: 215000,
    image: 'https://safartibbi.com/wp-content/uploads/2023/08/MGM-Healthcare-image-1.jpg',
  },
  {
    id: 37,
    name: 'SIMS Hospital',
    location: 'Vadapalani, Chennai',
    distance: 355,
    waitTime: 105,
    availableOrgans: ['Kidney', 'Liver'],
    estimatedCost: 190000,
    image: 'https://simshospitals.com/wp-content/uploads/2019/12/SIMS-Vadapalani-Br.jpg',
  },
  {
    id: 38,
    name: 'MIOT International',
    location: 'Manapakkam, Chennai',
    distance: 360,
    waitTime: 150,
    availableOrgans: ['Kidney', 'Liver', 'Heart', 'Bone Marrow'],
    estimatedCost: 220000,
    image: 'https://www.miotinternational.com/wp-content/uploads/2016/12/MIOT.jpg',
  },
  {
    id: 39,
    name: 'Rajiv Gandhi Government General Hospital',
    location: 'Park Town, Chennai',
    distance: 350,
    waitTime: 85,
    availableOrgans: ['Kidney', 'Liver'],
    estimatedCost: 125000,
    image: 'https://i0.wp.com/sriramv.com/wp-content/uploads/2024/05/Rajiv-Gandhi-Govt-Hospital.jpeg?ssl=1',
  },
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