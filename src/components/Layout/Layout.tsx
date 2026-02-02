import { Outlet, Link, useLocation } from 'react-router-dom';

export function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-base-200 relative">
      <div className="absolute top-4 right-4 z-50">
        <Link
          to={isDashboard ? '/timer' : '/dashboard'}
          className="btn btn-ghost btn-sm gap-2"
        >
          {isDashboard ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="hidden sm:inline">Timer</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </>
          )}
        </Link>
      </div>
      <main className="flex-1 overflow-auto">
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
