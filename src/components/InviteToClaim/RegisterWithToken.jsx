import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { decodeToken, markTokenAsClaimed } from '../../utils/tokenUtils';
import { useAuth } from '../../context/AuthContext';

const RegisterWithToken = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tokenData, setTokenData] = useState(null);
  const [tokenError, setTokenError] = useState(null);
  const [formData, setFormData] = useState({
    playerName: '',
    ageGroup: '',
    parentName: '',
    parentEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validate and decode token on mount
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setTokenError('No invitation token provided');
      return;
    }

    const validation = decodeToken(token);
    if (!validation.valid) {
      setTokenError(validation.error);
      return;
    }

    const { data } = validation;
    setTokenData({ ...data, token });
    setFormData((prev) => ({
      ...prev,
      playerName: data.playerName,
      ageGroup: data.ageGroup,
    }));
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.parentName || !formData.parentEmail) {
      setError('Please provide parent name and email');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Create player session
    const playerProfile = {
      id: tokenData.playerId,
      email: formData.parentEmail,
      name: formData.parentName,
      athleteName: formData.playerName,
      ageGroup: formData.ageGroup,
      role: 'player',
      organizationId: tokenData.organizationId,
      stats: {
        training: [],
        shooting: [],
        nutrition: [],
        sleep: [],
        recovery: [],
      },
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage for demo
    const players = JSON.parse(localStorage.getItem('athleteiq_players') || '[]');
    players.push(playerProfile);
    localStorage.setItem('athleteiq_players', JSON.stringify(players));

    // Mark token as claimed
    markTokenAsClaimed(tokenData.token);

    // Login user
    login(playerProfile);

    // Redirect to Performance Passport
    setTimeout(() => {
      navigate('/player/dashboard');
    }, 500);
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-clinical flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-borderLight p-6 brutal-clip text-center">
          <div className="text-red-600 text-3xl mb-3">⚠️</div>
          <h1 className="font-display text-xl font-black text-dark mb-2">Invalid Invitation</h1>
          <p className="font-body text-sm text-gray-500 mb-6">{tokenError}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-dark text-white font-display text-sm font-bold py-2 hover:bg-brand hover:text-dark transition-all brutal-clip"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-clinical flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-gray-400">Loading invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clinical pt-20 pb-10 px-4">
      <div className="max-w-md w-full mx-auto bg-white border border-borderLight p-6 brutal-clip">
        {/* Welcome Header */}
        <div className="mb-6 text-center border-b border-dashed border-borderLight pb-4">
          <p className="font-mono text-[10px] text-brand uppercase font-bold mb-2">Welcome to AthleteIQ</p>
          <h1 className="font-display text-2xl font-black text-dark">
            Welcome,{' '}
            <span className="text-brand">{formData.playerName}</span>.
          </h1>
          <p className="font-body text-xs text-gray-500 mt-2">Let's activate your AthleteIQ profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Athlete Information (Read-only) */}
          <div className="bg-clinical p-4 border border-borderLight space-y-3">
            <div>
              <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-1">
                Athlete Name
              </label>
              <div className="font-display font-bold text-dark text-sm px-3 py-2 bg-white border border-borderDark">
                {formData.playerName}
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-1">
                Age Group
              </label>
              <div className="font-display font-bold text-dark text-sm px-3 py-2 bg-white border border-borderDark">
                {formData.ageGroup}
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-1">
              Parent / Guardian Name
            </label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleInputChange}
              placeholder="parent@email.com"
              required
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-1">
              Create Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••"
              required
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••"
              required
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-900 text-xs p-3 font-mono">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark text-white font-display text-base font-black tracking-wider uppercase py-3 brutal-clip hover:bg-brand hover:text-dark transition-all disabled:opacity-50"
          >
            {loading ? 'Activating...' : 'Activate & Sign In'}
          </button>

          <p className="font-mono text-[10px] text-gray-400 text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterWithToken;
