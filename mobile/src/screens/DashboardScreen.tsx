import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Badge, Chip, Text } from 'react-native-paper';
import { MacroProgress } from '../components/MacroProgress';
import { MetricPill } from '../components/MetricPill';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';

export function DashboardScreen() {
  const { profile, foods, daily } = useAppContext();
  const remainingCalories = Math.max(0, profile.targets.calories - daily.calories);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionCard title={`Welcome back, ${profile.name.split(' ')[0]}`} subtitle="Weight-loss assistant dashboard">
        <View style={styles.hero}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text variant="headlineMedium">{Math.round(daily.calories)} / {profile.targets.calories} kcal</Text>
            <Text variant="bodyMedium">{remainingCalories} calories remaining with balanced macro pacing.</Text>
          </View>
          <Avatar.Text size={58} label={`${profile.currentWeight}`} />
        </View>
        <View style={styles.badges}>
          <Badge size={28}>Live</Badge>
          <Chip icon="bell-ring-outline">Meal reminders on</Chip>
          <Chip icon="cloud-check-outline">Offline sync ready</Chip>
        </View>
      </SectionCard>

      <View style={styles.grid}>
        <MetricPill label="Current" value={`${profile.currentWeight}${profile.units.weight}`} />
        <MetricPill label="Goal" value={`${profile.goalWeight}${profile.units.weight}`} />
        <MetricPill label="Protein" value={`${profile.targets.protein}g`} />
      </View>

      <SectionCard title="Profile & onboarding" subtitle="Your weight-loss profile and automatic calorie setup">
        <Text variant="bodyMedium">{profile.email}</Text>
        <Text variant="bodyMedium">Age {profile.age} · {profile.height}{profile.units.height} · {profile.activityLevel} activity</Text>
        <Text variant="bodySmall">Daily targets are automatically calculated from your profile and can be customized anytime.</Text>
      </SectionCard>

      <SectionCard title="Macros & progress" subtitle="Real-time intake against your daily targets">
        <MacroProgress label="Protein" value={daily.protein} target={profile.targets.protein} accent="#0891b2" />
        <MacroProgress label="Carbs" value={daily.carbs} target={profile.targets.carbs} accent="#2563eb" />
        <MacroProgress label="Fats" value={daily.fat} target={profile.targets.fat} accent="#0f766e" />
        <Text variant="bodySmall">Micronutrient support: fiber-rich meals and whole-food variety are highlighted throughout the planner.</Text>
      </SectionCard>

      <SectionCard title="Favorites & quick add" subtitle="Fast logging for the foods you use most">
        <View style={styles.badges}>
          {foods.filter((food) => food.favorite).map((food) => (
            <Chip key={food.id} icon="star-circle-outline">{food.name}</Chip>
          ))}
        </View>
        <View style={styles.badges}>
          <Chip icon="barcode-scan">Barcode scan ready</Chip>
          <Chip icon="widgets-outline">Home widget snapshot</Chip>
          <Chip icon="heart-pulse">Goal-aware suggestions</Chip>
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 96 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
});
