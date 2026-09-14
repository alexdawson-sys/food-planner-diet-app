import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import { LineChart } from '../components/LineChart';
import { MetricPill } from '../components/MetricPill';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';
import { formatShortDate } from '../utils/nutrition';

export function ProgressScreen() {
  const { profile, weights, stats, achievements, addWeight } = useAppContext();
  const [range, setRange] = useState<'week' | 'month' | 'year'>('month');

  const points = useMemo(() => {
    const limit = range === 'week' ? 4 : range === 'month' ? 7 : weights.length;
    return weights.slice(-limit).map((entry) => ({ label: formatShortDate(entry.date), value: entry.value }));
  }, [range, weights]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionCard title="Weight trend" subtitle="Weekly, monthly, and yearly views">
        <SegmentedButtons
          value={range}
          onValueChange={(value) => setRange(value as typeof range)}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
        />
        <LineChart points={points} />
      </SectionCard>

      <View style={styles.grid}>
        <MetricPill label="Lost" value={`${stats.totalLost}${profile.units.weight}`} />
        <MetricPill label="/ Week" value={`${stats.averagePerWeek}${profile.units.weight}`} />
        <MetricPill label="Goal" value={`${Math.round(stats.goalProgress)}%`} />
      </View>

      <SectionCard title="Weight history & analytics" subtitle="Milestones, trends, and projections">
        <Text variant="bodyMedium">Projected goal date: {stats.projectedGoalDate ? stats.projectedGoalDate.toLocaleDateString() : 'Keep logging for projection'}</Text>
        <Text variant="bodyMedium" style={styles.copy}>Calorie, macro, and body-weight trends are aligned to support sustainable fat loss pacing.</Text>
        <Button mode="contained" icon="scale-bathroom" style={styles.button} onPress={() => addWeight(Number((profile.currentWeight - 0.2).toFixed(1)))}>
          Log today's weight
        </Button>
      </SectionCard>

      <SectionCard title="Achievements" subtitle="Consistency badges and weekly summary highlights">
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievement}>
            <Text variant="titleSmall">{achievement.earned ? '🏅' : '⬜'} {achievement.title}</Text>
            <Text variant="bodySmall">{achievement.description}</Text>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 96 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  copy: { marginTop: 8 },
  button: { marginTop: 16 },
  achievement: { marginBottom: 14, gap: 4 },
});
