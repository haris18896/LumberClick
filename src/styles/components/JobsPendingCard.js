import styled from 'styled-components';
import {TouchableOpacity, Image, View} from 'react-native';

export const JobsCardWrapper = styled(TouchableOpacity)`
  border-radius: ${props => props?.theme?.WP(4)}px;
  background-color: ${props =>
    props?.background
      ? props?.background
      : props?.theme?.DefaultPalette()?.card?.secondary};
  padding: ${props => props?.theme?.WP(4)}px;
  margin-bottom: ${props => props?.theme?.WP(4)}px;
  width: 100%;
  flex-direction: ${props => (props?.direction ? props?.direction : 'row')};
  align-items: flex-start;
  justify-content: flex-start;
`;

export const CompanyIcon = styled(Image)`
  width: ${props => props?.theme?.WP(12)}px;
  height: ${props => props?.theme?.WP(12)}px;
  border-radius: ${props => props?.theme?.WP(2)}px;
  margin-right: ${props => props?.theme?.WP(4)}px;
`;

export const JobDetailWrapper = styled(View)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
`;

export const JobDetailContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: ${props => props?.theme?.WP(2)}px;
`;
