import styled from 'styled-components';
import {View, Image, Text} from 'react-native';

export const UserAvatarWrapper = styled(View)`
  width: ${props =>
    props?.size ? props?.theme?.WP(props?.size) : props?.theme?.WP(15)}px;
  height: ${props =>
    props?.size ? props?.theme?.WP(props?.size) : props?.theme?.WP(15)}px;
  border-radius: ${props => props?.theme?.WP(20)}px;
  margin-right: ${props =>
    props?.marginRight ? props?.theme?.WP(props?.marginRight) : 0}px;
  background-color: ${props =>
    props?.background
      ? props?.background
      : props?.theme?.DefaultPalette()?.background?.paper};
`;

export const AvatarImage = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: ${props => props?.theme?.WP(20)}px;
`;

export const UserAvatarName = styled(View)`
  width: 100%;
  height: 100%;
  border-radius: ${props => props?.theme?.WP(20)}px;
  align-items: center;
  justify-content: center;
`;

export const UserAvatarNameText = styled(Text)`
  text-align: center;
  font-weight: 600;
  font-family: ${props => props?.theme?.fonts?.PoppinsSemiBold};
  font-size: ${props =>
    props?.size ? props?.theme?.WP(props?.size) : props?.theme?.WP(7)}px;
  color: ${props => props?.theme?.DefaultPalette().primary?.main};
`;
