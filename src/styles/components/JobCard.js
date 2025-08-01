import styled from 'styled-components';
import {View} from 'react-native';

export const JobCardUserWrapper = styled(View)`
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  width: 100%;
`;

export const JobCardUserContainer = styled(View)`
  width: ${props => props?.width};
`;

export const JobCardIconWrapper = styled(View)`
  background-color: ${props =>
    props?.background
      ? props?.background
      : props?.theme?.DefaultPalette()?.borders?.inputBorder};
  width: ${props =>
    props?.size ? props?.theme?.WP(props?.size) : props?.theme?.WP(8)}px;
  height: ${props =>
    props?.size ? props?.theme?.WP(props?.size) : props?.theme?.WP(8)}px;
  padding: ${props => props?.theme?.WP(1)}px;
  align-items: center;
  justify-content: ${props =>
    props?.justifyContent ? props?.justifyContent : 'flex-start'};
  border-radius: ${props => props?.theme?.WP(5)}px;
`;

export const JobCardDetailWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding-left: ${props => props?.theme?.WP(2)}px;
  padding-right: ${props => props?.theme?.WP(2)}px;
`;
