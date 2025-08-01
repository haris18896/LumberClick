import {View, Text} from 'react-native';
import React from 'react';

// ** Utils
import {ellipsisText, hexToRgba} from '../../utils/utils';
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Packages
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {
  NotificationCardContainer,
  NotificationCardDetails,
  NotificationCardIcon,
  NotificationCardWrapper,
} from '../../styles/components/NotificaitonCard';
import {TextItem} from '../../styles/typography';
import {UnReadDot} from '../../styles/infrustucture';

const NotificationCard = props => {
  // ** Props
  const {title, description, icon, iconColor, read, onPress} = props;

  return (
    <NotificationCardWrapper onPress={onPress}>
      <NotificationCardContainer unread={!read}>
        <NotificationCardIcon IconBG={iconColor}>
          <Icon
            name={icon}
            size={AppTheme?.WP(7)}
            color={hexToRgba(iconColor, 1)}
          />
        </NotificationCardIcon>

        <NotificationCardDetails>
          <TextItem
            size={4}
            weight={'semiBold'}
            family={'PoppinsSemiBold'}
            style={{marginBottom: AppTheme?.WP(1)}}
            color={AppTheme?.DefaultPalette()?.grey[800]}>
            {title}
          </TextItem>

          <TextItem
            size={3.5}
            weight={'regular'}
            family={'PoppinsRegular'}
            color={AppTheme?.DefaultPalette()?.grey[600]}>
            {ellipsisText(description, 100)}
          </TextItem>
        </NotificationCardDetails>

        {!read && <UnReadDot />}
      </NotificationCardContainer>
    </NotificationCardWrapper>
  );
};
export {NotificationCard};
