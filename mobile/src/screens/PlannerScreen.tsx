import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Divider, Searchbar, SegmentedButtons, Text } from 'react-native-paper';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';
import { MealType } from '../types';
import { formatShortDate } from '../utils/nutrition';

const presets = ['Balanced', 'Low-carb', 'High-protein', 'Keto'];

export function PlannerScreen() {
  const { foods, weeklyPlan, meals, quickAddMeal, addCustomFood, shoppingList } = useAppContext();
  const [query, setQuery] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');

  const filteredFoods = useMemo(
    () => foods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase())),
    [foods, query],
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionCard title="Daily meal planner" subtitle="Search foods, add meals, and build your day quickly">
        <Searchbar placeholder="Search foods, calories, macros" value={query} onChangeText={setQuery} />
        <SegmentedButtons
          value={mealType}
          onValueChange={(value) => setMealType(value as MealType)}
          buttons={[
            { value: 'breakfast', label: 'Breakfast' },
            { value: 'lunch', label: 'Lunch' },
            { value: 'dinner', label: 'Dinner' },
            { value: 'snack', label: 'Snack' },
          ]}
          style={styles.segment}
        />
        <View style={styles.stack}>
          {filteredFoods.slice(0, 5).map((food) => (
            <View key={food.id} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall">{food.name}</Text>
                <Text variant="bodySmall">{food.calories} kcal · P{food.protein} C{food.carbs} F{food.fat}</Text>
              </View>
              <Button mode="contained-tonal" onPress={() => quickAddMeal(food, mealType)}>Add</Button>
            </View>
          ))}
        </View>
        <Button mode="outlined" icon="plus" onPress={() => addCustomFood(query)} disabled={!query.trim()}>
          Add custom food
        </Button>
      </SectionCard>

      <SectionCard title="Today's meals" subtitle="Breakfast, lunch, dinner, and snacks">
        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type, index) => {
          const typeMeals = meals.filter((meal) => meal.type === type);
          return (
            <View key={type}>
              <Text variant="titleSmall" style={styles.heading}>{type.toUpperCase()}</Text>
              {typeMeals.map((meal) => (
                <Text key={meal.id} variant="bodyMedium">• {meal.foods.map((food) => food.name).join(', ')}</Text>
              ))}
              {index < 3 ? <Divider style={styles.divider} /> : null}
            </View>
          );
        })}
      </SectionCard>

      <SectionCard title="Weekly planning" subtitle="Templates, presets, and copy-forward meal planning">
        <View style={styles.chips}>
          {presets.map((preset) => (
            <Chip key={preset} icon="calendar-star">{preset}</Chip>
          ))}
          <Chip icon="content-copy">Copy previous week</Chip>
          <Chip icon="clipboard-list-outline">Meal templates</Chip>
        </View>
        {weeklyPlan.slice(0, 4).map((day) => (
          <View key={day.date} style={styles.planDay}>
            <Text variant="titleSmall">{formatShortDate(day.date)}</Text>
            <Text variant="bodySmall">Breakfast: {day.meals.breakfast[0]?.name}</Text>
            <Text variant="bodySmall">Lunch: {day.meals.lunch[0]?.name}</Text>
            <Text variant="bodySmall">Dinner: {day.meals.dinner[0]?.name}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Recipe library" subtitle="Saved recipes, favorites, and recently used combinations">
        <View style={styles.chips}>
          <Chip icon="book-open-page-variant-outline">Favorite recipes</Chip>
          <Chip icon="history">Recently added foods</Chip>
          <Chip icon="food-turkey">Meal prep recipes</Chip>
        </View>
        <Text variant="bodySmall">Create recipes from ingredients with portion-aware macro totals and reuse them in your weekly plan.</Text>
      </SectionCard>

      <SectionCard title="Shopping preview" subtitle="Auto-generated from this week's plan">
        <Text variant="bodyMedium">{shoppingList.length} items planned with estimated total cost of ${shoppingList.reduce((sum, item) => sum + item.estimatedCost, 0).toFixed(2)}.</Text>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 96 },
  segment: { marginTop: 16, marginBottom: 16 },
  stack: { gap: 14, marginBottom: 16 },
  listRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  heading: { marginBottom: 8 },
  divider: { marginVertical: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  planDay: { marginBottom: 14 },
});
