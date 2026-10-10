import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LoadingSpinnerProps = {
  message?: string;
  style?: StyleProp<ViewStyle>;
};

export function LoadingSpinner({ message, style }: LoadingSpinnerProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color="#3c87f7" />
      {message ? (
        <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
  },
});