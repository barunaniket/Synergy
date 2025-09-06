import { Search, MapPin, DollarSign, HeartPulse, AlertTriangle } from 'lucide-react';
import React from 'react';

// Define the types for the props we are receiving
interface SearchFiltersProps {
  filters: {
    location: string;
    organ: string;
    budget: string;
    urgency: string; // Added urgency
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    location: string;
    organ: string;
    budget: string;
    urgency: string; // Added urgency
  }>>;
}

function SearchFilters({ filters, setFilters }: SearchFiltersProps) {

  // Handle input changes and update the parent state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  return (
    // Adjusted grid columns to make space for the new filter
    <div className="w-full p-6 bg-surface rounded-xl shadow-md border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Location Input */}
        <div className="relative">
          <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-2">Location</label>
          <MapPin className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="location"
            placeholder="Search by name or location..."
            value={filters.location}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Organ Dropdown */}
        <div className="relative">
          <label htmlFor="organ" className="block text-sm font-medium text-text-secondary mb-2">Required Transplant</label>
          <HeartPulse className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
          <select
            id="organ"
            value={filters.organ}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary appearance-none"
          >
            <option>Any Organ</option>
            <option>Kidney</option>
            <option>Liver</option>
            <option>Heart</option>
            <option>Lung</option>
            <option>Pancreas</option>
          </select>
        </div>

        {/* Budget Input */}
        <div className="relative">
          <label htmlFor="budget" className="block text-sm font-medium text-text-secondary mb-2">Max Budget</label>
          <DollarSign className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
          <input
            type="number"
            id="budget"
            placeholder="e.g., 50000"
            value={filters.budget}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Urgency Dropdown - NEW */}
        <div className="relative">
          <label htmlFor="urgency" className="block text-sm font-medium text-text-secondary mb-2">Urgency</label>
          <AlertTriangle className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
          <select
            id="urgency"
            value={filters.urgency}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary appearance-none"
          >
            <option value="Standard">Standard</option>
            <option value="Urgent">Urgent</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Search Button (This button doesn't need an onClick yet since filtering is live) */}
        <div className="flex items-end">
          <button className="w-full h-12 flex items-center justify-center bg-primary text-white rounded-md shadow transition-colors hover:bg-primary/90 cursor-not-allowed" disabled>
            <Search className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>

      </div>
    </div>
  );
}

export default SearchFilters;