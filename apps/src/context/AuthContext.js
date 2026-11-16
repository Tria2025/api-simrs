import React, { createContext, useContext, useMemo, useReducer } from 'react';

export const ROLES = ['admin', 'dokter', 'pasien'];
export const initialState = { user: null };

// Reducer = fungsi murni: (state lama, aksi) -> state baru. Tanpa efek samping.
export function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const { nama, role } = action.payload;
      if (!ROLES.includes(role)) return state; // peran tidak dikenal: abaikan
      return { user: { nama, role } };
    }
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const value = useMemo(
    () => ({
      user: state.user,
      login: (nama, role) => dispatch({ type: 'LOGIN', payload: { nama, role } }),
      logout: () => dispatch({ type: 'LOGOUT' }),
    }),
    [state.user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}