import React from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, symbols } from '../theme.js';

interface ConfirmProps {
  message: string;
  onConfirm: (confirmed: boolean) => void;
  defaultValue?: boolean;
}

export const Confirm: React.FC<ConfirmProps> = ({
  message,
  onConfirm,
  defaultValue = true,
}) => {
  useInput((input, key) => {
    if (input.toLowerCase() === 'y') {
      onConfirm(true);
    } else if (input.toLowerCase() === 'n') {
      onConfirm(false);
    } else if (key.return) {
      onConfirm(defaultValue);
    }
  });

  return (
    <Box>
      <Text color={colors.primary}>{symbols.arrowRight} </Text>
      <Text>{message} </Text>
      <Text color={colors.muted}>
        ({defaultValue ? 'Y/n' : 'y/N'})
      </Text>
    </Box>
  );
};

export default Confirm;
