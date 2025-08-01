import styled from 'styled-components';
import {View} from 'react-native';

export const HeadingDetailsWrapper = styled(View)`
  width: ${props => (props?.width ? props?.width : '100%')};
  align-items: center;
  justify-content: ${props =>
    props?.justifyContent ? props?.justifyContent : 'center'};
`;
