import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PlayerSidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'training', label: 'Training', icon: '🏋️' },
    { id: 'shooting', label: 'Shooting', icon: '🎯' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'sleep', label: 'Sleep', icon: '😴' },
    { id: 'recovery', label: 'Recovery', icon: '⚡' },
    { id: 'financials', label: 'Financials', icon: '💳' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-56' : 'w-20'
      } bg-dark text-white border-r border-borderDark flex flex-col transition-all duration-300 hidden md:flex`}
    >
      {/* Header */}
      <div className="p-4 border-b border-borderDark">
        <div className="font-display text-sm font-black uppercase text-brand">AthleteIQ</div>
        <p className="font-mono text-[10px] text-gray-400 mt-0.5">Player Portal</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm font-mono font-bold transition-colors ${
              activeTab === item.id
                ? 'bg-brand text-dark'
                : 'text-gray-400 hover:text-white hover:bg-dark/50'
            }`}
            title={!isOpen ? item.label : ''}
          >
            <span className="text-lg mr-2">{item.icon}</span>
            {isOpen && item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-borderDark space-y-2">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-left text-xs font-mono font-bold text-gray-400 hover:text-red-400 transition-colors rounded hover:bg-dark/50"
        >
          {isOpen ? '← Sign Out' : '←'}
        </button>
      </div>
    </aside>
  );
};

export default PlayerSidebar;
