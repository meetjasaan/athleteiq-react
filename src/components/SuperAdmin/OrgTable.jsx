import React from 'react';

const OrgTable = ({ organizations, onSelectOrg }) => {
  if (organizations.length === 0) {
    return (
      <div className="bg-white border border-borderLight p-8 text-center brutal-clip">
        <p className="font-mono text-sm text-gray-400">No organizations found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-borderLight overflow-hidden brutal-clip">
      <table className="w-full text-sm">
        <thead className="border-b border-borderLight bg-clinical">
          <tr>
            <th className="px-6 py-3 text-left font-mono text-[10px] uppercase font-bold text-gray-600">
              Organization
            </th>
            <th className="px-6 py-3 text-left font-mono text-[10px] uppercase font-bold text-gray-600">
              Director
            </th>
            <th className="px-6 py-3 text-left font-mono text-[10px] uppercase font-bold text-gray-600">
              Athletes
            </th>
            <th className="px-6 py-3 text-left font-mono text-[10px] uppercase font-bold text-gray-600">
              Tier
            </th>
            <th className="px-6 py-3 text-left font-mono text-[10px] uppercase font-bold text-gray-600">
              Status
            </th>
            <th className="px-6 py-3 text-right font-mono text-[10px] uppercase font-bold text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borderLight">
          {organizations.map((org, idx) => (
            <tr key={idx} className="hover:bg-clinical/50 transition-colors">
              <td className="px-6 py-4 font-display font-bold text-dark">{org.name}</td>
              <td className="px-6 py-4 font-mono text-xs text-gray-600">{org.directorEmail}</td>
              <td className="px-6 py-4 font-mono font-bold text-dark">{org.athletes?.length || 0}</td>
              <td className="px-6 py-4 font-mono text-xs font-bold">
                <span
                  className="px-2 py-1 rounded"
                  style={{
                    backgroundColor:
                      org.tier === 'FREE'
                        ? '#FEF3C7'
                        : org.tier === 'SMALL_CLUB'
                          ? '#DBEAFE'
                          : org.tier === 'MID_SIZE'
                            ? '#F3E8FF'
                            : '#F5F5F5',
                    color:
                      org.tier === 'FREE'
                        ? '#92400E'
                        : org.tier === 'SMALL_CLUB'
                          ? '#1E40AF'
                          : org.tier === 'MID_SIZE'
                            ? '#581C87'
                            : '#6B7280',
                  }}
                >
                  {org.tier || 'UNSET'}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-xs">
                <span
                  className={`px-2 py-1 rounded ${
                    org.status === 'active' ? 'bg-green-100 text-green-900' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {org.status || 'active'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onSelectOrg(org)}
                  className="text-brand hover:text-dark font-mono text-xs font-bold transition-colors"
                >
                  View →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrgTable;
