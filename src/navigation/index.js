import React from 'react';

// ** Utils Styles
import {setTopLevelNavigator} from './utils';
import {theme as AppTheme} from '../@core/infrustructure/theme';

// ** navigators
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// ** Screens
import Splash from '../screens/Splash';
import AppStack from './Stacks/AppStack';
import AuthStack from './Stacks/AuthStack';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <NavigationContainer
      ref={setTopLevelNavigator}
      theme={{
        colors: {
          background: AppTheme.DefaultPalette().primary?.success,
        },
      }}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={'Splash'} component={Splash} />
        <Stack.Screen name="AppStack" component={AppStack} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MainStack;
