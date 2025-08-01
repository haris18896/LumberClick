import React from 'react';
import {Image} from 'react-native';

// ** Utils
import {resizeMode} from '../../../../utils/constants';
import {theme as AppTheme} from '../../../infrustructure/theme';

// ** Third Party Packages
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {isObjEmpty} from '../../../../utils/utils';

const IconComponent = props => {
  // ** Props
  const {imageIcon, icon} = props;

  return (
    <>
      {!isObjEmpty(imageIcon) ? (
        <Image
          resizeMode={resizeMode}
          source={imageIcon?.uri}
          style={{
            width: AppTheme.WP(imageIcon?.width),
            height: AppTheme.WP(imageIcon?.height),
          }}
        />
      ) : (
        !isObjEmpty(icon) && (
          <Icon
            name={icon?.name}
            color={icon?.color}
            size={AppTheme.WP(icon?.size)}
          />
        )
      )}
    </>
  );
};

IconComponent.prototype = {
  imageIcon: PropTypes?.object,
  icon: PropTypes?.object,
};

export {IconComponent};
