import React from 'react';
import { Box, Text } from 'ink';
import { Header, Select, type SelectItem } from '../components/index.js';
import { LANGUAGES, setLanguage, type Language } from '../../i18n/index.js';
import { colors } from '../theme.js';

interface LanguageScreenProps {
  onSelect: (lang: Language) => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({ onSelect }) => {
  const items: SelectItem<Language>[] = LANGUAGES.map(lang => ({
    label: `${lang.flag} ${lang.name}`,
    value: lang.code,
  }));

  const handleSelect = (item: SelectItem<Language>) => {
    setLanguage(item.value);
    onSelect(item.value);
  };

  return (
    <Box flexDirection="column">
      <Header title="GitHub Achievement CLI" />

      <Box marginY={1}>
        <Text color={colors.muted}>Select your language / Wählen Sie Ihre Sprache / Выберите язык</Text>
      </Box>

      <Select
        items={items}
        onSelect={handleSelect}
        label="Language"
      />

      <Box marginTop={2}>
        <Text color={colors.muted} dimColor>
          Use ↑↓ to navigate, Enter to select
        </Text>
      </Box>
    </Box>
  );
};

export default LanguageScreen;
