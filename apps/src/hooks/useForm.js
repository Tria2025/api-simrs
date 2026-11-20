import { useCallback, useRef, useState } from 'react'; 
import { validateAll, validateField } from '../utils/validators'; 
 
// Menyalin objek galat dengan satu kolom diganti; pesan kosong menghapus kuncinya. 
const withError = (errors, name, msg) => { 
  const next = { ...errors }; 
  if (msg) next[name] = msg; 
  else delete next[name]; 
  return next; 
}; 
 
export default function useForm({ initialValues, schema, onSubmit }) { 
  const [values, setValues] = useState(initialValues); 
  const [errors, setErrors] = useState({}); 
  const [touched, setTouched] = useState({}); 
  const [submitting, setSubmitting] = useState(false); 
 
  // ref menyimpan nilai terbaru agar validasi tidak memakai state yang basi 
  const valuesRef = useRef(initialValues); 
  const submittingRef = useRef(false); 
 
  const setValue = useCallback( 
    (name, value) => { 
      valuesRef.current = { ...valuesRef.current, [name]: value }; 
      setValues(valuesRef.current); 
      // validasi ulang tiap ketikan hanya bila kolom sedang menampilkan galat 
      setErrors((prev) => 
        prev[name] ? withError(prev, name, validateField(schema, name, 
valuesRef.current)) : prev 
      ); 
    }, 
    [schema] 
  ); 
 
  const touchField = useCallback( 
    (name) => { 
      setTouched((prev) => ({ ...prev, [name]: true })); 
      setErrors((prev) => withError(prev, name, validateField(schema, name, 
valuesRef.current))); 
    }, 
    [schema] 
  ); 
 
  // dipakai untuk galat dari server (Minggu 13): tampil di kolom yang sama 
  const setFieldError = useCallback((name, msg) => { 
    setTouched((prev) => ({ ...prev, [name]: true })); 
    setErrors((prev) => withError(prev, name, msg)); 
  }, []); 
 
  const handleSubmit = useCallback(async () => { 
    if (submittingRef.current) return; // cegah kirim ganda 
    const all = validateAll(schema, valuesRef.current); 
    const allTouched = {}; 
    Object.keys(schema).forEach((k) => (allTouched[k] = true)); 
    setTouched(allTouched); 
    setErrors(all); 
    if (Object.keys(all).length > 0) return; 
 
    submittingRef.current = true; 
    setSubmitting(true); 
    try { 
      await onSubmit(valuesRef.current, { setFieldError }); 
    } finally { 
      submittingRef.current = false; 
      setSubmitting(false); 
    } 
  }, [schema, onSubmit, setFieldError]); 
 
  const getFieldProps = (name) => ({ 
    value: values[name], 
    onChangeText: (t) => setValue(name, t), 
    onBlur: () => touchField(name), 
    error: touched[name] ? errors[name] || '' : '', 
  }); 
 
  return { values, errors, touched, submitting, setValue, touchField, setFieldError, 
handleSubmit, getFieldProps }; 
}