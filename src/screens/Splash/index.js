import {ActivityIndicator, StatusBar} from 'react-native';
import React, {Fragment, useEffect} from 'react';

// ** Utils
import {navigateTo} from '../../navigation/utils';
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Packages
import AsyncStorage from '@react-native-async-storage/async-storage';

// ** Custom Components
import {ImageWrapper, SplashLayout} from '../../styles/screens';

const Splash = () => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('token');
        const initialRouteName = isLoggedIn ? 'AppStack' : 'AuthStack';
        navigateTo(initialRouteName);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      <SplashLayout>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={AppTheme?.DefaultPalette()?.primary?.main}
          translucent={false}
          hidden={false}
        />
        <ImageWrapper>
          {/*<LogoComponent*/}
          {/*  height={30}*/}
          {/*  width={30}*/}
          {/*  margin={{*/}
          {/*    top: 2,*/}
          {/*    bottom: 3,*/}
          {/*  }}*/}
          {/*/>*/}
          {/*<TextItem*/}
          {/*  style={{marginBottom: AppTheme?.WP(2)}}*/}
          {/*  size={5}*/}
          {/*  color={'white'}*/}
          {/*  weight={'bold'}>*/}
          {/*  LUMBER CLICK*/}
          {/*</TextItem>*/}
          <ActivityIndicator color={'white'} size={'large'} />
        </ImageWrapper>
      </SplashLayout>
    </Fragment>
  );
};
export default Splash;
