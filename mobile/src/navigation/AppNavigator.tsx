import { useMemo, useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { DashboardScreen } from '../screens/DashboardScreen';
import { GroceriesScreen } from '../screens/GroceriesScreen';
import { PlannerScreen } from '../screens/PlannerScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export function AppNavigator() {
  const [index, setIndex] = useState(0);
  const routes = useMemo(
    () => [
      { key: 'dashboard', title: 'Home', focusedIcon: 'view-dashboard-outline' },
      { key: 'planner', title: 'Planner', focusedIcon: 'silverware-fork-knife' },
      { key: 'progress', title: 'Progress', focusedIcon: 'chart-line' },
      { key: 'groceries', title: 'Shop', focusedIcon: 'cart-outline' },
      { key: 'settings', title: 'Settings', focusedIcon: 'cog-outline' },
    ],
    [],
  );

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardScreen,
    planner: PlannerScreen,
    progress: ProgressScreen,
    groceries: GroceriesScreen,
    settings: SettingsScreen,
  });

  return <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />;
}
