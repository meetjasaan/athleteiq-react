import React, { useState } from 'react';

const FastLogForm = ({ onLogSubmit }) => {
  const [formData, setFormData] = useState({
    rpe: 5,
    shotsMade: 0,
    shotsAttempted: 0,
    hydration: 'moderate',
    protein: 'moderate',
    sleepQuality: 3,
    recovery: 'moderate',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogSubmit({
      ...formData,
      timestamp: new Date().toISOString(),
    });
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        rpe: 5,
        shotsMade: 0,
        shotsAttempted: 0,
        hydration: 'moderate',
        protein: 'moderate',
        sleepQuality: 3,
        recovery: 'moderate',
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="bg-white border border-borderLight p-6 brutal-clip">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-black text-dark uppercase">Fast Log</h3>
        <span className="font-mono text-[10px] text-gray-400">⏱️ &lt;30 seconds</span>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-300 text-green-900 p-4 text-center brutal-clip">
          <p className="font-display font-bold">✓ Log recorded</p>
          <p className="font-mono text-xs mt-1">Your metrics have been saved.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* RPE */}
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              RPE (1-10)
            </label>
            <input
              type="range"
              name="rpe"
              min="1"
              max="10"
              value={formData.rpe}
              onChange={handleChange}
              className="w-full"
            />
            <div className="text-center font-display font-bold text-brand text-lg mt-1">
              {formData.rpe}
            </div>
          </div>

          {/* Shooting */}
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              Shots Made / Attempted
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="shotsMade"
                value={formData.shotsMade}
                onChange={handleChange}
                placeholder="Made"
                className="flex-1 bg-clinical border border-borderDark px-2 py-2 text-sm outline-none focus:border-brand text-center"
              />
              <span className="flex items-center font-bold text-gray-400">/</span>
              <input
                type="number"
                name="shotsAttempted"
                value={formData.shotsAttempted}
                onChange={handleChange}
                placeholder="Attempt"
                className="flex-1 bg-clinical border border-borderDark px-2 py-2 text-sm outline-none focus:border-brand text-center"
              />
            </div>
          </div>

          {/* Hydration */}
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              Hydration
            </label>
            <select
              name="hydration"
              value={formData.hydration}
              onChange={handleChange}
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="poor">Poor</option>
              <option value="moderate">Moderate</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>

          {/* Protein */}
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              Protein Intake
            </label>
            <select
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="poor">Poor</option>
              <option value="moderate">Moderate</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>

          {/* Sleep Quality */}
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              Sleep Quality (1-5)
            </label>
            <input
              type="range"
              name="sleepQuality"
              min="1"
              max="5"
              value={formData.sleepQuality}
              onChange={handleChange}
              className="w-full"
            />
            <div className="text-center font-display font-bold text-brand text-lg mt-1">
              {formData.sleepQuality}
            </div>
          </div>

          {/* Recovery */}
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              Recovery Status
            </label>
            <select
              name="recovery"
              value={formData.recovery}
              onChange={handleChange}
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="poor">Poor</option>
              <option value="moderate">Moderate</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-brand text-dark font-display font-black text-sm py-3 brutal-clip hover:bg-dark hover:text-brand transition-all"
            >
              Log Metrics
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FastLogForm;
