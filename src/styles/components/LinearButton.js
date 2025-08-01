import styled from 'styled-components';
import {View, Text, TouchableOpacity} from 'react-native';
import {isTablet} from '../../utils/utils';
import LinearGradient from 'react-native-linear-gradient';

export const LinearButtonWrapper = styled(LinearGradient)`
  position: relative;
  border-radius: ${props => props?.theme?.WP(4)}px;
  border-width: 1px;
  border-color: ${props =>
    props?.selected
      ? props?.theme?.DefaultPalette()?.borders?.borderSelected
      : props?.theme?.DefaultPalette()?.borders?.inputBorder};
  min-width: ${props => (isTablet ? `${props?.theme?.WP(20)}px` : '20%')};
  width: ${props => props?.width};
  height: ${props =>
    props?.height ? `${props?.theme?.WP(props?.height)}px` : 'auto'};
  overflow: hidden;
  align-items: center;
  justify-content: center;
  margin: ${props => props?.theme?.WP(1)}px;
`;

export const LinearText = styled(Text)`
  position: absolute;
  color: ${props =>
    props?.color
      ? props?.color
      : props?.theme?.DefaultPalette()?.primary?.contrastText};
  font-family: ${props => props?.theme?.fonts?.PoppinsMedium};
  font-weight: ${props => props?.theme?.fontWeights?.medium};
  font-size: ${props =>
    props?.fontSize
      ? props?.theme?.WP(props?.fontSize)
      : props?.theme?.WP(2.8)}px;
`;

export const LinearButtonContainer = styled(TouchableOpacity)`
  width: 100%;
`;

export const LinearButtonView = styled(View)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-left: ${props =>
    props?.pl ? props?.theme?.WP(props?.pl) : props?.theme?.WP(2)}px;
  padding-right: ${props =>
    props?.pr ? props?.theme?.WP(props?.pr) : props?.theme?.WP(2)}px;
  padding-top: ${props =>
    props?.pt ? props?.theme?.WP(props?.pt) : props?.theme?.WP(1)}px;
  padding-bottom: ${props =>
    props?.pb ? props?.theme?.WP(props?.pb) : props?.theme?.WP(1)}px;
`;

export const LinearButtonTitle = styled(Text)`
  text-align: center;
  width: 100%;
  color: ${props =>
    props?.color
      ? props?.color
      : props?.theme?.DefaultPalette()?.primary?.contrastText};
  font-family: ${props => props?.theme?.fonts?.PoppinsMedium};
  font-weight: ${props => props?.theme?.fontWeights?.medium};
  font-size: ${props =>
    props?.fontSize
      ? props?.theme?.WP(props?.fontSize)
      : props?.theme?.WP(3.5)}px;
`;

export const LinearButtonDescription = styled(Text)`
  margin-top: ${props => props?.theme?.WP(0.5)}px;
  text-align: center;
  width: 100%;
  color: ${props =>
    props?.color ? props?.color : props?.theme?.DefaultPalette()?.labels.label};
  font-family: ${props => props?.theme?.fonts?.PoppinsMedium};
  font-weight: ${props => props?.theme?.fontWeights?.medium};
  font-size: ${props =>
    props?.fontSize
      ? props?.theme?.WP(props?.fontSize)
      : props?.theme?.WP(3)}px;
`;
