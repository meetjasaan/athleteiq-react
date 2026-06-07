import React, { useMemo } from 'react';

const MetricsPanel = ({ organizations }) => {
  const metrics = useMemo(() => {
    const totalOrganizations = organizations.length;
    const totalAthletes = organizations.reduce((sum, org) => sum + (org.athletes?.length || 0), 0);

    const tierBreakdown = organizations.reduce((acc, org) => {
      const tier = org.tier || 'UNASSIGNED';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});

    const avgAthletesPerOrg =
      totalOrganizations > 0 ? (totalAthletes / totalOrganizations).toFixed(1) : 0;

    return {
      totalOrganizations,
      totalAthletes,
      tierBreakdown,
      avgAthletesPerOrg,
    };
  }, [organizations]);

  const tierColors = {
    FREE: '#F59E0B',
    SMALL_CLUB: '#3B82F6',
    MID_SIZE: '#8B5CF6',
    LARGE_ORG: '#EC4899',
    UNASSIGNED: '#9CA3AF',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Organizations */}
      <div className="bg-white border border-borderLight p-6 brutal-clip">
        <div className="font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
          Total Organizations
        </div>
        <div className="font-display text-4xl font-black text-dark">
          {metrics.totalOrganizations}
        </div>
        <p className="font-mono text-xs text-gray-400 mt-2">Active programs</p>
      </div>

      {/* Total Athletes */}
      <div className="bg-white border border-borderLight p-6 brutal-clip">
        <div className="font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
          Total Athletes
        </div>
        <div className="font-display text-4xl font-black text-brand">
          {metrics.totalAthletes}
        </div>
        <p className="font-mono text-xs text-gray-400 mt-2">Across all programs</p>
      </div>

      {/* Avg Athletes per Org */}
      <div className="bg-white border border-borderLight p-6 brutal-clip">
        <div className="font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
          Avg per Organization
        </div>
        <div className="font-display text-4xl font-black text-dark">
          {metrics.avgAthletesPerOrg}
        </div>
        <p className="font-mono text-xs text-gray-400 mt-2">Athletes per program</p>
      </div>

      {/* Subscription Breakdown */}
      <div className="bg-white border border-borderLight p-6 brutal-clip">
        <div className="font-mono text-[10px] text-gray-500 uppercase font-bold mb-3">
          Tier Distribution
        </div>
        <div className="space-y-2">
          {Object.entries(metrics.tierBreakdown).map(([tier, count]) => (
            <div key={tier} className="flex items-center justify-between text-xs">
              <span className="font-mono text-gray-600">{tier}</span>
              <span
                className="font-bold"
                style={{ color: tierColors[tier] || '#9CA3AF' }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
