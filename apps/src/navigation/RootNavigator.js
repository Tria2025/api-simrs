import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import MainTabs from './MainTabs';
import PoliListScreen from '../screens/PoliListScreen';
import PoliFormScreen from '../screens/PoliFormScreen';
import {
  DokterList,
  DokterForm,
  PasienList,
  PasienForm,
  PendaftaranList,
  PendaftaranForm,
  RekamMedisList,
  RekamMedisForm,
  ResepList,
  ResepForm,
  UsersList,
  UsersForm,
} from '../screens/entityScreens';

const Stack = createNativeStackNavigator();

const listOpt = (title) => ({ title });
const formOpt = (nama) => ({ route }) => ({
  title: `${route.params?.item ? 'Ubah' : 'Tambah'} ${nama}`,
});

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        // Sudah masuk: tab utama + semua layar daftar/form
        <Stack.Group>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PoliList"
            component={PoliListScreen}
            options={listOpt('Data Poli')}
          />
          <Stack.Screen
            name="PoliForm"
            component={PoliFormScreen}
            options={formOpt('Poli')}
          />
          <Stack.Screen
            name="DokterList"
            component={DokterList}
            options={listOpt('Data Dokter')}
          />
          <Stack.Screen
            name="DokterForm"
            component={DokterForm}
            options={formOpt('Dokter')}
          />
          <Stack.Screen
            name="PasienList"
            component={PasienList}
            options={listOpt('Data Pasien')}
          />
          <Stack.Screen
            name="PasienForm"
            component={PasienForm}
            options={formOpt('Pasien')}
          />
          <Stack.Screen
            name="PendaftaranList"
            component={PendaftaranList}
            options={listOpt('Pendaftaran')}
          />
          <Stack.Screen
            name="PendaftaranForm"
            component={PendaftaranForm}
            options={formOpt('Pendaftaran')}
          />
          <Stack.Screen
            name="RekamMedisList"
            component={RekamMedisList}
            options={listOpt('Rekam Medis')}
          />
          <Stack.Screen
            name="RekamMedisForm"
            component={RekamMedisForm}
            options={formOpt('Rekam Medis')}
          />
          <Stack.Screen
            name="ResepList"
            component={ResepList}
            options={listOpt('Resep Obat')}
          />
          <Stack.Screen
            name="ResepForm"
            component={ResepForm}
            options={formOpt('Resep')}
          />
          <Stack.Screen
            name="UsersList"
            component={UsersList}
            options={listOpt('Data User')}
          />
          <Stack.Screen
            name="UsersForm"
            component={UsersForm}
            options={formOpt('User')}
          />
        </Stack.Group>
      ) : (
        // Belum masuk: hanya layar Login yang terdaftar
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Masuk' }}
        />
      )}
    </Stack.Navigator>
  );
}