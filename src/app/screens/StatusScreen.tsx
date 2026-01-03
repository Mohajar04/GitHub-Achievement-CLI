import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Header, ProgressBar } from '../components/index.js';
import { colors, symbols, achievements, tierNames } from '../theme.js';
import { initDatabase, closeDatabase, getAllAchievements } from '../../db/database.js';
import type { AchievementRecord } from '../../types/index.js';

interface StatusScreenProps {
  onBack: () => void;
}

export const StatusScreen: React.FC<StatusScreenProps> = ({ onBack }) => {
  const [records, setRecords] = useState<AchievementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDatabase();
    const data = getAllAchievements();
    setRecords(data);
    closeDatabase();
    setLoading(false);
  }, []);

  useInput((input, key) => {
    if (key.escape || key.return) {
      onBack();
    }
  });

  if (loading) {
    return (
      <Box flexDirection="column">
        <Header title="Status" />
        <Text color={colors.muted}>Loading...</Text>
      </Box>
    );
  }

  const inProgress = records.filter((r) => r.status === 'in_progress' || r.completedCount < r.targetCount);
  const completed = records.filter((r) => r.status === 'completed' && r.completedCount >= r.targetCount);

  return (
    <Box flexDirection="column">
      <Header title="Status" subtitle="Achievement Progress" />

      {records.length === 0 ? (
        <Box marginY={1}>
          <Text color={colors.muted}>
            No achievements started yet. Run some achievements to see progress here.
          </Text>
        </Box>
      ) : (
        <Box flexDirection="column" marginY={1}>
          {inProgress.length > 0 && (
            <Box flexDirection="column" marginBottom={1}>
              <Text bold color={colors.primary}>In Progress:</Text>
              {inProgress.map((record) => {
                const achievement = achievements[record.id as keyof typeof achievements];
                return (
                  <Box key={record.id} flexDirection="column" marginY={0.5}>
                    <Box>
                      <Text>
                        {achievement?.icon || '?'} {record.name}{' '}
                        <Text color={colors.muted}>({tierNames[record.tier as keyof typeof tierNames]})</Text>
                      </Text>
                    </Box>
                    <Box marginLeft={2}>
                      <ProgressBar
                        current={record.completedCount}
                        total={record.targetCount}
                        width={25}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {completed.length > 0 && (
            <Box flexDirection="column">
              <Text bold color={colors.success}>Completed:</Text>
              {completed.map((record) => {
                const achievement = achievements[record.id as keyof typeof achievements];
                return (
                  <Box key={record.id}>
                    <Text color={colors.success}>{symbols.success} </Text>
                    <Text>
                      {achievement?.icon || '?'} {record.name}{' '}
                      <Text color={colors.muted}>({tierNames[record.tier as keyof typeof tierNames]})</Text>
                    </Text>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      <Box marginTop={1}>
        <Text color={colors.muted} dimColor>
          Press Enter or Esc to go back
        </Text>
      </Box>
    </Box>
  );
};

export default StatusScreen;
