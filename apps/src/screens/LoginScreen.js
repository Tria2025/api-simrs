import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAuth, ROLES } from '../context/AuthContext';

// Login SIMULASI: belum memanggil API. Login sungguhan dibahas pada Minggu 13 dan 16.
export default function LoginScreen() {
  const { login } = useAuth();
  const [nama, setNama] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (nama.trim() === '') {
      setError('Nama wajib diisi');
      return;
    }
    setError('');
    // Tidak ada navigation.navigate di sini: begitu state `user` terisi,
    // RootNavigator otomatis menampilkan layar utama.
    login(nama.trim(), role);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Masuk ke SIMRS</Text>
      <Text style={s.note}>Mode simulasi: pilih peran untuk menguji menu.</Text>

      <Text style={s.label}>Nama *</Text>
      <TextInput
        style={[s.input, !!error && s.inputError]}
        placeholder="Contoh: Budi"
        value={nama}
        onChangeText={setNama}
      />
      {!!error && <Text style={s.error}>{error}</Text>}

      <Text style={s.label}>Peran</Text>
      <View style={s.chipRow}>
        {ROLES.map((r) => {
          const active = role === r;
          return (
            <TouchableOpacity
              key={r}
              style={[s.chip, active && s.chipActive]}
              onPress={() => setRole(r)}
            >
              <Text style={active ? s.chipTextActive : s.chipText}>{r}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={s.btn} onPress={handleLogin}>
        <Text style={s.btnText}>Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  note: {
    color: '#6b7280',
    marginTop: 4,
  },
  label: {
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  error: {
    color: '#ef4444',
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    color: '#111827',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});