import styled from 'styled-components';
import {TouchableOpacity, View} from 'react-native';
import {hexToRgba} from '../../utils/utils';

export const JobButtonContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: ${props =>
    props?.justifyContent ? props?.justifyContent : 'space-between'};
`;

export const JobsButtonWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-width: 2px;
  border-radius: ${props => props?.theme?.WP(2)}px;
  border-color: ${props => props?.theme?.DefaultPalette()?.success?.main};
`;

export const JobButton = styled(TouchableOpacity)`
  background-color: ${props =>
    props?.active
      ? props?.theme?.DefaultPalette()?.secondary?.light
      : 'transparent'};
  padding-left: ${props => props?.theme?.WP(3)}px;
  padding-right: ${props => props?.theme?.WP(3)}px;
  padding-top: ${props => props?.theme?.WP(1.3)}px;
  padding-bottom: ${props => props?.theme?.WP(1.3)}px;
`;

export const SearchBar = styled(View)`
  padding-bottom: ${props => props?.theme?.WP(4)}px;
  padding-right: ${props => props?.theme?.WP(1)}px;
`;

export const Container3D = styled(View)`
  flex: 1;
  padding-left: ${props => props?.theme?.WP(4)}px;
  padding-right: ${props => props?.theme?.WP(4)}px;
  padding-bottom: ${props => props?.theme?.WP(4)}px;
`;

export const Container3DCard = styled(View)`
  background-color: ${props =>
    props?.theme?.DefaultPalette()?.background?.main};
  border-radius: ${props => props?.theme?.WP(3)}px;
  padding: ${props => props?.theme?.WP(4)}px;
  shadow-color: '#000';
  shadow-offset: {width: 0, height: 2};
  shadow-opacity: 0.1;
  shadow-radius: 4;
  elevation: 3;
  border-width: 1;
  
`;
