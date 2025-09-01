import { Search, MapPin, DollarSign, HeartPulse } from 'lucide-react';

function SearchFilters() {
  return (
    <div className="w-full p-6 bg-surface rounded-xl shadow-md border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Location Input */}
        <div className="relative">
          <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-2">Location</label>
          <MapPin className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="location"
            placeholder="City, State, or Zip Code"
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Organ Dropdown */}
        <div className="relative">
          <label htmlFor="organ" className="block text-sm font-medium text-text-secondary mb-2">Required Transplant</label>
          <HeartPulse className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
          <select
            id="organ"
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
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button className="w-full h-12 flex items-center justify-center bg-primary text-white rounded-md shadow transition-colors hover:bg-primary/90">
            <Search className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>

      </div>
    </div>
  );
}

export default SearchFilters;

