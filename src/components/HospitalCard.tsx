import { MapPin, Heart, Clock, DollarSign } from 'lucide-react';

// We can expand this interface later as we define more hospital data
export interface Hospital {
  id: number;
  name: string;
  location: string;
  distance: number;
  waitTime: number;
  availableOrgans: string[];
  estimatedCost: number;
  image: string;
}

interface HospitalCardProps {
  hospital: Hospital;
}

function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <div className="w-full bg-surface rounded-xl border border-border shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:w-48"
            src={hospital.image}
            alt={`Image of ${hospital.name}`}
          />
        </div>

        {/* Details Section */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="uppercase tracking-wide text-sm text-primary font-semibold">
              {hospital.distance} miles away
            </div>
            <a
              href="#"
              className="block mt-1 text-2xl leading-tight font-bold text-text-primary hover:underline"
            >
              {hospital.name}
            </a>
            <p className="mt-2 flex items-center text-text-secondary">
              <MapPin className="h-4 w-4 mr-2" /> {hospital.location}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-text-secondary">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>Avg. {hospital.waitTime} day wait</span>
            </div>
            <div className="flex items-center text-text-secondary">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              <span>Est. ${hospital.estimatedCost.toLocaleString()}</span>
            </div>
          </div>

           {/* Available Organs */}
           <div className="mt-4">
              <h4 className="font-semibold text-text-secondary text-sm mb-2 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-primary" />
                Available Transplants
              </h4>
              <div className="flex flex-wrap gap-2">
                {hospital.availableOrgans.map(organ => (
                   <span key={organ} className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                     {organ}
                   </span>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalCard;