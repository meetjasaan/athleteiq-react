/**
 * Token Utility Functions
 * Handles token generation, validation, and encoding/decoding
 */

// Generate a token for a player
export const generatePlayerToken = (playerData) => {
  const tokenData = {
    playerId: playerData.id || Math.random().toString(36).substr(2, 9),
    playerName: playerData.name,
    ageGroup: playerData.ageGroup,
    organizationId: playerData.organizationId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };

  return btoa(JSON.stringify(tokenData));
};

// Decode and validate token
export const decodeToken = (token) => {
  try {
    const decoded = JSON.parse(atob(token));
    const now = new Date();
    const expiresAt = new Date(decoded.expiresAt);

    if (now > expiresAt) {
      return { valid: false, error: 'Token has expired' };
    }

    return { valid: true, data: decoded };
  } catch (err) {
    return { valid: false, error: 'Invalid token format' };
  }
};

// Store token in localStorage for demo mode
export const storeToken = (token, playerName) => {
  const tokens = JSON.parse(localStorage.getItem('athleteiq_tokens') || '{}');
  tokens[token] = {
    playerName,
    createdAt: new Date().toISOString(),
    claimed: false,
  };
  localStorage.setItem('athleteiq_tokens', JSON.stringify(tokens));
};

// Retrieve token metadata
export const getTokenMetadata = (token) => {
  const tokens = JSON.parse(localStorage.getItem('athleteiq_tokens') || '{}');
  return tokens[token] || null;
};

// Mark token as claimed
export const markTokenAsClaimed = (token) => {
  const tokens = JSON.parse(localStorage.getItem('athleteiq_tokens') || '{}');
  if (tokens[token]) {
    tokens[token].claimed = true;
    localStorage.setItem('athleteiq_tokens', JSON.stringify(tokens));
  }
};
