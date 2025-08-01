import styled from 'styled-components';
import {View, Text} from 'react-native';

export const EmptyCenter = styled(View)`
  margin-top: ${props => props?.theme?.WP(8)}px;
  margin-bottom: ${props => props?.theme?.WP(8)}px;
  max-width: ${props => (props?.maxWidth ? props?.maxWidth : '85%')};
`;

export const EmptyCenterWrapper = styled(View)`
  flex: 1;
  height: 100%;
  justify-content: center;
`;

export const EmptyWrapper = styled(View)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled(Text)`
  text-align: center;
  color: ${props => props?.theme.DefaultPalette().text.primary};
  font-size: ${props =>
    props?.fontSize
      ? props?.theme?.WP(props?.fontSize)
      : props?.theme?.WP(4.5)}px;
  font-family: ${props => props?.theme?.fonts.PoppinsMedium};
  font-weight: ${props => props?.theme?.fontWeights.medium};
  padding-left: ${props => props?.theme?.WP(4)}px;
  padding-right: ${props => props?.theme?.WP(4)}px;
`;
