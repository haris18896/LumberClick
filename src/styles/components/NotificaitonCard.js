import styled from 'styled-components';
import {TouchableOpacity, View} from 'react-native';
import {hexToRgba} from '../../utils/utils';

export const NotificationCardWrapper = styled(TouchableOpacity)`
  border-radius: ${props => props?.theme?.WP(2)}px;
  width: 100%;
  padding-left: ${props => props?.theme?.WP(2)}px;
  padding-right: ${props => props?.theme?.WP(2)}px;
  background-color: ${props =>
    props?.bg
      ? props?.bg
      : `rgba(${props?.theme?.DefaultPalette()?.secondary?.main}, 0.2)`};
  margin-bottom: ${props => props?.theme?.WP(2)}px;
`;

export const NotificationCardContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: ${props => props?.theme?.WP(2)}px;
  background-color: ${props =>
    props?.unread
      ? hexToRgba(props?.theme?.DefaultPalette()?.success?.light, 0.08)
      : hexToRgba(props?.theme?.DefaultPalette()?.secondary.light, 0.08)};
  border-radius: ${props => props?.theme?.WP(2)}px;
`;

export const NotificationCardIcon = styled(View)`
  padding: ${props => props?.theme?.WP(4)}px;
  border-radius: ${props => props?.theme?.WP(2)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props?.theme?.WP(2)}px;
  background-color: ${props =>
    props?.IconBG
      ? hexToRgba(props?.IconBG, 0.1)
      : hexToRgba(props?.theme?.DefaultPalette()?.success?.main, 0.1)};
`;

export const NotificationCardDetails = styled(View)`
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
`;
