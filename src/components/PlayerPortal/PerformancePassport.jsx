import React from 'react';

const PerformancePassport = ({ athleteData }) => {
  const stats = [
    { label: 'Training Sessions', value: athleteData?.stats?.training?.length || 0, icon: '🏋️' },
    { label: 'Shooting Records', value: athleteData?.stats?.shooting?.length || 0, icon: '🎯' },
    { label: 'Nutrition Logs', value: athleteData?.stats?.nutrition?.length || 0, icon: '🥗' },
    { label: 'Sleep Nights', value: athleteData?.stats?.sleep?.length || 0, icon: '😴' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-dark to-dark/90 border border-brand/20 rounded-lg p-8 text-white">
        <h2 className="font-display text-3xl font-black uppercase mb-2">Performance Passport</h2>
        <p className="font-body text-gray-300 text-sm max-w-lg">
          Your complete athletic profile. Track training, nutrition, sleep, and recovery metrics to optimize your development.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-borderLight p-6 brutal-clip text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display text-3xl font-black text-brand">{stat.value}</div>
            <p className="font-mono text-[10px] text-gray-500 uppercase font-bold mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Empty State Message */}
      {athleteData?.stats &&
        Object.values(athleteData.stats).every((arr) => arr.length === 0) && (
          <div className="bg-clinical border-2 border-dashed border-borderLight p-8 text-center rounded-lg">
            <p className="font-display text-lg font-bold text-dark mb-2">Welcome to Your Passport</p>
            <p className="font-body text-sm text-gray-500 max-w-md mx-auto">
              Start logging your training, nutrition, sleep, and recovery to build your complete athletic profile.
              Use the Fast Log below to record metrics in under 30 seconds.
            </p>
          </div>
        )}
    </div>
  );
};

export default PerformancePassport;
