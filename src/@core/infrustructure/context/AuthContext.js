import React, {createContext, useContext, useEffect} from 'react';
import {useSelector} from 'react-redux';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  // Get role and permissions from Redux store
  const reduxRole = useSelector(state => state.auth.role);
  const reduxPermissions = useSelector(state => state.auth.permissions);

  // Debug logging
  useEffect(() => {
    console.log('🔄 AuthContext Redux state changed:');
    console.log('  reduxRole:', reduxRole);
  }, [reduxRole]);

  // Extract role name safely
  const roleName = reduxRole?.name ? reduxRole.name.toLowerCase() : '';

  const contextValue = {
    role: roleName,
    roleData: reduxRole,
    permissions: reduxPermissions || [],
    isLoading: false,
    hasPermission: permission => {
      if (!reduxPermissions || !Array.isArray(reduxPermissions)) {
        return false;
      }
      return reduxPermissions.some(p => p && p === permission);
    },
    isCustomer: roleName === 'customer',
    isSalesman: roleName === 'salesman',
    isSupplier: roleName === 'supplier',
    isAuthenticated: !!reduxRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
