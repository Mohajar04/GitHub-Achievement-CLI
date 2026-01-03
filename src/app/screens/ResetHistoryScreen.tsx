import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Header, Confirm, Spinner, StatusMessage } from '../components/index.js';
import { colors } from '../theme.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

type ResetStep = 'confirm' | 'running' | 'success' | 'error';

interface ResetHistoryScreenProps {
  targetRepo: string;
  onBack: () => void;
}

export const ResetHistoryScreen: React.FC<ResetHistoryScreenProps> = ({
  targetRepo,
  onBack,
}) => {
  const [step, setStep] = useState<ResetStep>('confirm');
  const [error, setError] = useState<string | null>(null);
  const [currentOp, setCurrentOp] = useState('');

  const handleConfirm = async (confirmed: boolean) => {
    if (!confirmed) {
      onBack();
      return;
    }

    setStep('running');

    try {
      // Get the repo directory - we need to clone it or use the target repo
      // For now, we'll use the GitHub API approach via git commands
      const repoUrl = `https://github.com/${targetRepo}.git`;

      setCurrentOp('Creating orphan branch...');
      await execAsync('git checkout --orphan clean-slate', { cwd: process.cwd() });

      setCurrentOp('Staging all files...');
      await execAsync('git add -A', { cwd: process.cwd() });

      setCurrentOp('Creating clean commit...');
      await execAsync('git commit -m "Initial commit"', { cwd: process.cwd() });

      setCurrentOp('Removing old main branch...');
      try {
        await execAsync('git branch -D main', { cwd: process.cwd() });
      } catch {
        // Branch might not exist, that's okay
      }

      setCurrentOp('Renaming to main...');
      await execAsync('git branch -m main', { cwd: process.cwd() });

      setCurrentOp('Force pushing to remote...');
      await execAsync('git push -f origin main', { cwd: process.cwd() });

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStep('error');
    }
  };

  useInput((input, key) => {
    if ((step === 'success' || step === 'error') && (key.return || key.escape)) {
      onBack();
    }
  });

  return (
    <Box flexDirection="column">
      <Header title="Reset History" subtitle="Clean up commit history" />

      <Box flexDirection="column" marginY={1}>
        <Text color={colors.muted}>
          This will squash all commits into a single "Initial commit".
        </Text>
        <Text color={colors.muted}>
          Target: <Text color={colors.primary}>{targetRepo}</Text>
        </Text>
      </Box>

      {step === 'confirm' && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={colors.warning} bold>
            Warning: This will permanently delete all commit history!
          </Text>
          <Box marginTop={1}>
            <Confirm
              message="Are you sure you want to reset the repository history?"
              onConfirm={handleConfirm}
              defaultValue={false}
            />
          </Box>
        </Box>
      )}

      {step === 'running' && (
        <Box flexDirection="column" marginTop={1}>
          <Spinner label={currentOp} />
        </Box>
      )}

      {step === 'success' && (
        <Box flexDirection="column" marginTop={1}>
          <StatusMessage type="success" message="Repository history has been reset!" />
          <Text color={colors.muted}>All commits squashed into a single clean commit.</Text>
          <Box marginTop={1}>
            <Text color={colors.muted}>Press Enter to continue</Text>
          </Box>
        </Box>
      )}

      {step === 'error' && (
        <Box flexDirection="column" marginTop={1}>
          <StatusMessage type="error" message="Failed to reset history" />
          <Text color={colors.error}>{error}</Text>
          <Box marginTop={1}>
            <Text color={colors.muted}>Press Enter to go back</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ResetHistoryScreen;
