import styled from 'styled-components';
import {Text, View, TouchableOpacity} from 'react-native';

export const BackButtonContainer = styled(TouchableOpacity)`
  background-color: ${props =>
    props?.bg ? props?.bg : props?.theme?.DefaultPalette()?.background?.paper};
  padding: ${props => props?.theme?.WP(2)}px;
  border-radius: ${props => props?.theme?.WP(10)}px;
  width: ${props => props?.theme?.WP(10)}px;
  height: ${props => props?.theme?.WP(10)}px;
  align-items: center;
  justify-content: center;
`;

export const ButtonWrapper = styled(TouchableOpacity)`
  border-width: 1px;
  position: relative;
  opacity: ${props => (props?.disabled ? '0.5' : 1)};
  margin-top: ${props => props.theme.WP('1')}px;
  border-radius: ${props =>
    props?.radius ? props.theme.WP(props?.radius) : props.theme.WP('7')}px;
  margin-bottom: ${props => props.theme.WP('1')}px;
  width: ${props => (props?.width ? props?.width : '100%')};
  background-color: ${props => (props?.color ? props?.color : 'transparent')};
  padding: ${props =>
    props?.size === 'small' ? props.theme.WP('0') : props.theme.WP('1')}px;
  border-color: ${props =>
    props?.border
      ? props?.border
      : props?.color
      ? props.color
      : props.theme.DefaultPalette().borders.inputBorder};
`;

export const IconWrapper = styled(View)`
  position: absolute;
  top: 27%;
  left: ${props => (props?.left ? props?.theme?.WP(props?.left) : 0)}px;
  right: ${props => (props?.right ? props?.theme?.WP(props?.right) : 0)}px;
`;

export const ButtonLabel = styled(Text)`
  text-align: center;
  color: ${props => props?.labelColor};
  padding: ${props => props.theme.WP('2')}px;
  font-weight: ${props => props.theme.fontWeights.semiBold};
  font-size: ${props => props.theme.WP('3.5')}px;
  font-family: ${props => props.theme.fonts.PoppinsMedium};
`;

export const LoadingWrapper = styled(View)`
  position: absolute;
  align-items: center;
  justify-content: center;
  top: ${props =>
    props?.size === 'small' ? props.theme.WP('0') : props.theme.WP('1')}px;
  width: ${props => props.theme.WP('9')}px;
  height: ${props => props.theme.WP('9')}px;
  display: ${props =>
    props?.loading && (props.left || props.right) ? 'flex' : 'none'};
  border-radius: ${props => props.theme.WP('10')}px;
  right: ${props => props?.right && props.theme.WP('1.5')}px;
  left: ${props => props?.left && props.theme.WP('1.5')}px;
`;
