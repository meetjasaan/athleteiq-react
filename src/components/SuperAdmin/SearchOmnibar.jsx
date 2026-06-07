import React from 'react';

const SearchOmnibar = ({ onSearch, query }) => {
  return (
    <div className="bg-white border border-borderLight p-4 brutal-clip">
      <div className="flex items-center gap-3">
        <span className="text-brand font-mono text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search organizations, directors, athlete names..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 bg-clinical border border-borderDark px-4 py-2 text-sm outline-none focus:border-brand font-mono"
        />
        {query && (
          <button
            onClick={() => onSearch('')}
            className="px-3 py-2 text-xs font-mono font-bold text-gray-500 hover:text-dark transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchOmnibar;
