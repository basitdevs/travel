import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Search, SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import { TourGridSkeleton } from '../components/LoadingSkeleton';
import TourCard from '../components/TourCard';
import { tourAPI } from '../services/api';
import { CATEGORIES } from '../utils/helpers';
import { IMAGES } from '../utils/images';

const emptyFilters = {
  search: '',
  country: '',
  city: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  minDuration: '',
  maxDuration: '',
  page: 1,
};

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    ...emptyFilters,
    search: searchParams.get('search') || '',
    country: searchParams.get('country') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minDuration: searchParams.get('minDuration') || '',
    maxDuration: searchParams.get('maxDuration') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
        const { data } = await tourAPI.getAll(params);
        setTours(data.tours);
        setPagination(data.pagination);

        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) urlParams.set(key, value);
        });
        setSearchParams(urlParams, { replace: true });
      } catch {
        toast.error('Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: e.target.search.value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setSearchParams({});
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => key !== 'page' && value).length;

  return (
    <div className="bg-light">
      <PageHeader
        title="Explore Destinations"
        subtitle="Search curated tours by place, style, price, and trip length."
        image={IMAGES.destinations}
      />

      <section className="section-padding">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
            <aside className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="card sticky top-24 p-5">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 font-semibold text-primary">
                    <SlidersHorizontal size={18} className="text-secondary" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                      <button type="button" onClick={clearFilters} className="text-xs font-bold text-secondary hover:text-secondary-dark">
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      aria-label="Close filters"
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
                    >
                      <X size={17} />
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { key: 'country', label: 'Country', placeholder: 'Greece' },
                    { key: 'city', label: 'City', placeholder: 'Santorini' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">{label}</label>
                      <input
                        value={filters[key]}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="input-field"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input-field"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Budget (USD)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        placeholder="Min"
                        className="input-field"
                      />
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        placeholder="Max"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Duration (days)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={filters.minDuration}
                        onChange={(e) => handleFilterChange('minDuration', e.target.value)}
                        placeholder="Min"
                        className="input-field"
                      />
                      <input
                        type="number"
                        value={filters.maxDuration}
                        onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                        placeholder="Max"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Search tours, cities, or countries"
                    className="input-field py-4 pl-12"
                  />
                </form>
                <button
                  type="button"
                  onClick={() => setShowFilters((value) => !value)}
                  className={`btn-ghost border lg:hidden ${showFilters ? 'border-primary bg-primary text-white hover:bg-primary-dark' : 'border-slate-200 bg-white'}`}
                >
                  <SlidersHorizontal size={18} />
                  Filters
                  {activeFilterCount > 0 && <span>({activeFilterCount})</span>}
                </button>
              </div>

              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Available tours</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {pagination.total} curated {pagination.total === 1 ? 'journey' : 'journeys'}
                  </p>
                </div>
                {activeFilterCount > 0 && (
                  <button type="button" onClick={clearFilters} className="btn-ghost w-fit border border-slate-200 bg-white">
                    Clear Filters
                  </button>
                )}
              </div>

              {loading ? (
                <TourGridSkeleton />
              ) : tours.length === 0 ? (
                <div className="card px-6 py-16 text-center">
                  <Compass className="mx-auto mb-4 text-slate-300" size={64} />
                  <h3 className="font-display text-2xl font-semibold text-primary">No tours found</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                    Try broadening the location, budget, or duration filters to uncover more journeys.
                  </p>
                  <button type="button" onClick={clearFilters} className="btn-primary mt-6">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {tours.map((tour, index) => (
                      <TourCard key={tour._id} tour={tour} index={index} />
                    ))}
                  </div>
                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Destinations;
