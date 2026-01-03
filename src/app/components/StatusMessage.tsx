import React from 'react';
import { Box, Text } from 'ink';
import { colors, symbols } from '../theme.js';

type StatusType = 'success' | 'error' | 'warning' | 'info';

interface StatusMessageProps {
  type: StatusType;
  message: string;
  details?: string;
}

const statusConfig = {
  success: { symbol: symbols.success, color: colors.success },
  error: { symbol: symbols.error, color: colors.error },
  warning: { symbol: symbols.warning, color: colors.warning },
  info: { symbol: symbols.info, color: colors.info },
};

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  message,
  details,
}) => {
  const config = statusConfig[type];

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={config.color}>{config.symbol} </Text>
        <Text color={config.color}>{message}</Text>
      </Box>
      {details && (
        <Text color={colors.muted} dimColor>
          {'  '}{details}
        </Text>
      )}
    </Box>
  );
};

export default StatusMessage;
