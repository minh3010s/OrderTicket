import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {HomeScreen} from './HomeScreen.js';
import {ScheduleScreen} from './ScheduleScreen.js';
import {PaymentScreen} from './PaymentScreen.js';
import LoginScreen from './LoginScreen.js';
import RegisterScreen from './RegisterScreen.js';
import ForgotPasswordScreen from './ForgotPasswordScreen.js';
const Stack = createStackNavigator();

export const AppNavigator = () =>  {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="schedule" component={ScheduleScreen} />
      <Stack.Screen name="payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}