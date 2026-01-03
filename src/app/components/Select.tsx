import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { colors, symbols } from '../theme.js';

export interface SelectItem<T = string> {
  label: string;
  value: T;
  description?: string;
  color?: string;
}

interface SelectProps<T = string> {
  items: SelectItem<T>[];
  onSelect: (item: SelectItem<T>) => void;
  label?: string;
}

export function Select<T = string>({
  items,
  onSelect,
  label,
}: SelectProps<T>): React.ReactElement {
  return (
    <Box flexDirection="column">
      {label && (
        <Text color={colors.muted} dimColor>
          {label}
        </Text>
      )}
      <SelectInput
        items={items}
        onSelect={onSelect}
        indicatorComponent={({ isSelected }) => (
          <Text color={colors.primary}>
            {isSelected ? symbols.arrowRight : ' '}{' '}
          </Text>
        )}
        itemComponent={({ isSelected, label }) => {
          const item = items.find(i => i.label === label);
          const itemColor = item?.color;
          return (
            <Text color={isSelected ? colors.primary : itemColor} bold={isSelected}>
              {label}
            </Text>
          );
        }}
      />
    </Box>
  );
}

export default Select;
