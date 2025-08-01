import React, { useContext, useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// ** Utils
import { theme as AppTheme } from '../../@core/infrustructure/theme';
import { getAllowedRoutes, permissions } from '../../@core/auth/acl';

// ** Custom Components
import SideMenu from './sideMenu';

// ** Screens
import { Jobs } from '../../screens/Jobs';
import Profile from '../../screens/Profile';
import { Chat, ChatHub } from '../../screens/Chat';
import { Dashboard } from '../../screens/Dashboard';
import { Notifications } from '../../screens/Notifications';
import { JobBidding } from '../../screens/Jobs/JobBidding';
import PaymentsScreen from '../../screens/Profile/PaymentsScreen.js';

// ** Context
import { useAuth } from '../../@core/infrustructure/context/AuthContext';
import JobNavigation from '../TopBar/JobNavigation.js';

const Drawer = createDrawerNavigator();

const routes = [
  {
    name: 'Dashboard',
    component: Dashboard,
    permission: permissions.CAN_VIEW_DASHBOARD_PAGE,
  },
  {
    name: 'Jobs',
    component: Jobs,
    permission: permissions.CAN_VIEW_JOBS_PAGE,
  },
  {
    name: 'Profile',
    component: Profile,
    permission: permissions.CAN_VIEW_PROFILE_PAGE,
  },
  {
    name: 'Notifications',
    component: Notifications,
    permission: permissions.CAN_VIEW_NOTIFICATION_PAGE,
  },
  {
    name: 'ChatHub',
    component: ChatHub,
    permission: permissions.CAN_VIEW_CHAT_HUB_PAGE,
  },
  {
    name: 'JobBidding',
    component: JobBidding,
    permission: permissions.CAN_VIEW_JOB_BIDDING_PAGE,
  },
  {
    name: 'Chat',
    component: Chat,
    permission: permissions.CAN_VIEW_CHAT_PAGE,
  },
];

export function MyDrawer() {
  const { role, isLoading, isAuthenticated } = useAuth();

  console.log('role in drawer:', role);
  console.log('isAuthenticated:', isAuthenticated);

  // Show loading or fallback while auth is initializing
  if (isLoading) {
    // You can return a loading component here if needed
    return null;
  }

  const allowedRoutes = getAllowedRoutes(role || 'customer', routes);

  return (
    <Drawer.Navigator
      backBehavior={'history'}
      // initialRouteName={'Dashboard'}
      initialRouteName={'Jobs'}
      drawerContent={props => <SideMenu role={role} {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#0D1306',
          paddingVertical: AppTheme?.WP(5),
          width: AppTheme?.scrWidth / 1.3,
        },
      }}
    >
      <Drawer.Screen name={'Jobs'} component={Jobs} />
      <Drawer.Screen name={'Dashboard'} component={Dashboard} />
      <Drawer.Screen name={'Profile'} component={Profile} />
      <Drawer.Screen name={'PaymentsScreen'} component={PaymentsScreen} />
      <Drawer.Screen name={'Notifications'} component={Notifications} />
      <Drawer.Screen name={'ChatHub'} component={ChatHub} />
      <Drawer.Screen name={'JobBidding'} component={JobBidding} />
      <Drawer.Screen name={'Chat'} component={Chat} />
      <Drawer.Screen name={'JobNavigation'} component={JobNavigation} />

      {/*{routes.map((route, index) => (*/}
      {/*  <Drawer.Screen*/}
      {/*    key={index}*/}
      {/*    name={route.name}*/}
      {/*    component={route?.component}*/}
      {/*  />*/}
      {/*))}*/}
    </Drawer.Navigator>
  );
}
