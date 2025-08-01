import React from 'react';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Packages
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {BackButtonContainer} from '../../styles/components';

const BackButton = props => {
  const {bg, icon, iconColor, size, onPress, customStyles} = props;

  return (
    <BackButtonContainer style={customStyles} bg={bg} onPress={onPress}>
      <Icon name={icon} color={iconColor} size={AppTheme?.WP(size)} />
    </BackButtonContainer>
  );
};

BackButton.prototype = {
  bg: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes?.number,
  onPress: PropTypes.func,
  customStyles: PropTypes.object,
};

export {BackButton};
