const str = (v) => (v === undefined || v === null ? '' : String(v)).trim();

export const normalizeName = (v) => str(v).replace(/\s+/g, ' ').toLowerCase();

export const required = (msg = 'Wajib diisi') => (v) =>
  str(v) === '' ? msg : '';

export const minLength = (n, msg) => (v) =>
  str(v) !== '' && str(v).length < n
    ? msg || `Minimal ${n} karakter`
    : '';

export const maxLength = (n, msg) => (v) =>
  str(v).length > n ? msg || `Maksimal ${n} karakter` : '';

export const pattern = (re, msg = 'Format tidak valid') => (v) =>
  str(v) !== '' && !re.test(str(v)) ? msg : '';

export const oneOf = (list, msg = 'Pilih salah satu pilihan yang tersedia') => (v) =>
  str(v) !== '' && !list.includes(v) ? msg : '';

export const inRange = (min, max, msg) => (v) => {
  const s = str(v);
  if (s === '') return '';
  const ok = /^-?\d+$/.test(s) && Number(s) >= min && Number(s) <= max;
  return ok ? '' : msg || `Isi bilangan bulat ${min} sampai ${max}`;
};

export const unique = (getList, msg = 'Nilai sudah ada') => (v) => {
  const key = normalizeName(v);
  return key !== '' && getList().some((x) => normalizeName(x) === key) ? msg : '';
};

export const validateField = (schema, name, values) => {
  const rules = schema[name] || [];
  for (const rule of rules) {
    const msg = rule(values[name], values);
    if (msg) return msg;
  }
  return '';
};

export const validateAll = (schema, values) => {
  const errors = {};
  Object.keys(schema).forEach((name) => {
    const msg = validateField(schema, name, values);
    if (msg) errors[name] = msg;
  });
  return errors;
};

export const NAMA_POLI_RE = /^[A-Za-z0-9 .&-]+$/;
export const NIK_RE = /^\d{16}$/;