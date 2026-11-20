import { 
  required, minLength, maxLength, pattern, oneOf, inRange, unique, 
  validateField, validateAll, NAMA_POLI_RE, NIK_RE, normalizeName, 
} from '../src/utils/validators'; 
 
describe('aturan dasar', () => { 
  test('required menolak kosong dan spasi saja', () => { 
    expect(required()('')).toBe('Wajib diisi'); 
    expect(required()('   ')).toBe('Wajib diisi'); 
    expect(required()(undefined)).toBe('Wajib diisi'); 
    expect(required()('a')).toBe(''); 
  }); 
 
  test('minLength dan maxLength memangkas spasi tepi', () => { 
    expect(minLength(3)('ab ')).toBe('Minimal 3 karakter'); 
    expect(minLength(3)('abc')).toBe(''); 
    expect(minLength(3)('')).toBe(''); 
    expect(maxLength(5)('abcdef')).toBe('Maksimal 5 karakter'); 
    expect(maxLength(5)('abcde')).toBe(''); 
  }); 
 
  test('pattern mengabaikan kosong', () => { 
    expect(pattern(NIK_RE, 'x')('')).toBe(''); 
    expect(pattern(NIK_RE, 'x')('1234')).toBe('x'); 
    expect(pattern(NIK_RE, 'x')('3571012345678901')).toBe(''); 
    expect(pattern(NIK_RE, 'x')('357101234567890a')).toBe('x'); 
  }); 
 
  test('NAMA_POLI_RE', () => { 
    expect(NAMA_POLI_RE.test('Poli Gigi & Mulut')).toBe(true); 
    expect(NAMA_POLI_RE.test('Poli THT-KL')).toBe(true); 
    expect(NAMA_POLI_RE.test('Poli <script>')).toBe(false); 
  }); 
 
  test('oneOf', () => { 
    expect(oneOf(['A', 'B'])('C')).not.toBe(''); 
    expect(oneOf(['A', 'B'])('A')).toBe(''); 
    expect(oneOf(['A', 'B'])('')).toBe(''); 
  }); 
 
  test('inRange hanya menerima bilangan bulat', () => { 
    const r = inRange(1, 100); 
    expect(r('1')).toBe(''); 
    expect(r('100')).toBe(''); 
    expect(r('0')).not.toBe(''); 
    expect(r('101')).not.toBe(''); 
    expect(r('12.5')).not.toBe(''); 
    expect(r('1e1')).not.toBe(''); 
    expect(r('abc')).not.toBe(''); 
    expect(r('')).toBe(''); 
  }); 
 
  test('unique tidak membedakan huruf besar, spasi ganda, dan spasi tepi', () => { 
    const u = unique(() => ['Poli Umum', 'Poli Gigi'], 'ada'); 
    expect(u('poli   umum ')).toBe('ada'); 
    expect(u('POLI GIGI')).toBe('ada'); 
    expect(u('Poli Anak')).toBe(''); 
    expect(u('')).toBe(''); 
    expect(normalizeName('  A   b ')).toBe('a b'); 
  }); 
}); 
 
describe('validateField dan validateAll', () => { 
  const schema = { 
    nama: [required('Nama wajib'), minLength(3), maxLength(10)], 
    kuota: [required(), inRange(1, 100)], 
  }; 
 
  test('galat pertama pada rantai yang dikembalikan', () => { 
    expect(validateField(schema, 'nama', { nama: '' })).toBe('Nama wajib'); 
    expect(validateField(schema, 'nama', { nama: 'ab' })).toBe('Minimal 3 karakter'); 
    expect(validateField(schema, 'nama', { nama: 'abc' })).toBe(''); 
  }); 
 
  test('validateAll hanya memuat kolom bermasalah', () => { 
    expect(validateAll(schema, { nama: 'Anak', kuota: '20' })).toEqual({}); 
    expect(Object.keys(validateAll(schema, { nama: '', kuota: '0' 
})).sort()).toEqual(['kuota', 'nama']); 
  }); 
 
  test('kolom tanpa aturan tidak menimbulkan galat', () => { 
    expect(validateField(schema, 'lain', { lain: '' })).toBe(''); 
  }); 
}); 