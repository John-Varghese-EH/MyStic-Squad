
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Profile = {
  name: string;
  email: string;
  avatar: string;
};

type ProfileContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  isLoading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const defaultProfile: Profile = {
  name: 'Operator',
  email: 'operator@example.com',
  avatar: 'https://placehold.co/100x100.png',
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfileState(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to parse user profile from localStorage", error);
      setProfileState(defaultProfile);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const setProfile = (newProfile: Profile) => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      setProfileState(newProfile);
    } catch (error) {
      console.error("Failed to save user profile to localStorage", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
