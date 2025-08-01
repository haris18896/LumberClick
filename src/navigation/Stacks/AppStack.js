import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {MyDrawer} from '../drawer/DrawerNavigation';

// ** Screens
const Stack = createStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName={'Drawer'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Drawer'} component={MyDrawer} />
    </Stack.Navigator>
  );
}

export default AppStack;
