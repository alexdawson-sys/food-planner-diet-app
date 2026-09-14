import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export function SectionCard({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <Card style={styles.card} mode="contained">
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">{title}</Text>
          {subtitle ? <Text variant="bodySmall">{subtitle}</Text> : null}
        </View>
        {children}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, borderRadius: 24 },
  header: { marginBottom: 16, gap: 4 },
});
