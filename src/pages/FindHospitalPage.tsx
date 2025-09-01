import { useState, useMemo, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import HospitalList from '../components/HospitalList';
import { Hospital } from '../components/HospitalCard';
import { SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce'; // Import the new hook

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

function FindHospitalPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    organ: 'Any Organ',
    budget: '',
  });
  const [sortBy, setSortBy] = useState('distance');

  // Debounce the location filter input to avoid rapid re-renders
  const debouncedLocation = useDebounce(filters.location, 300);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setHospitals(allHospitals);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Effect to add a small delay when filters change for a smoother feel
  useEffect(() => {
    if (!isLoading) {
        const timer = setTimeout(() => {
            // This doesn't need to do anything, it just forces a re-render cycle
            // for the animations after a short delay
        }, 350);
        return () => clearTimeout(timer);
    }
  }, [filters.organ, filters.budget, sortBy]);


  const processedHospitals = useMemo(() => {
    // Note: We use the debouncedLocation for filtering
    let filtered = hospitals.filter(hospital => {
      const { organ, budget } = filters;
      const matchesLocation = debouncedLocation.trim() === '' || 
        hospital.name.toLowerCase().includes(debouncedLocation.toLowerCase()) || 
        hospital.location.toLowerCase().includes(debouncedLocation.toLowerCase());
      const matchesOrgan = organ === 'Any Organ' || hospital.availableOrgans.includes(organ);
      const maxBudget = parseInt(budget, 10);
      const matchesBudget = !budget || hospital.estimatedCost <= maxBudget;
      return matchesLocation && matchesOrgan && matchesBudget;
    });

    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'distance':
                return a.distance - b.distance;
            case 'waitTime':
                return a.waitTime - b.waitTime;
            case 'cost':
                return a.estimatedCost - b.estimatedCost;
            default:
                return 0;
        }
    });

    return filtered;
  }, [debouncedLocation, filters.organ, filters.budget, hospitals, sortBy]);

  return (
    <div className="container mx-auto px-4 md-px-6 py-12 pt-28">
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
                {isLoading ? 'Finding Hospitals...' : `${processedHospitals.length} Results Found`}
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
                    <option value="distance">Distance</option>
                    <option value="waitTime">Wait Time</option>
                    <option value="cost">Estimated Cost</option>
                </select>
            </div>
        </div>
        <HospitalList hospitals={processedHospitals} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default FindHospitalPage;