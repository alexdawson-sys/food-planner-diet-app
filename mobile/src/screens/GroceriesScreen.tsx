import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Chip, Text } from 'react-native-paper';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';

export function GroceriesScreen() {
  const { shoppingList, toggleShoppingItem } = useAppContext();
  const grouped = shoppingList.reduce<Record<string, typeof shoppingList>>((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionCard title="Shopping list" subtitle="Auto-generated and manually editable grocery planning">
        <View style={styles.tags}>
          <Chip icon="cart-outline">Share list</Chip>
          <Chip icon="printer-outline">Print view</Chip>
          <Chip icon="cash-multiple">Estimated costs</Chip>
        </View>
        <Button mode="outlined" icon="plus" style={styles.addButton}>
          Add manual item
        </Button>
        {Object.entries(grouped).map(([category, items]) => (
          <View key={category} style={styles.category}>
            <Text variant="titleSmall">{category}</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.row}>
                <Checkbox status={item.checked ? 'checked' : 'unchecked'} onPress={() => toggleShoppingItem(item.id)} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium">{item.name}</Text>
                  <Text variant="bodySmall">{item.quantity} {item.unit} · ${item.estimatedCost.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 96 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  addButton: { marginBottom: 16 },
  category: { marginBottom: 16, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
