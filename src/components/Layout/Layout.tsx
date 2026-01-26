import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-base-200">
      <Navigation />
      <main className="flex-1 pb-22 sm:pb-0 overflow-auto">
        <div className="max-w-4xl mx-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
