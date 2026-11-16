// Daftar menu beranda beserta peran yang boleh melihatnya (matriks akses contoh).
export const MENU = [
  { label: 'Data Poli', route: 'PoliList', roles: ['admin', 'dokter'] },
  { label: 'Data Dokter', route: 'DokterList', roles: ['admin'] },
  { label: 'Data Pasien', route: 'PasienList', roles: ['admin', 'dokter'] },
  { label: 'Pendaftaran Antrian', route: 'PendaftaranList', roles: ['admin', 'dokter', 'pasien'] },
  { label: 'Rekam Medis (dan Resep)', route: 'RekamMedisList', roles: ['admin', 'dokter'] },
  { label: 'Data user', route: 'UsersList', roles: ['admin'] },
];

export const menuForRole = (role) => MENU.filter((m) => m.roles.includes(role));