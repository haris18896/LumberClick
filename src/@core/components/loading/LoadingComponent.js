/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';

// ** Utils
import {theme as AppTheme} from '../../infrustructure/theme';

// ** Third Party Packages
import LottieView from 'lottie-react-native';

// ** Custom Components
import {appLottie} from '../../../assets';
import {LoadingWrapper} from '../../../styles/infrustucture';

const LoadingComponent = ({borders = {}, top = 0, height = 20}) => {
  return (
    <LoadingWrapper borders={borders} top={top}>
      <LottieView
        loop
        autoPlay
        style={{
          padding: 0,
          margin: 0,
          width: AppTheme.WP(height),
          height: AppTheme.WP(height),
          borderRadius: AppTheme?.WP(4),
          backgroundColor: AppTheme?.DefaultPalette()?.common?.white,
        }}
        speed={1.5}
        source={appLottie?.loadingGreen}
      />
    </LoadingWrapper>
  );
};
export default LoadingComponent;
