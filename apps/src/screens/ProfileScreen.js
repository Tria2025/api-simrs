import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { confirmDestructive } from '../utils/dialog';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () =>
    confirmDestructive({
      title: 'Keluar',
      message: 'Yakin ingin keluar dari aplikasi?',
      confirmText: 'Keluar',
      cancelText: 'Batal',
      onConfirm: () => logout(),
    });

  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.label}>Nama</Text>
        <Text style={s.value}>{user?.nama}</Text>
        <Text style={s.label}>Peran</Text>
        <Text style={s.value}>{user?.role}</Text>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleLogout}>
        <Text style={s.btnText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 10, elevation: 2 },
  label: { color: '#6b7280', marginTop: 8 },
  value: { fontSize: 18, fontWeight: '600' },
  btn: {
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});