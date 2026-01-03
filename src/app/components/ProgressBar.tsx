import React from 'react';
import { Box, Text } from 'ink';
import { colors, symbols } from '../theme.js';

interface ProgressBarProps {
  current: number;
  total: number;
  width?: number;
  showPercentage?: boolean;
  showCount?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  width = 20,
  showPercentage = true,
  showCount = true,
  color = colors.primary,
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const filled = Math.round((current / total) * width);
  const empty = width - filled;

  const bar = symbols.progress.filled.repeat(filled) + symbols.progress.empty.repeat(empty);

  return (
    <Box>
      <Text color={color}>{bar}</Text>
      {showPercentage && (
        <Text color={colors.muted}> {percentage.toString().padStart(3)}%</Text>
      )}
      {showCount && (
        <Text color={colors.muted}> ({current}/{total})</Text>
      )}
    </Box>
  );
};

export default ProgressBar;
