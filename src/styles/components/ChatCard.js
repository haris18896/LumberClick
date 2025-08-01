import styled from 'styled-components';
import {TouchableOpacity, View} from 'react-native';
import {hexToRgba} from '../../utils/utils';

export const ChatCardWrapper = styled(TouchableOpacity)`
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

export const ChatCardContainer = styled(View)`
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

export const ChatCardDetails = styled(View)`
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin-left: ${props => props?.theme?.WP(2)}px;
`;
