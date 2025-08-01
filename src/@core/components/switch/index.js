import React from 'react';
import {Switch as RNSwitch} from 'react-native';

// ** Third Party Packages
import PropTypes from 'prop-types';

// ** Utils
import {theme as AppTheme} from '../../infrustructure/theme';

const Switch = ({value, onValueChange, color, thumbColor}) => {
  return (
    <RNSwitch
      trackColor={{
        false: '#767577',
        true: color,
      }}
      thumbColor={thumbColor}
      ios_backgroundColor={AppTheme?.DefaultPalette()?.grey[100]}
      onValueChange={onValueChange}
      value={value}
    />
  );
};

Switch.propTypes = {
  value: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
  color: PropTypes.string,
  thumbColor: PropTypes.string,
};

export {Switch};
