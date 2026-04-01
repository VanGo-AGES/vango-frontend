import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View, NativeSyntheticEvent } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

interface InviteCodeDisplayProps {
  length?: number;
  editable?: boolean;
  code?: string;
  onComplete?: (code: string | undefined) => void;
}

export function InviteCodeDisplay({
  length = 5,
  editable = true,
  code = '',
  onComplete,
}: InviteCodeDisplayProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputsRef = useRef<(TextInput | null)[]>(Array(length).fill(null));

  // Efeito para carregar o código via parâmetro quando NÃO for editável
  useEffect(() => {
    if (!editable) {
      // Pega a string, joga pra maiúsculo e corta no limite do length
      const chars = code.toUpperCase().split('').slice(0, length);

      // Cria um array vazio e preenche com os caracteres do código
      const newValues = Array(length).fill('');
      chars.forEach((char, index) => {
        newValues[index] = char;
      });

      setValues(newValues);
    }
  }, [editable, code, length]);

  // Efeito para disparar o onComplete apenas quando for editável
  useEffect(() => {
    if (editable && onComplete) {
      if (values.every((v) => v.length === 1)) {
        onComplete(values.join(''));
      } else {
        onComplete(undefined);
      }
    }
  }, [values, editable, onComplete]);

  const handleChange = (text: string, idx: number) => {
    if (!editable) return; // Trava de segurança extra

    const char = text.replace(/[^0-9a-fA-F]/g, '').toUpperCase();

    const newValues = [...values];
    newValues[idx] = char;
    setValues(newValues);

    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
      setFocusedIndex(idx + 1);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<{ key: string }>, idx: number) => {
    if (!editable) return; // Trava de segurança extra

    if (e.nativeEvent.key === 'Backspace') {
      const newValues = [...values];

      if (values[idx]) {
        newValues[idx] = '';
        setValues(newValues);

        if (idx > 0) {
          inputsRef.current[idx - 1]?.focus();
          setFocusedIndex(idx - 1);
        }
      } else if (idx > 0) {
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
          style={[
            styles.input,
            // Só aplica o estilo de foco se for editável
            focusedIndex === idx && editable && styles.inputFocused,
            // Deixa o texto com um pouco de transparência se não for editável (opcional)
            !editable && styles.inputDisabled,
          ]}
          maxLength={1}
          editable={editable} // Prop nativa que bloqueia a edição
          onFocus={() => editable && setFocusedIndex(idx)}
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
  inputDisabled: {
    backgroundColor: colors.accent,
    color: colors.text,
    borderColor: colors.accent,
  },
});
