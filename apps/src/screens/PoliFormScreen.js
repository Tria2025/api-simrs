import React, { useEffect, useMemo, useState } from 'react'; 
import { ScrollView, Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native'; 
import useForm from '../hooks/useForm'; 
import { FormField, ChoiceField } from '../components/FormField'; 
import { 
  required, minLength, maxLength, pattern, oneOf, unique, NAMA_POLI_RE, 
} from '../utils/validators'; 
import { notify } from '../utils/dialog'; 
import { listPoli, createPoli, updatePoli } from '../services/poliServiceMock'; 
 
const LOKASI_POLI = ['Gedung A Lt 1', 'Gedung A Lt 2', 'Gedung B Lt 1', 'Gedung B Lt 2']; 
 
export default function PoliFormScreen({ navigation, route }) { 
  const editing = route.params?.item ?? null; 
  const [existing, setExisting] = useState([]); 
 
  useEffect(() => { 
    navigation.setOptions({ title: editing ? 'Ubah Poli' : 'Tambah Poli' }); 
    listPoli().then(setExisting).catch(() => {}); 
  }, [navigation, editing]); 
 
  const schema = useMemo( 
    () => ({ 
      nama_poli: [ 
        required('Nama poli wajib diisi'), 
        minLength(3), 
        maxLength(50), 
        pattern(NAMA_POLI_RE, 'Hanya huruf, angka, spasi, titik, & dan tanda hubung'), 
        unique( 
          () => existing.filter((p) => !editing || p.id !== editing.id).map((p) => 
p.nama_poli), 
          'Nama poli sudah ada' 
        ), 
      ], 
      lokasi: [required('Pilih lokasi poli'), oneOf(LOKASI_POLI)], 
    }), 
    [existing, editing] 
  ); 
 
  const onSubmit = async (v, { setFieldError }) => { 
    const payload = { nama_poli: v.nama_poli.trim().replace(/\s+/g, ' '), lokasi: 
v.lokasi }; 
    try { 
      if (editing) await updatePoli(editing.id, payload); 
      else await createPoli(payload); 
      notify('Berhasil', 'Data poli tersimpan.', () => navigation.goBack()); 
    } catch (e) { 
      if (e.status === 409 && e.field) {
        setFieldError(e.field, e.message); // Galat server pada kolom.
      } else {
        notify('Gagal menyimpan', e.message || 'Periksa koneksi lalu coba lagi.');
      }
    } 
}; 
 
  const form = useForm({ 
    initialValues: { nama_poli: editing?.nama_poli ?? '', lokasi: editing?.lokasi ?? 
'' }, 
    schema, 
    onSubmit, 
  }); 
 
  const lokasi = form.getFieldProps('lokasi'); 
 
  return ( 
    <ScrollView contentContainerStyle={styles.wrap} 
keyboardShouldPersistTaps="handled"> 
      <FormField 
        label="Nama poli" 
        placeholder="Contoh: Poli Anak" 
        maxLength={50} 
        autoCapitalize="words" 
        returnKeyType="done" 
        editable={!form.submitting} 
        {...form.getFieldProps('nama_poli')} 
      /> 
      <ChoiceField 
        label="Lokasi" 
        options={LOKASI_POLI} 
        value={lokasi.value} 
        onChange={lokasi.onChangeText} 
        onBlur={lokasi.onBlur} 
        error={lokasi.error} 
      /> 
      <Pressable 
        accessibilityRole="button" 
        accessibilityState={{ disabled: form.submitting }} 
        disabled={form.submitting} 
        onPress={form.handleSubmit} 
        style={[styles.btn, form.submitting ? styles.btnOff : null]} 
      > 
        {form.submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text 
style={styles.btnText}>Simpan</Text>} 
      </Pressable> 
    </ScrollView> 
  ); 
} 
 
const styles = StyleSheet.create({ 
  wrap: { padding: 16 }, 
  btn: { minHeight: 48, borderRadius: 8, backgroundColor: '#1D4ED8', alignItems: 
'center', justifyContent: 'center' }, 
  btnOff: { opacity: 0.6 }, 
  btnText: { color: '#FFFFFF', fontWeight: '600' }, 
});