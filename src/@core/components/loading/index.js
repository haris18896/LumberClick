/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PropTypes from 'prop-types';

// ** Utils
import {theme as AppTheme} from '../../infrustructure/theme';

// ** Third Party Packages
import LottieView from 'lottie-react-native';

// ** Custom Components
import {appLottie} from '../../../assets';

const Loader = props => {
  const {height = 15, bg = AppTheme?.DefaultPalette()?.background?.paper} =
    props;
  return (
    <LottieView
      loop
      autoPlay
      style={{
        width: '100%',
        height: AppTheme.WP(height),
        backgroundColor: bg,
      }}
      speed={1.5}
      source={appLottie?.loading}
    />
  );
};

Loader.propTypes = {
  height: PropTypes.number,
};

export {Loader};
