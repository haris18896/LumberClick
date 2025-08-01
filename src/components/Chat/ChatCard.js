import React from 'react';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Packages
import PropTypes from 'prop-types';

// ** Custom Components
import {
  ChatCardContainer,
  ChatCardDetails,
  ChatCardWrapper,
} from '../../styles/components/ChatCard';
import {Avatar} from '../Avatar/Avatar';
import {TextItem} from '../../styles/typography';
import {UnReadDot} from '../../styles/infrustucture';

const ChatCard = ({read, image, name, recent, onPress, time}) => {
  return (
    <ChatCardWrapper onPress={onPress}>
      <ChatCardContainer unread={!read}>
        <Avatar size={6.2} avatarSize={13} image={image} name={name} />

        <ChatCardDetails>
          <TextItem
            size={4}
            weight={'semiBold'}
            family={'PoppinsSemiBold'}
            style={{marginBottom: AppTheme?.WP(1)}}
            color={AppTheme?.DefaultPalette()?.grey[800]}>
            {name}
          </TextItem>

          {/*<TextItem*/}
          {/*  size={3.5}*/}
          {/*  weight={'regular'}*/}
          {/*  family={'PoppinsRegular'}*/}
          {/*  color={AppTheme?.DefaultPalette()?.grey[600]}>*/}
          {/*  {recent}*/}
          {/*</TextItem>*/}
        </ChatCardDetails>
        {!read && <UnReadDot />}
      </ChatCardContainer>
    </ChatCardWrapper>
  );
};

ChatCard.prototype = {
  name: PropTypes.string,
  time: PropTypes.string,
  recent: PropTypes.any,
  read: PropTypes.bool,
  onPress: PropTypes.func,
};
export {ChatCard};
