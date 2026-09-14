import { StyleSheet, View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

export function MacroProgress({ label, value, target, accent }: { label: string; value: number; target: number; accent: string }) {
  const progress = Math.min(1, value / Math.max(1, target));
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="bodyMedium">{label}</Text>
        <Text variant="bodyMedium">{Math.round(value)}g / {target}g</Text>
      </View>
      <ProgressBar progress={progress} color={accent} style={styles.bar} />
      <Text variant="bodySmall">{Math.round(progress * 100)}% of target</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  bar: { height: 10, borderRadius: 999 },
});
