import styled from 'styled-components';
import {Text, View} from 'react-native';

export const CheckBoxWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const CheckBoxLabel = styled(Text)`
  font-weight: ${props => props.theme.fontWeights.medium};
  font-family: ${props => props.theme.fonts.PoppinsMedium};
  color: ${props => props.theme.DefaultPalette().labels.primaryLabel};
  font-size: ${props => props.theme.WP('3')}px;
`;
