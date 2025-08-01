import styled from 'styled-components';
import {View, Image, TouchableOpacity} from 'react-native';

export const ProfileImageWrapper = styled(View)`
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: ${props => (props?.bg ? props.bg : 'transparent')};
  margin-top: ${props =>
    props?.marginTop
      ? props?.theme?.WP(props?.marginTop)
      : props?.theme?.WP(7)}px;
  margin-bottom: ${props =>
    props?.marginBottom
      ? props?.theme?.WP(props?.marginBottom)
      : props?.theme?.WP(5)}px;
  width: ${props =>
    props?.size?.width
      ? props?.theme?.WP(props?.size?.width)
      : props?.theme?.WP(30)}px;
  height: ${props =>
    props?.size?.height
      ? props?.theme?.WP(props?.size?.height)
      : props?.theme?.WP(30)}px;
  border-radius: ${props => props?.theme?.WP(50)}px;
  border-width: ${props => (props?.border?.width ? props?.border?.width : 0)}px;
  border-color: ${props =>
    props?.border?.color ? props?.border?.color : 'transparent'};
`;

export const ProfileImage = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: ${props => props?.theme?.WP(50)}px;
`;

export const UserProfileWrapper = styled(View)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props?.theme?.WP(4)}px;
  position: relative;
`;
