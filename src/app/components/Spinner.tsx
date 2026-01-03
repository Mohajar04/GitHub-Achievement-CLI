import React from 'react';
import { Box, Text } from 'ink';
import InkSpinner from 'ink-spinner';
import { colors } from '../theme.js';

interface SpinnerProps {
  label?: string;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  label = 'Loading...',
  color = colors.primary
}) => {
  return (
    <Box>
      <Text color={color}>
        <InkSpinner type="dots" />
      </Text>
      <Text> {label}</Text>
    </Box>
  );
};

export default Spinner;
