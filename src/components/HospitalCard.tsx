import { MapPin, Heart, Clock, DollarSign, Bot, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AiHospitalAnalysis } from '../services/gemini';

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
  aiAnalysis?: AiHospitalAnalysis;
}

function HospitalCard({ hospital, aiAnalysis }: HospitalCardProps) {
  return (
    <Link to={`/hospital/${hospital.id}`} className="block h-full">
      <div className="w-full h-full bg-surface rounded-xl border border-border shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src={hospital.image}
              alt={`Image of ${hospital.name}`}
            />
          </div>

          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="uppercase tracking-wide text-sm text-primary font-semibold">
                {hospital.distance} miles away
              </div>
              <p className="block mt-1 text-2xl leading-tight font-bold text-text-primary">
                {hospital.name}
              </p>
              <p className="mt-2 flex items-center text-text-secondary">
                <MapPin className="h-4 w-4 mr-2" /> {hospital.location}
              </p>
            </div>

            {/* CORRECTED LOGIC: Conditionally Render AI Analysis OR Historical Data (without cost) */}
            <div className="mt-4 text-sm">
              {aiAnalysis ? (
                <div className="space-y-2">
                  <div className="flex items-center text-primary font-semibold">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>AI Est. Wait: {aiAnalysis.predictedWaitTime}</span>
                  </div>
                  <div className="flex items-center text-primary font-semibold">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>AI Est. Cost: {aiAnalysis.predictedCost}</span>
                  </div>
                  <div className="flex items-center text-primary font-semibold">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      <span>AI Outcome Score: {aiAnalysis.outcomeScore}%</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-text-secondary">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>Avg. {hospital.waitTime} day wait</span>
                  </div>
                </div>
              )}
            </div>
            
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

        {aiAnalysis?.reason && (
          <div className="bg-primary/5 p-4 border-t border-border mt-auto">
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-primary">AI Recommendation:</span> {aiAnalysis.reason}
              </p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default HospitalCard;