const TourCardSkeleton = () => (
  <div className="card-premium">
    <div className="skeleton h-56 w-full rounded-none" />
    <div className="space-y-4 p-6">
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-5 w-3/4" />
      <div className="flex justify-between border-t border-slate-100 pt-4">
        <div className="skeleton h-8 w-24" />
        <div className="skeleton h-10 w-28" />
      </div>
    </div>
  </div>
);

export const TourGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <TourCardSkeleton key={index} />
    ))}
  </div>
);

export const DestinationCardSkeleton = () => (
  <div className="card-premium">
    <div className="skeleton h-72 w-full rounded-none" />
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="card p-6">
        <div className="skeleton mb-2 h-8 w-16" />
        <div className="skeleton h-4 w-24" />
      </div>
    ))}
  </div>
);

export default TourCardSkeleton;
