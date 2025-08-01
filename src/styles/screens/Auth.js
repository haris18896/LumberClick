import styled from 'styled-components';
import {View, Text, ScrollView, KeyboardAvoidingView} from 'react-native';

export const AvoidKeyboard = styled(KeyboardAvoidingView)`
  flex: 0.2;
  width: 100%;
  margin-bottom: ${props => props.theme?.WP(4)}px;
  position: relative;
`;

export const AuthContainer = styled(ScrollView)`
  position: relative;
  width: 100%;
  flex: 1;
  padding-bottom: ${props =>
    props?.paddingBottom
      ? props?.theme?.WP(props?.paddingBottom)
      : props.theme?.WP(5)}px;
  height: ${props => props.theme.scrHeight / 1.7}px;
  padding-left: ${props =>
    props.theme.WP(props?.paddingHorizontal) || props.theme.WP(4)}px;
  padding-right: ${props =>
    props.theme.WP(props?.paddingHorizontal) || props.theme.WP(4)}px;
`;

export const AuthActivityWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: ${props => props?.justifyContent || 'space-between'};
  width: ${props => props?.width || '100%'};
  margin-top: ${props => (props?.mt ? props?.theme?.WP(props?.mt) : '0')}px;
  margin-bottom: ${props => (props?.mb ? props?.theme?.WP(props?.mb) : '0')}px;
`;

export const AuthActivityLabel = styled(Text)`
  font-weight: ${props => props.theme.fontWeights.medium};
  font-family: ${props => props.theme.fonts.PoppinsMedium};
  color: ${props =>
    props?.color ? props?.color : props.theme.DefaultPalette().success?.main};
  font-size: ${props => props.theme.WP('3.2')}px;
`;

export const UserActivityWrapper = styled(View)`
  width: ${props => (props?.width ? props?.width : '100%')};
  flex-direction: ${props => (props?.direction ? props?.direction : 'row')};
  align-items: ${props => (props?.alignItems ? props?.alignItems : 'center')};
  justify-content: ${props =>
    props?.justifyContent ? props?.justifyContent : 'space-between'};
  margin-top: ${props => props?.theme?.WP(props?.marginTop) || 0}px;
  margin-bottom: ${props => props?.theme?.WP(props?.marginBottom) || 0}px;
  height: ${props =>
    props?.height ? `${props?.theme?.WP(props?.height)}px` : 'auto'};
`;
