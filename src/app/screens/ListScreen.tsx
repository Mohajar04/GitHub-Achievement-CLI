import React from 'react';
import { Box, Text, useInput } from 'ink';
import { Header } from '../components/index.js';
import { colors, symbols, achievements, tierCounts, tierNames, type TierLevel } from '../theme.js';

interface ListScreenProps {
  hasHelper: boolean;
  hasDiscussions: boolean;
  onBack: () => void;
}

export const ListScreen: React.FC<ListScreenProps> = ({
  hasHelper,
  hasDiscussions,
  onBack,
}) => {
  useInput((input, key) => {
    if (key.escape || key.return) {
      onBack();
    }
  });

  return (
    <Box flexDirection="column">
      <Header title="Achievements" subtitle="Available achievements and tiers" />

      <Box flexDirection="column" marginY={1}>
        {Object.entries(achievements).map(([id, achievement]) => {
          const counts = tierCounts[id as keyof typeof tierCounts];
          const isAvailable =
            (!achievement.requiresHelper || hasHelper) &&
            (!achievement.requiresDiscussions || hasDiscussions);

          return (
            <Box key={id} flexDirection="column" marginBottom={1}>
              <Box>
                <Text color={isAvailable ? undefined : colors.muted}>
                  {achievement.icon} <Text bold>{achievement.name}</Text>
                </Text>
                {!isAvailable && (
                  <Text color={colors.warning}> (unavailable)</Text>
                )}
              </Box>

              <Box marginLeft={2}>
                <Text color={colors.muted} dimColor>
                  {achievement.description}
                </Text>
              </Box>

              <Box marginLeft={2}>
                {achievement.tiers.map((tier, index) => (
                  <Text key={tier} color={colors.muted}>
                    {index > 0 && ' · '}
                    {tierNames[tier]}: {counts[tier]}
                  </Text>
                ))}
              </Box>

              {achievement.requiresHelper && !hasHelper && (
                <Box marginLeft={2}>
                  <Text color={colors.warning} dimColor>
                    {symbols.warning} Requires helper account
                  </Text>
                </Box>
              )}

              {achievement.requiresDiscussions && !hasDiscussions && (
                <Box marginLeft={2}>
                  <Text color={colors.warning} dimColor>
                    {symbols.warning} Requires Discussions enabled
                  </Text>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      <Box marginTop={1}>
        <Text color={colors.muted} dimColor>
          Press Enter or Esc to go back
        </Text>
      </Box>
    </Box>
  );
};

export default ListScreen;
