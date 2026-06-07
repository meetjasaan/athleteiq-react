import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, hasRoleAccess } from '../../utils/authUtils';
import { getAllOrganizations } from '../../services/firebaseService';
import SearchOmnibar from './SearchOmnibar';
import MetricsPanel from './MetricsPanel';
import OrgTable from './OrgTable';

const AdminPortal = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Check access
  if (!hasRoleAccess(user?.role, ROLES.SUPER_ADMIN)) {
    return (
      <div className="flex items-center justify-center h-screen bg-clinical">
        <div className="text-center">
          <h1 className="font-display text-2xl font-black text-dark mb-2">Access Denied</h1>
          <p className="font-body text-gray-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // Load organizations from Firebase (with fallback to localStorage)
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const firebaseOrgs = await getAllOrganizations();
        setOrganizations(firebaseOrgs);
        setFilteredOrgs(firebaseOrgs);
      } catch (error) {
        console.error('Error loading from Firebase, falling back to localStorage:', error);
        // Fallback to localStorage if Firebase fails
        const storedOrgs = JSON.parse(localStorage.getItem('athleteiq_organizations') || '[]');
        setOrganizations(storedOrgs);
        setFilteredOrgs(storedOrgs);
      }
    };
    loadOrganizations();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredOrgs(organizations);
      return;
    }

    const q = query.toLowerCase();
    const filtered = organizations.filter((org) => {
      return (
        org.name.toLowerCase().includes(q) ||
        org.directorEmail.toLowerCase().includes(q) ||
        (org.athletes && org.athletes.some((athlete) => athlete.name.toLowerCase().includes(q)))
      );
    });
    setFilteredOrgs(filtered);
  };

  return (
    <div className="min-h-screen bg-clinical">
      {/* Header */}
      <div className="bg-dark text-white p-6 border-b border-borderDark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-3xl font-black uppercase">System Administration</h1>
              <p className="font-mono text-xs text-gray-400 mt-1">SUPER ADMIN CONTROL CENTER</p>
            </div>
            <div className="text-right text-xs font-mono">
              <p className="text-gray-400">Logged in as</p>
              <p className="text-brand font-bold">{user?.name || 'Administrator'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Metrics Panel */}
        <MetricsPanel organizations={organizations} />

        {/* Search Omnibar */}
        <SearchOmnibar onSearch={handleSearch} query={searchQuery} />

        {/* Organizations Table */}
        <OrgTable organizations={filteredOrgs} onSelectOrg={setSelectedOrg} />

        {/* Detail Panel (if org selected) */}
        {selectedOrg && (
          <div className="bg-white border border-borderLight p-6 brutal-clip">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-black text-dark uppercase">
                {selectedOrg.name}
              </h2>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-gray-400 hover:text-dark transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <p className="text-gray-500 uppercase text-[10px] font-bold mb-1">Director Email</p>
                <p className="text-dark">{selectedOrg.directorEmail}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] font-bold mb-1">Subscription Tier</p>
                <p className="text-brand font-bold">{selectedOrg.tier || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] font-bold mb-1">Athletes</p>
                <p className="text-dark">{selectedOrg.athletes?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] font-bold mb-1">Created</p>
                <p className="text-dark">
                  {selectedOrg.createdAt ? new Date(selectedOrg.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
