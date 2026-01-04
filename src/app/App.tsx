import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import {
  LanguageScreen,
  SetupScreen,
  MenuScreen,
  SelectScreen,
  ExecuteScreen,
  StatusScreen,
  ListScreen,
  ResetHistoryScreen,
  type MenuAction,
  type SelectedAchievement,
} from './screens/index.js';
import { Spinner } from './components/index.js';
import { colors } from './theme.js';
import { envFileExists, loadConfig, clearConfigCache, getSavedLanguage, saveLanguage } from '../utils/config.js';
import { setLanguage, type Language } from '../i18n/index.js';
import { initGitHubClient, initHelperClient } from '../github/client.js';
import { quickValidateToken } from '../github/auth.js';
import { areDiscussionsEnabled } from '../github/discussion.js';
import { setDatabaseUser } from '../db/database.js';
import type { AppConfig, ExecutionResult } from '../types/index.js';

type Screen = 'loading' | 'language' | 'setup' | 'menu' | 'select' | 'execute' | 'status' | 'list' | 'reset-history';

export const App: React.FC = () => {
  const { exit } = useApp();

  const [screen, setScreen] = useState<Screen>('loading');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [username, setUsername] = useState('');
  const [hasHelper, setHasHelper] = useState(false);
  const [hasDiscussions, setHasDiscussions] = useState(false);
  const [selections, setSelections] = useState<SelectedAchievement[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initial load - check for language and setup
  useEffect(() => {
    const init = async () => {
      try {
        // Check for saved language first
        const savedLang = getSavedLanguage();
        if (!savedLang) {
          setScreen('language');
          return;
        }
        setLanguage(savedLang as Language);

        if (!envFileExists()) {
          setScreen('setup');
          return;
        }

        // Load existing config
        const existingConfig = loadConfig();
        setConfig(existingConfig);

        // Initialize client
        initGitHubClient(existingConfig);

        // Initialize helper if configured
        if (existingConfig.helperToken) {
          initHelperClient(existingConfig.helperToken);
          setHasHelper(true);
        }

        // Validate and get username
        const user = await quickValidateToken(existingConfig.githubToken);
        setUsername(user.login);
        setDatabaseUser(user.login);

        // Check discussions
        const [owner, repo] = existingConfig.targetRepo.split('/');
        const discussions = await areDiscussionsEnabled(owner, repo);
        setHasDiscussions(discussions);

        setScreen('menu');
      } catch (err) {
        // Config is invalid, go to setup
        clearConfigCache();
        setScreen('setup');
      }
    };

    init();
  }, []);

  // Handle language selection
  const handleLanguageSelect = (lang: Language) => {
    saveLanguage(lang);
    setLanguage(lang);

    // Continue to setup or menu
    if (!envFileExists()) {
      setScreen('setup');
    } else {
      // Re-init with language set
      setScreen('loading');
      setTimeout(() => {
        const init = async () => {
          try {
            const existingConfig = loadConfig();
            setConfig(existingConfig);
            initGitHubClient(existingConfig);

            if (existingConfig.helperToken) {
              initHelperClient(existingConfig.helperToken);
              setHasHelper(true);
            }

            const user = await quickValidateToken(existingConfig.githubToken);
            setUsername(user.login);
            setDatabaseUser(user.login);

            const [owner, repo] = existingConfig.targetRepo.split('/');
            const discussions = await areDiscussionsEnabled(owner, repo);
            setHasDiscussions(discussions);

            setScreen('menu');
          } catch {
            clearConfigCache();
            setScreen('setup');
          }
        };
        init();
      }, 100);
    }
  };

  // Handle setup completion
  const handleSetupComplete = async (newConfig: AppConfig) => {
    setConfig(newConfig);

    // Initialize clients
    initGitHubClient(newConfig);

    if (newConfig.helperToken) {
      initHelperClient(newConfig.helperToken);
      setHasHelper(true);
    }

    // Get username
    const user = await quickValidateToken(newConfig.githubToken);
    setUsername(user.login);
    setDatabaseUser(user.login);

    // Check discussions
    const [owner, repo] = newConfig.targetRepo.split('/');
    const discussions = await areDiscussionsEnabled(owner, repo);
    setHasDiscussions(discussions);

    setScreen('menu');
  };

  // Handle menu selection
  const handleMenuSelect = (action: MenuAction) => {
    switch (action) {
      case 'run':
        setScreen('select');
        break;
      case 'status':
        setScreen('status');
        break;
      case 'list':
        setScreen('list');
        break;
      case 'setup':
        clearConfigCache();
        setScreen('setup');
        break;
      case 'reset-history':
        setScreen('reset-history');
        break;
      case 'exit':
        exit();
        break;
    }
  };

  // Handle achievement selection
  const handleSelectConfirm = (selected: SelectedAchievement[]) => {
    setSelections(selected);
    setScreen('execute');
  };

  // Handle execution complete
  const handleExecuteComplete = (results: ExecutionResult[]) => {
    setScreen('menu');
  };

  // Render current screen
  return (
    <Box flexDirection="column" padding={1}>
      {screen === 'loading' && (
        <Spinner label="Loading..." />
      )}

      {screen === 'language' && (
        <LanguageScreen onSelect={handleLanguageSelect} />
      )}

      {screen === 'setup' && (
        <SetupScreen onComplete={handleSetupComplete} />
      )}

      {screen === 'menu' && config && (
        <MenuScreen
          username={username}
          targetRepo={config.targetRepo}
          hasHelper={hasHelper}
          onSelect={handleMenuSelect}
        />
      )}

      {screen === 'select' && (
        <SelectScreen
          hasHelper={hasHelper}
          hasDiscussions={hasDiscussions}
          onConfirm={handleSelectConfirm}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'execute' && config && (
        <ExecuteScreen
          config={config}
          selections={selections}
          onComplete={handleExecuteComplete}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'status' && (
        <StatusScreen onBack={() => setScreen('menu')} />
      )}

      {screen === 'list' && (
        <ListScreen
          hasHelper={hasHelper}
          hasDiscussions={hasDiscussions}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'reset-history' && config && (
        <ResetHistoryScreen
          targetRepo={config.targetRepo}
          onBack={() => setScreen('menu')}
        />
      )}

      {error && (
        <Box marginTop={1}>
          <Text color={colors.error}>{error}</Text>
        </Box>
      )}
    </Box>
  );
};

export default App;
