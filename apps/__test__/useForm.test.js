import React from 'react'; 
import TestRenderer, { act } from 'react-test-renderer'; 
import useForm from '../src/hooks/useForm'; 
import { required, minLength } from '../src/utils/validators'; 
 
global.IS_REACT_ACT_ENVIRONMENT = true; 
 
const schema = { nama: [required('Wajib'), minLength(3)] }; 
 
function setup(onSubmit) { 
  const ref = { current: null }; 
  const Probe = () => { 
    ref.current = useForm({ initialValues: { nama: '' }, schema, onSubmit }); 
    return null; 
  }; 
  act(() => { TestRenderer.create(<Probe />); }); 
  return ref; 
} 
 
test('galat tidak tampil sebelum kolom disentuh', () => { 
  const f = setup(jest.fn()); 
  expect(f.current.getFieldProps('nama').error).toBe(''); 
}); 
 
test('onBlur menampilkan galat, mengetik memperbaikinya', () => { 
  const f = setup(jest.fn()); 
  act(() => f.current.getFieldProps('nama').onBlur()); 
  expect(f.current.getFieldProps('nama').error).toBe('Wajib'); 
  act(() => f.current.getFieldProps('nama').onChangeText('ab')); 
  expect(f.current.getFieldProps('nama').error).toBe('Minimal 3 karakter'); 
  act(() => f.current.getFieldProps('nama').onChangeText('abc')); 
  expect(f.current.getFieldProps('nama').error).toBe(''); 
}); 
 
test('mengetik tidak memunculkan galat pada kolom yang belum bergalat', () => { 
  const f = setup(jest.fn()); 
  act(() => f.current.getFieldProps('nama').onChangeText('a')); 
  expect(f.current.getFieldProps('nama').error).toBe(''); 
}); 
 
test('submit tidak memanggil onSubmit bila ada galat', async () => { 
  const onSubmit = jest.fn(); 
  const f = setup(onSubmit); 
  await act(async () => { await f.current.handleSubmit(); }); 
  expect(onSubmit).not.toHaveBeenCalled(); 
  expect(f.current.getFieldProps('nama').error).toBe('Wajib'); 
}); 
 
test('submit valid memanggil onSubmit sekali meski ditekan dua kali', async () => { 
  let release; 
  const onSubmit = jest.fn(() => new Promise((r) => { release = r; })); 
  const f = setup(onSubmit); 
  act(() => f.current.getFieldProps('nama').onChangeText('Anak')); 
  let p1, p2; 
  await act(async () => { 
    p1 = f.current.handleSubmit(); 
    p2 = f.current.handleSubmit(); 
  }); 
  expect(onSubmit).toHaveBeenCalledTimes(1); 
  expect(f.current.submitting).toBe(true); 
  await act(async () => { release(); await p1; await p2; }); 
  expect(f.current.submitting).toBe(false); 
}); 
 
test('setFieldError menampilkan galat server dan submitting kembali false', async () => { 
  const onSubmit = jest.fn(async (v, { setFieldError }) => { setFieldError('nama', 
'Sudah dipakai'); }); 
  const f = setup(onSubmit); 
  act(() => f.current.getFieldProps('nama').onChangeText('Anak')); 
  await act(async () => { await f.current.handleSubmit(); }); 
  expect(f.current.getFieldProps('nama').error).toBe('Sudah dipakai'); 
  expect(f.current.submitting).toBe(false); 
});