import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
// import api from '../config/axios'; // No longer needed for initial fetch

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false); // No initial loading state as we don't fetch initially
  const [error, setError] = useState(null);

  useEffect(() => {
    // Setup Socket.IO client
    const socket = io(API_BASE_URL);

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server for settings');
    });

    socket.on('settingsUpdated', (updatedSetting) => {
      console.log('Received settings update via Socket.IO:', updatedSetting);
      setSettings(prevSettings => ({
        ...prevSettings,
        [updatedSetting.key]: updatedSetting.value,
      }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server for settings');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const value = {
    settings,
    loading,
    error,
    setSettings, // Allow AdminSettingsPage to set initial settings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
