import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color={colors.primary} bold>
          ⚡ GitHub Achievements Manager
        </Text>
        {title && (
          <Text color={colors.muted}> › {title}</Text>
        )}
      </Box>
      {subtitle && (
        <Text color={colors.muted}>{subtitle}</Text>
      )}
      <Text color={colors.muted}>{'─'.repeat(50)}</Text>
    </Box>
  );
};

export default Header;
