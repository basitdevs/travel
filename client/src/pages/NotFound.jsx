import { Link } from 'react-router-dom';
import { Home, MapPin } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-light px-5 py-16">
      <div className="max-w-md text-center">
        <p className="font-display text-8xl font-semibold text-primary/10">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-primary">Page Not Found</h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primary">
            <Home size={17} /> Go Home
          </Link>
          <Link to="/destinations" className="btn-ghost border border-slate-200 bg-white">
            <MapPin size={17} /> Browse Tours
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
