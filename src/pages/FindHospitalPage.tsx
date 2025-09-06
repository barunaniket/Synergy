import { useState, useMemo, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import HospitalList from '../components/HospitalList';
import { Hospital } from '../components/HospitalCard';
import { SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { getAiRankedHospitals, AiHospitalAnalysis } from '../services/gemini';

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


function FindHospitalPage() {
  const [displayedHospitals, setDisplayedHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    organ: 'Any Organ',
    budget: '',
    urgency: 'Standard',
  });
  const [sortBy, setSortBy] = useState('distance');
  const [isRanking, setIsRanking] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ [key: number]: AiHospitalAnalysis }>({});

  const debouncedLocation = useDebounce(filters.location, 300);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
        setDisplayedHospitals(allHospitals);
        setIsLoading(false);
    }, 650);
  }, []);

  const filteredHospitals = useMemo(() => {
    return allHospitals.filter(hospital => {
      const { organ, budget } = filters;
      const matchesLocation = debouncedLocation.trim() === '' ||
        hospital.name.toLowerCase().includes(debouncedLocation.toLowerCase()) ||
        hospital.location.toLowerCase().includes(debouncedLocation.toLowerCase());
      const matchesOrgan = organ === 'Any Organ' || hospital.availableOrgans.includes(organ);
      const maxBudget = parseInt(budget, 10);
      const matchesBudget = !budget || hospital.estimatedCost <= maxBudget;
      return matchesLocation && matchesOrgan && matchesBudget;
    });
  }, [debouncedLocation, filters.organ, filters.budget]);
  
  useEffect(() => {
    const processHospitals = async () => {
      if (isLoading) return;

      if (sortBy === 'ai') {
        setIsRanking(true);
        setAiAnalysis({}); 
        const rankedData = await getAiRankedHospitals(filters, filteredHospitals);

        const analysisMap: { [key: number]: AiHospitalAnalysis } = {};
        rankedData.forEach(item => { analysisMap[item.id] = item; });

        const hospitalMap = new Map(filteredHospitals.map(h => [h.id, h]));
        const rankedHospitals = rankedData
          .map(item => hospitalMap.get(item.id))
          .filter((h): h is Hospital => h !== undefined);
        
        const remainingHospitals = filteredHospitals.filter(h => !analysisMap[h.id]);

        setDisplayedHospitals([...rankedHospitals, ...remainingHospitals]);
        setAiAnalysis(analysisMap);
        setIsRanking(false);
      } else {
        setAiAnalysis({});
        const sorted = [...filteredHospitals].sort((a, b) => {
          switch (sortBy) {
            case 'distance': return a.distance - b.distance;
            case 'waitTime': return a.waitTime - b.waitTime;
            case 'cost': return a.estimatedCost - b.estimatedCost;
            default: return 0;
          }
        });
        setDisplayedHospitals(sorted);
      }
    };

    processHospitals();
  }, [sortBy, filters, filteredHospitals, isLoading]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 pt-28">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-text-primary">Find a Hospital</h1>
        <p className="text-text-secondary mt-2">
          Use the filters below to find a hospital that meets your needs.
        </p>
      </div>

      <SearchFilters filters={filters} setFilters={setFilters} />

      <div className="mt-12">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
                {isLoading ? 'Finding Hospitals...' : `${filteredHospitals.length} Results Found`}
            </h2>
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-text-secondary" />
                <label htmlFor="sort" className="text-sm font-medium text-text-secondary">Sort by:</label>
                <select 
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="py-2 pl-3 pr-8 border border-border rounded-md focus:ring-primary focus:border-primary text-sm"
                    disabled={isLoading}
                >
                    <option value="ai">AI Recommendation</option>
                    <option value="distance">Distance</option>
                    <option value="waitTime">Wait Time</option>
                    <option value="cost">Estimated Cost</option>
                </select>
            </div>
        </div>
        <HospitalList 
          hospitals={displayedHospitals} 
          isLoading={isLoading || isRanking} 
          aiAnalysis={aiAnalysis} 
          organFilter={filters.organ}
        />
      </div>
    </div>
  );
}

export default FindHospitalPage;