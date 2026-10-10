import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'Selecciona una opción',
}: SelectProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>

      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
            opacity: pressed ? 0.7 : 1,
          },
        ]}>
        <Text
          numberOfLines={1}
          style={[
            styles.fieldText,
            { color: selected ? theme.text : theme.textSecondary },
          ]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}
            onPress={() => undefined}>
            <View
              style={[
                styles.sheetHeader,
                { borderBottomColor: theme.backgroundSelected },
              ]}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>{label}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={styles.list}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      { backgroundColor: pressed ? theme.backgroundSelected : 'transparent' },
                    ]}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.optionText,
                        { color: isSelected ? '#3c87f7' : theme.text },
                        isSelected && styles.optionTextSelected,
                      ]}>
                      {item.label}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={20} color="#3c87f7" />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  fieldText: {
    flex: 1,
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    borderRadius: Spacing.three,
    overflow: 'hidden',
    maxHeight: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.two,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '700',
  },
});