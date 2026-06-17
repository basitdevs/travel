import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, LoaderCircle, Plane, XCircle } from 'lucide-react';
import { authAPI } from '../../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    authAPI.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-light px-5 py-10">
      <div className="card-premium w-full max-w-md p-8 text-center">
        <Link to="/" className="mx-auto mb-8 flex w-fit items-center gap-3 text-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Plane size={22} />
          </span>
          <span className="font-display text-2xl font-semibold">WanderLux</span>
        </Link>

        {status === 'loading' && (
          <>
            <LoaderCircle className="mx-auto mb-4 animate-spin text-secondary" size={58} />
            <h1 className="font-display text-3xl font-semibold text-primary">Verifying Email</h1>
            <p className="mt-3 text-slate-600">Please wait while we confirm your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="mx-auto mb-4 text-emerald-500" size={64} />
            <h1 className="font-display text-3xl font-semibold text-primary">Email Verified</h1>
            <p className="mt-3 text-slate-600">Your account has been verified successfully.</p>
            <Link to="/login" className="btn-primary mt-7">Sign In</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto mb-4 text-red-500" size={64} />
            <h1 className="font-display text-3xl font-semibold text-primary">Verification Failed</h1>
            <p className="mt-3 text-slate-600">The verification link is invalid or has expired.</p>
            <Link to="/" className="btn-primary mt-7">Go Home</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
