import React, { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Disable Socket.IO for serverless deployment
    console.log('Socket.IO disabled for serverless deployment');
    
    // Mock socket for compatibility
    const mockSocket = {
      on: () => {},
      emit: () => {},
      disconnect: () => {},
      id: 'mock-socket'
    };
    
    setSocket(mockSocket);
    setIsConnected(false);
  }, []);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;