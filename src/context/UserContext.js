'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { profiles as localProfiles } from '@/data/dummyData'; // Fallback

const UserContext = createContext();

const API_URL = 'http://localhost:5050/api';

export function UserProvider({ children }) {
  const [user, setUser] = useState(localProfiles.jordan); // Start with local as initial state to avoid hydration mismatch
  const [currentId, setCurrentId] = useState('jordan');
  const [availableProfiles, setAvailableProfiles] = useState(localProfiles);

  // Fetch profiles on mount
  useEffect(() => {
    fetch(`${API_URL}/profiles`)
      .then(res => res.json())
      .then(data => {
        setAvailableProfiles(data);
        if (data[currentId]) {
          setUser(data[currentId]);
        }
      })
      .catch(err => {
        console.warn("Backend offline, using local data", err);
      });
  }, [currentId]);

  // Switch between profiles
  const switchProfile = (profileKey) => {
    setCurrentId(profileKey);
    // Optimistic update
    if (availableProfiles[profileKey]) {
      setUser(availableProfiles[profileKey]);
    }
  };

  // Update user state (and sync to backend)
  const updateUser = async (updates) => {
    // 1. Optimistic local update
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      // Local history logic
      if (updates.creditScore && updates.creditScore !== prev.creditScore) {
         const newHistory = prev.history.map(h => ({...h}));
         if (newHistory.length > 0) newHistory[newHistory.length - 1].score = updates.creditScore;
         newUser.history = newHistory;
         if (newHistory.length >= 2) {
           const prevScore = newHistory[newHistory.length - 2].score;
           newUser.scoreChange = updates.creditScore - prevScore;
         }
      }
      return newUser;
    });

    // 2. Sync to backend
    try {
      await fetch(`${API_URL}/profiles/${currentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error("Failed to save to backend", e);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, switchProfile, availableProfiles }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
