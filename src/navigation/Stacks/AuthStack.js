import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
} from '../../screens/Auth';

// ** Screens

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Login'}>
      <Stack.Screen name={'Login'} component={Login} />
      <Stack.Screen name={'Register'} component={Register} />
      <Stack.Screen name={'ForgotPassword'} component={ForgotPassword} />
      <Stack.Screen name={'ResetPassword'} component={ResetPassword} />
    </Stack.Navigator>
  );
};
export default AuthStack;
