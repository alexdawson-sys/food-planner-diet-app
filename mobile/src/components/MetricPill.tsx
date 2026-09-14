import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <Surface style={styles.surface} elevation={1}>
      <Text variant="labelMedium">{label}</Text>
      <Text variant="headlineSmall">{value}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 20,
    gap: 6,
  },
});
