/**
 * Firebase/Firestore Service Layer
 * Replaces localStorage with real database operations
 */

import {
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================
// USERS / AUTHENTICATION
// ============================================

export const saveUserSession = async (user) => {
  try {
    await setDoc(doc(db, 'users', user.id), {
      ...user,
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving user session:', error);
    throw error;
  }
};

export const getUserSession = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

// ============================================
// ORGANIZATIONS
// ============================================

export const createOrganization = async (orgData) => {
  try {
    const docRef = await addDoc(collection(db, 'organizations'), {
      ...orgData,
      createdAt: serverTimestamp(),
      status: 'active',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

export const getAllOrganizations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'organizations'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
};

export const getOrganization = async (orgId) => {
  try {
    const docSnap = await getDoc(doc(db, 'organizations', orgId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  }
};

export const updateOrganization = async (orgId, updates) => {
  try {
    await updateDoc(doc(db, 'organizations', orgId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

// ============================================
// PLAYERS
// ============================================

export const createPlayer = async (playerData) => {
  try {
    const docRef = await addDoc(collection(db, 'players'), {
      ...playerData,
      createdAt: serverTimestamp(),
      stats: {
        training: [],
        shooting: [],
        nutrition: [],
        sleep: [],
        recovery: [],
      },
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
};

export const getPlayersByOrganization = async (orgId) => {
  try {
    const q = query(collection(db, 'players'), where('organizationId', '==', orgId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
};

export const getPlayer = async (playerId) => {
  try {
    const docSnap = await getDoc(doc(db, 'players', playerId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error fetching player:', error);
    return null;
  }
};

export const updatePlayer = async (playerId, updates) => {
  try {
    await updateDoc(doc(db, 'players', playerId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
};

// ============================================
// PLAYER STATS / FAST LOG
// ============================================

export const addPlayerStat = async (playerId, statType, statData) => {
  try {
    const player = await getPlayer(playerId);
    if (!player) throw new Error('Player not found');

    const updatedStats = {
      ...player.stats,
      [statType]: [
        ...player.stats[statType],
        {
          ...statData,
          timestamp: serverTimestamp(),
        },
      ],
    };

    await updatePlayer(playerId, { stats: updatedStats });
  } catch (error) {
    console.error('Error adding player stat:', error);
    throw error;
  }
};

// ============================================
// TOKENS (Invite-to-Claim)
// ============================================

export const createToken = async (tokenData) => {
  try {
    const docRef = await addDoc(collection(db, 'invitationTokens'), {
      ...tokenData,
      createdAt: serverTimestamp(),
      claimed: false,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

export const getTokenByValue = async (tokenValue) => {
  try {
    const q = query(collection(db, 'invitationTokens'), where('value', '==', tokenValue));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0
      ? { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }
      : null;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
};

export const markTokenAsClaimed = async (tokenId) => {
  try {
    await updateDoc(doc(db, 'invitationTokens', tokenId), {
      claimed: true,
      claimedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking token as claimed:', error);
    throw error;
  }
};

// ============================================
// TRANSACTIONS (Financials)
// ============================================

export const createTransaction = async (transactionData) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: serverTimestamp(),
      status: 'pending',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const getTransactionsByPlayer = async (playerId) => {
  try {
    const q = query(collection(db, 'transactions'), where('playerId', '==', playerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const updateTransaction = async (transactionId, updates) => {
  try {
    await updateDoc(doc(db, 'transactions', transactionId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// ============================================
// UTILITY: Migrate from localStorage to Firestore
// ============================================

export const migrateLocalStorageToFirebase = async () => {
  try {
    // Migrate organizations
    const orgs = JSON.parse(localStorage.getItem('athleteiq_organizations') || '[]');
    for (const org of orgs) {
      await createOrganization(org);
    }

    // Migrate players
    const players = JSON.parse(localStorage.getItem('athleteiq_players') || '[]');
    for (const player of players) {
      await createPlayer(player);
    }

    console.log('✅ Migration from localStorage to Firebase complete');
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
};
