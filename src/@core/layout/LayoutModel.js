import React from 'react';
import { View, StatusBar, StyleSheet, Platform } from 'react-native';

// ** Utils
import { navigateTo } from '../../navigation/utils';
import { theme as AppTheme } from '../infrustructure/theme';

// ** Third Party Packages
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ** Custom Components
import {
  SafeArea,
  LayoutArea,
  LayoutContainer,
} from '../../styles/infrustucture/index';

// ** Store && Actions
import { useDispatch } from 'react-redux';
import { Logout } from '../../redux/Auth';

const LayoutModel = ({
  children,
  background,
  MT = 5,
  customStyles = {},
  layoutBg = 'white',
  showLogout = false,
  containerStyles = {},
  bg,
}) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(Logout());
    navigateTo('AuthStack');
    await AsyncStorage.removeItem('token');
  };

  // Ensure MT is a valid number
  const marginTop = typeof MT === 'number' && !isNaN(MT) ? MT : 5;

  return (
    <LayoutArea bg={layoutBg}>
      <View style={styles.logoContainer}>
        {showLogout && (
          <View style={styles.logoutButton}>
            <IconButton
              icon="logout"
              size={AppTheme.WP(5)}
              onPress={handleLogout}
              iconColor={AppTheme.DefaultPalette().primary.contrastText}
            />
          </View>
        )}
      </View>
      <View style={[styles.layoutContainer(marginTop), customStyles]}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'white'}
          translucent={false}
          hidden={false}
        />
        {/* Only pass expected props to SafeArea and LayoutContainer */}
        <SafeArea background={background}>
          <LayoutContainer
            // Only pass marginTop if defined and a number
            marginTop={
              typeof containerStyles?.marginTop === 'number'
                ? containerStyles.marginTop
                : undefined
            }
            bg={bg}
          >
            {children}
          </LayoutContainer>
        </SafeArea>
      </View>
    </LayoutArea>
  );
};

export { LayoutModel };

const styles = StyleSheet.create({
  layoutContainer: MT => ({
    flexGrow: 1,
    marginTop: AppTheme?.WP(MT),
    position: 'relative',
  }),
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    position: 'absolute',
    right: AppTheme.WP(0.5),
    top: AppTheme.WP(2.5),
    zIndex: 100,
  },
});
