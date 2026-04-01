import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View, NativeSyntheticEvent } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

interface InviteCodeDisplayProps {
  length?: number;
  onComplete: (code: string | undefined) => void;
}

export function InviteCodeDisplay({ length = 5, onComplete }: InviteCodeDisplayProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputsRef = useRef<(TextInput | null)[]>(Array(length).fill(null));

  useEffect(() => {
    if (values.every((v) => v.length === 1)) {
      onComplete(values.join(''));
    } else {
      onComplete(undefined);
    }
  }, [values, onComplete]);

  const handleChange = (text: string, idx: number) => {
    // Filtro atualizado: aceita apenas números (0-9) e letras de A até F (hexadecimal)
    const char = text.replace(/[^0-9a-fA-F]/g, '').toUpperCase();

    const newValues = [...values];
    newValues[idx] = char;
    setValues(newValues);

    // Se digitou um caractere válido, avança para o próximo
    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
      setFocusedIndex(idx + 1);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<{ key: string }>, idx: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newValues = [...values];

      if (values[idx]) {
        // Se o campo atual tem valor, apaga ele...
        newValues[idx] = '';
        setValues(newValues);

        // ...e já volta o foco para o anterior (se não for o primeiro quadradinho)
        if (idx > 0) {
          inputsRef.current[idx - 1]?.focus();
          setFocusedIndex(idx - 1);
        }
      } else if (idx > 0) {
        // Se o campo atual já estava vazio, volta o foco para o anterior e apaga o valor dele
        inputsRef.current[idx - 1]?.focus();
        setFocusedIndex(idx - 1);
        newValues[idx - 1] = '';
        setValues(newValues);
      }
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, idx) => (
        <TextInput
          key={idx}
          ref={(ref) => {
            inputsRef.current[idx] = ref;
          }}
          value={values[idx]}
          style={[styles.input, focusedIndex === idx && styles.inputFocused]}
          maxLength={1}
          onFocus={() => setFocusedIndex(idx)}
          onChangeText={(text) => handleChange(text, idx)}
          onKeyPress={(e) => handleKeyPress(e, idx)}
          keyboardType="default"
          autoCapitalize="characters"
          autoCorrect={false}
          textAlign="center"
          returnKeyType="next"
          cursorColor={colors.dark}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  input: {
    ...typography.header3,
    width: 60,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.light,
    borderColor: colors.subtleText,
    color: colors.dark,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputFocused: {
    borderColor: colors.dark,
    borderWidth: 2,
  },
});
