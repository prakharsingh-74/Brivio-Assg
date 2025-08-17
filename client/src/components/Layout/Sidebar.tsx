import { Link, useLocation } from 'react-router-dom';
import { HiMicrophone, HiArrowUpTray } from 'react-icons/hi2';

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-blue-600">Brivio</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/app/recordings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors justify-start ${
              isActive('/app/recordings')
                ? 'bg-blue-500 text-white'
                : 'text-black bg-white hover:bg-blue-100'
            }`}
          >
            <HiMicrophone className="w-5 h-5" />
            All Recordings
          </Link>

          <Link
            to="/app/new"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors justify-start ${
              isActive('/app/new')
                ? 'bg-blue-500 text-white'
                : 'text-black bg-white hover:bg-blue-100'
            }`}
          >
            <HiArrowUpTray className="w-5 h-5" />
            New Recording
          </Link>
      </nav>
    </div>
  );
}