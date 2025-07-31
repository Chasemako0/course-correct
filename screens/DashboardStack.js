import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Dashboard from './Dashboard';
import CourseNotes from './Course';
import Planner from './Planner';
import Quiz from './Quiz';
import Todo from './Todo';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="CourseNotes" component={CourseNotes} />
      <Stack.Screen name="Planner" component={Planner} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="Todo" component={Todo} />
    </Stack.Navigator>
  );
}
