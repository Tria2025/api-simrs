import React from 'react'; 
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'; 
 
export function FormField({ label, error, style, ...inputProps }) { 
  return ( 
    <View style={styles.group}> 
      <Text style={styles.label}>{label}</Text> 
      <TextInput 
        accessibilityLabel={label} 
        style={[styles.input, error ? styles.inputError : null, style]} 
        {...inputProps} 
      /> 
      {error ? ( 
        <Text accessibilityRole="alert" style={styles.error}> 
          {error} 
        </Text> 
      ) : null} 
    </View> 
  ); 
} 

export function ChoiceField({ label, options, value, onChange, onBlur, error }) { 
  return ( 
    <View style={styles.group}> 
      <Text style={styles.label}>{label}</Text> 
      <View style={styles.chips}> 
        {options.map((opt) => { 
          const selected = opt === value; 
          return ( 
            <Pressable 
              key={opt} 
              accessibilityRole="radio" 
              accessibilityState={{ selected }} 
              onPress={() => { 
                onChange(opt); 
                if (onBlur) onBlur(); 
              }} 
              style={[styles.chip, selected ? styles.chipOn : null]} 
            > 
              <Text style={selected ? styles.chipTextOn : 
styles.chipText}>{opt}</Text> 
            </Pressable> 
          ); 
        })} 
      </View> 
      {error ? ( 
        <Text accessibilityRole="alert" style={styles.error}> 
          {error} 
        </Text> 
      ) : null} 
    </View> 
  ); 
} 
 
const styles = StyleSheet.create({ 
  group: { marginBottom: 16 }, 
  label: { fontWeight: '600', marginBottom: 6 }, 
  input: { borderWidth: 1, borderColor: '#9CA3AF', borderRadius: 8, 
paddingHorizontal: 12, minHeight: 48 }, 
  inputError: { borderColor: '#B91C1C' }, 
  error: { color: '#B91C1C', marginTop: 4 }, 
  chips: { flexDirection: 'row', flexWrap: 'wrap' }, 
  chip: { 
    minHeight: 48, justifyContent: 'center', paddingHorizontal: 14, marginRight: 8, 
marginBottom: 8, 
    borderWidth: 1, borderColor: '#9CA3AF', borderRadius: 24, 
  }, 
  chipOn: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' }, 
  chipText: { color: '#111827' }, 
  chipTextOn: { color: '#FFFFFF', fontWeight: '600' }, 
});