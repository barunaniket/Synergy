import SearchFilters from '../components/SearchFilters';

function FindHospitalPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-text-primary">Find a Hospital</h1>
        <p className="text-text-secondary mt-2">
          Use the filters below to find a hospital that meets your needs.
        </p>
      </div>

      {/* The SearchFilters component is now included here */}
      <SearchFilters />

      {/* The hospital results will be displayed below this section */}
      <div className="mt-8">
        {/* Placeholder for results */}
      </div>
    </div>
  );
}

export default FindHospitalPage;

