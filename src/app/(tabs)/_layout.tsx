import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  focused,
  color,
  size,
}: {
  focused: boolean;
  color: ColorValue;
  size: number;
}) {
  const name: IconName = focused ? 'ticket' : 'ticket-outline';
  return <Ionicons name={name} color={color} size={size} />;
}

function AddIcon({
  focused,
  color,
  size,
}: {
  focused: boolean;
  color: ColorValue;
  size: number;
}) {
  const name: IconName = focused ? 'add-circle' : 'add-circle-outline';
  return <Ionicons name={name} color={color} size={size} />;
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3c87f7',
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.backgroundElement },
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleAlign: 'center',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tickets',
          tabBarIcon: TabIcon,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Nuevo',
          tabBarIcon: AddIcon,
        }}
      />
    </Tabs>
  );
}