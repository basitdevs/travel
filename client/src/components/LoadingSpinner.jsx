import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, size = 40 }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={size} />
      </div>
    );
  }
  return <Loader2 className="animate-spin text-secondary" size={size} />;
};

export default LoadingSpinner;
