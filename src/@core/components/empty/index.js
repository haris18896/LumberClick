/* eslint-disable react-native/no-inline-styles */
import React from 'react';

// ** Utils
import {theme as AppTheme} from '../../infrustructure/theme';

// ** Third Party Packages
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

// ** Custom Components
import {appLottie} from '../../../assets';
import {EmptyText, EmptyWrapper} from '../../../styles/components';

const Empty = ({
  title,
  customStyles = {},
  height = 25,
  lottie = appLottie?.dataNotFound,
}) => {
  return (
    <EmptyWrapper>
      <LottieView
        loop
        autoPlay
        style={{
          width: '100%',
          height: AppTheme.WP(height),
        }}
        speed={1.5}
        source={lottie}
      />
      <EmptyText fontSize={customStyles?.fontSize}>{title}</EmptyText>
    </EmptyWrapper>
  );
};

Empty.propTypes = {
  title: PropTypes.string,
  customStyles: PropTypes.object,
  height: PropTypes.number,
  lottie: PropTypes.object,
};

export {Empty};
