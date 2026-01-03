import React from 'react';
import { Box, Text, useApp } from 'ink';
import { Header, Select, type SelectItem } from '../components/index.js';
import { colors, symbols } from '../theme.js';

export type MenuAction = 'run' | 'status' | 'list' | 'setup' | 'reset-history' | 'exit';

interface MenuScreenProps {
  username: string;
  targetRepo: string;
  hasHelper: boolean;
  onSelect: (action: MenuAction) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  username,
  targetRepo,
  hasHelper,
  onSelect,
}) => {
  const { exit } = useApp();

  const menuItems: SelectItem<MenuAction>[] = [
    {
      label: 'Run Achievements',
      value: 'run',
      description: 'Select and execute achievement automation',
    },
    {
      label: 'View Status',
      value: 'status',
      description: 'Check progress on current achievements',
    },
    {
      label: 'List Achievements',
      value: 'list',
      description: 'See all available achievements and tiers',
    },
    {
      label: 'Reconfigure',
      value: 'setup',
      description: 'Change settings and tokens',
    },
    {
      label: 'Reset Repo History',
      value: 'reset-history',
      description: 'Squash all commits into one clean commit',
    },
    {
      label: 'Exit',
      value: 'exit',
      description: 'Goodbye!',
    },
  ];

  const handleSelect = (item: SelectItem<MenuAction>) => {
    if (item.value === 'exit') {
      exit();
    } else {
      onSelect(item.value);
    }
  };

  return (
    <Box flexDirection="column">
      <Header />

      <Box marginBottom={1} flexDirection="column">
        <Box>
          <Text color={colors.muted}>Logged in as </Text>
          <Text color={colors.primary} bold>{username}</Text>
        </Box>
        <Box>
          <Text color={colors.muted}>Target: </Text>
          <Text>{targetRepo}</Text>
        </Box>
        {hasHelper && (
          <Box>
            <Text color={colors.success}>{symbols.success} </Text>
            <Text color={colors.muted}>Helper account configured (Galaxy Brain/YOLO ready)</Text>
          </Box>
        )}
      </Box>

      <Box marginTop={1}>
        <Select
          items={menuItems}
          onSelect={handleSelect}
          label="What would you like to do?"
        />
      </Box>

      <Box marginTop={2}>
        <Text color={colors.muted} dimColor>
          Use ↑↓ to navigate, Enter to select
        </Text>
      </Box>
    </Box>
  );
};

export default MenuScreen;
