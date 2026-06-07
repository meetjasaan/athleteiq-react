import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, hasRoleAccess } from '../../utils/authUtils';
import PlayerSidebar from './PlayerSidebar';
import PerformancePassport from './PerformancePassport';
import FastLogForm from './FastLogForm';
import InsightsWidget from './InsightsWidget';
import Financials from './Financials';

const PlayerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check access
  if (!hasRoleAccess(user?.role, [ROLES.PLAYER, ROLES.PARENT])) {
    return (
      <div className="flex items-center justify-center h-screen bg-clinical">
        <div className="text-center">
          <h1 className="font-display text-2xl font-black text-dark mb-2">Access Denied</h1>
          <p className="font-body text-gray-500">Please sign in as a player or parent to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-clinical">
      {/* Sidebar */}
      <PlayerSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-dark text-white p-4 md:p-6 border-b border-borderDark sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <p className="font-mono text-xs text-gray-400">PLAYER PORTAL</p>
              <h1 className="font-display text-2xl md:text-3xl font-black uppercase">
                {user?.athleteName}
              </h1>
            </div>
            <div className="text-right text-xs">
              <p className="text-gray-400">Parent: {user?.name}</p>
              <p className="text-brand font-bold">{user?.ageGroup || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
          {activeTab === 'overview' && (
            <>
              <PerformancePassport athleteData={user} />
              <InsightsWidget athleteName={user?.athleteName} />
              <FastLogForm onLogSubmit={(data) => console.log('Fast log:', data)} />
            </>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white border border-borderLight p-6 brutal-clip">
              <h2 className="font-display text-xl font-black text-dark uppercase mb-4">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                <div>
                  <p className="text-gray-500 uppercase text-[10px] font-bold mb-1">Athlete Name</p>
                  <p className="text-dark">{user?.athleteName}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-[10px] font-bold mb-1">Age Group</p>
                  <p className="text-dark">{user?.ageGroup}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-[10px] font-bold mb-1">Parent Name</p>
                  <p className="text-dark">{user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-[10px] font-bold mb-1">Email</p>
                  <p className="text-dark">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="bg-white border border-borderLight p-6 brutal-clip">
              <h2 className="font-display text-xl font-black text-dark uppercase mb-4">Training</h2>
              <p className="font-body text-gray-500 text-sm">
                Training logs and metrics will appear here.
              </p>
            </div>
          )}

          {activeTab === 'shooting' && (
            <div className="bg-white border border-borderLight p-6 brutal-clip">
              <h2 className="font-display text-xl font-black text-dark uppercase mb-4">Shooting</h2>
              <p className="font-body text-gray-500 text-sm">
                Shooting statistics and form analysis will appear here.
              </p>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="bg-white border border-borderLight p-6 brutal-clip">
              <h2 className="font-display text-xl font-black text-dark uppercase mb-4">Nutrition</h2>
              <p className="font-body text-gray-500 text-sm">
                Nutrition tracking and meal logs will appear here.
              </p>
            </div>
          )}

          {activeTab === 'sleep' && (
            <div className="bg-white border border-borderLight p-6 brutal-clip">
              <h2 className="font-display text-xl font-black text-dark uppercase mb-4">Sleep</h2>
              <p className="font-body text-gray-500 text-sm">
                Sleep quality and recovery metrics will appear here.
              </p>
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="bg-white border border-borderLight p-6 brutal-clip">
              <h2 className="font-display text-xl font-black text-dark uppercase mb-4">Recovery</h2>
              <p className="font-body text-gray-500 text-sm">
                Recovery protocols and metrics will appear here.
              </p>
            </div>
          )}

          {activeTab === 'financials' && <Financials userEmail={user?.email} />}
        </div>
      </main>
    </div>
  );
};

export default PlayerDashboard;
