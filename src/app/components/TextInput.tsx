import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import InkTextInput from 'ink-text-input';
import { colors, symbols } from '../theme.js';

interface TextInputProps {
  label: string;
  placeholder?: string;
  mask?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  error?: string;
  hint?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  mask,
  value,
  onChange,
  onSubmit,
  error,
  hint,
}) => {
  return (
    <Box flexDirection="column">
      <Box>
        <Text color={colors.primary}>{symbols.arrowRight} </Text>
        <Text>{label}: </Text>
        <InkTextInput
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={placeholder}
          mask={mask}
        />
      </Box>
      {hint && !error && (
        <Text color={colors.muted} dimColor>
          {'  '}{hint}
        </Text>
      )}
      {error && (
        <Text color={colors.error}>
          {'  '}{symbols.error} {error}
        </Text>
      )}
    </Box>
  );
};

export default TextInput;
