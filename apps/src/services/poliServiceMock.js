import { normalizeName } from '../utils/validators'; 
 
let data = [ 
  { id: 1, nama_poli: 'Poli Umum', lokasi: 'Gedung A Lt 1' }, 
  { id: 2, nama_poli: 'Poli Gigi', lokasi: 'Gedung A Lt 2' }, 
  { id: 3, nama_poli: 'Poli Anak', lokasi: 'Gedung B Lt 1' }, 
]; 
let nextId = 4; 

const dipakaiJadwal = new Set([1]); 
 
const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms)); 
const galat = (status, message, field) => Object.assign(new Error(message), { status, 
field }); 
 
export async function listPoli() { 
  await wait(200); 
  return data.map((p) => ({ ...p })); 
} 
 
const cekNamaGanda = (nama, kecualiId) => 
  data.some((p) => p.id !== kecualiId && normalizeName(p.nama_poli) === 
normalizeName(nama)); 
 
export async function createPoli(payload) { 
  await wait(); 
  if (cekNamaGanda(payload.nama_poli)) throw galat(409, 'Nama poli sudah dipakai', 
'nama_poli'); 
  const row = { id: nextId++, ...payload }; 
  data = [...data, row]; 
  return { ...row }; 
} 
 
export async function updatePoli(id, payload) { 
  await wait(); 
  if (cekNamaGanda(payload.nama_poli, id)) throw galat(409, 'Nama poli sudah dipakai', 'nama_poli'); data = data.map((p) => (p.id === id ? { ...p, ...payload } : p)); 
  return data.find((p) => p.id === id); 
} 
 
export async function deletePoli(id) { 
  await wait(); 
  if (dipakaiJadwal.has(id)) throw galat(409, 'Poli masih dipakai oleh jadwal praktik dokter.'); data = data.filter((p) => p.id !== id); 
}