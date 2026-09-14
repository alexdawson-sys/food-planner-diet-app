import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, List, Switch, Text, TextInput } from 'react-native-paper';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';

export function SettingsScreen() {
  const { profile, updateTargets, updatePreference, toggleTheme, toggleUnits } = useAppContext();
  const [calories, setCalories] = useState(String(profile.targets.calories));
  const [protein, setProtein] = useState(String(profile.targets.protein));
  const [carbs, setCarbs] = useState(String(profile.targets.carbs));
  const [fat, setFat] = useState(String(profile.targets.fat));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionCard title="Targets & goals" subtitle="Adjust calorie and macro goals">
        <TextInput mode="outlined" label="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" style={styles.input} />
        <TextInput mode="outlined" label="Protein (g)" value={protein} onChangeText={setProtein} keyboardType="numeric" style={styles.input} />
        <TextInput mode="outlined" label="Carbs (g)" value={carbs} onChangeText={setCarbs} keyboardType="numeric" style={styles.input} />
        <TextInput mode="outlined" label="Fat (g)" value={fat} onChangeText={setFat} keyboardType="numeric" style={styles.input} />
        <Button
          mode="contained"
          onPress={() => updateTargets({
            ...profile.targets,
            calories: Number(calories),
            protein: Number(protein),
            carbs: Number(carbs),
            fat: Number(fat),
          })}
        >
          Save custom targets
        </Button>
      </SectionCard>

      <SectionCard title="Preferences" subtitle="Reminders, units, appearance, and backup">
        <List.Item title="Meal reminders" right={() => <Switch value={profile.reminderPreferences.meal} onValueChange={(value) => updatePreference('meal', value)} />} />
        <List.Item title="Weight reminders" right={() => <Switch value={profile.reminderPreferences.weight} onValueChange={(value) => updatePreference('weight', value)} />} />
        <List.Item title="Push notifications" right={() => <Switch value={profile.reminderPreferences.push} onValueChange={(value) => updatePreference('push', value)} />} />
        <View style={styles.actions}>
          <Button mode="contained-tonal" onPress={toggleTheme}>Toggle {profile.theme === 'light' ? 'dark' : 'light'} mode</Button>
          <Button mode="contained-tonal" onPress={toggleUnits}>Switch to {profile.units.weight === 'kg' ? 'lbs/in' : 'kg/cm'}</Button>
        </View>
        <View style={styles.actions}>
          <Button mode="outlined" icon="download">Backup data</Button>
          <Button mode="outlined" icon="upload">Restore data</Button>
        </View>
      </SectionCard>

      <SectionCard title="Mobile features" subtitle="Widgets, barcode scanning, and offline support">
        <Text variant="bodyMedium">Home widget surfaces today's calories and current weight snapshot for fast check-ins.</Text>
        <Text variant="bodyMedium" style={styles.feature}>Barcode scanning is prepared through the food search experience for rapid logging.</Text>
        <Text variant="bodyMedium">Offline mode keeps recent meal, weight, and shopping updates ready to sync when back online.</Text>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 96 },
  input: { marginBottom: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  feature: { marginVertical: 8 },
});
