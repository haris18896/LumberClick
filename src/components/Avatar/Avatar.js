import React from 'react';

// ** Custom Components
import {
  AvatarImage,
  UserAvatarName,
  UserAvatarNameText,
  UserAvatarWrapper,
} from '../../styles/components/Avatar';
import {appImages} from '../../assets';

const Avatar = props => {
  // ** props
  const {avatarSize, image, name, size, background} = props;

  return (
    <UserAvatarWrapper background={background} size={avatarSize}>
      {image ? (
        <AvatarImage source={image ? image : appImages?.Logo} />
      ) : (
        <UserAvatarName>
          <UserAvatarNameText size={size}>{`${name?.[0]
            .trim()[0]
            .toUpperCase()}${name?.[1]
            .trim()[0]
            .toUpperCase()}`}</UserAvatarNameText>
        </UserAvatarName>
      )}
    </UserAvatarWrapper>
  );
};
export {Avatar};
