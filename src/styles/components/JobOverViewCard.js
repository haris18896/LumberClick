import styled from 'styled-components';
import {Image, View} from 'react-native';
import {hexToRgba} from '../../utils/utils';

export const JobOverViewWrapper = styled(View)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: ${props => props?.theme?.WP(4)}px;
  background-color: ${props =>
    hexToRgba(props?.theme?.DefaultPalette()?.primary?.light, 0.05)};
  border-radius: ${props => props?.theme?.WP(4)}px;
`;

export const JobOverviewHeader = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: ${props => props?.theme?.WP(4)}px;
  justify-content: space-between;
`;

export const JobSpeedometerWrapper = styled(View)`
  padding-bottom: ${props => props?.theme?.WP(4)}px;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const JobDetailContainer = styled(View)`
  width: 100%;
  padding-bottom: ${props => props?.theme?.WP(4)}px;
`;

export const JobCountWrapper = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const JobCountContainer = styled(View)`
  width: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: ${props => props?.theme?.WP(4)}px;
  padding-right: ${props => props?.theme?.WP(4)}px;
  border-right-width: 2px;
  border-color: ${props =>
    props?.borderRight
      ? props?.theme?.DefaultPalette()?.grey[300]
      : 'transparent'};
`;

export const JobCardProfile = styled(Image)`
  width: ${props =>
    props?.size ? props?.theme?.WP(props?.size) : props?.theme?.WP(12)}px;
  height: ${props =>
    props?.size ? props?.theme?.WP(props?.size) : props?.theme?.WP(12)}px;
  border-radius: ${props => props?.theme?.WP(20)}px;
  background-color: white;
`;
