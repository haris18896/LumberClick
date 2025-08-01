import styled from 'styled-components';
import {View} from 'react-native';

export const SplashLayout = styled(View)`
  flex: 1;
  width: ${props => props?.theme?.scrWidth}px;
  height: ${props => props?.theme?.scrHeight}px;
  background-color: ${props => props?.theme?.DefaultPalette().success?.main};
`;

export const ImageWrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
