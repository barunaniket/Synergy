function HospitalCardSkeleton() {
  return (
    <div className="w-full bg-surface rounded-xl border border-border shadow-md overflow-hidden animate-pulse">
      <div className="md:flex">
        {/* Image Placeholder */}
        <div className="md:flex-shrink-0">
          <div className="h-48 w-full md:w-48 bg-gray-300"></div>
        </div>

        {/* Details Placeholder */}
        <div className="p-6 flex flex-col justify-between w-full">
          <div>
            {/* Distance Placeholder */}
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            {/* Hospital Name Placeholder */}
            <div className="mt-2 h-7 w-3/4 bg-gray-400 rounded"></div>
            {/* Location Placeholder */}
            <div className="mt-3 h-4 w-1/2 bg-gray-300 rounded"></div>
          </div>

          {/* Stats Placeholder */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
            <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
          </div>

          {/* Available Organs Placeholder */}
          <div className="mt-4">
            <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalCardSkeleton;