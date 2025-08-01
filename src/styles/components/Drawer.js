import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import styled from 'styled-components';

export const DrawerWrapper = styled(SafeAreaView)`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const DrawerAvatarWrapper = styled(TouchableOpacity)`
  width: 100%;
  padding-left: ${props => props?.theme?.WP(5)}px;
  padding-right: ${props => props?.theme?.WP(5)}px;
`;

export const DrawerAvatarContainer = styled(View)`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
`;

export const UserDetailWrapper = styled(View)`
  margin-left: ${props => props?.theme?.WP(2.5)}px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
`;

export const UserDetailText = styled(Text)`
  font-family: ${props => props?.theme?.fonts?.PoppinsMedium};
  font-weight: ${props =>
    props?.fontWeight ? props?.fontWeight : props?.theme?.fontWeights?.medium};
  color: ${props =>
    props?.theme?.DefaultPalette()?.primary?.reverseContrastText};
  font-size: ${props => props?.theme?.WP(3.5)}px;
`;

export const UserDetail = styled(View)`
  margin-bottom: ${props =>
    props?.marginBottom ? props?.theme?.WP(props?.marginBottom) : 0}px;
`;

export const DrawerListWrapper = styled(ScrollView)`
  flex: 1;
  width: 100%;
`;

export const MenuItemComponent = styled(TouchableOpacity)`
  background-color: ${props =>
    props?.active
      ? props?.theme?.DefaultPalette()?.success?.main
      : 'transparent'};
  border-radius: ${props => props?.theme?.WP(2)}px;
  margin-left: ${props => props?.theme?.WP(4)}px;
  margin-right: ${props => props?.theme?.WP(4)}px;
  padding-left: ${props => props?.theme?.WP(3)}px;
  padding-right: ${props => props?.theme?.WP(3)}px;
  padding-top: ${props => props?.theme?.WP(3)}px;
  padding-bottom: ${props => props?.theme?.WP(3)}px;
  margin-bottom: ${props => props?.theme?.WP(1)}px;
  margin-top: ${props => props?.theme?.WP(1)}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const MenuItemText = styled(Text)`
  font-family: ${props => props?.theme?.fonts?.PoppinsSemiBold};
  font-weight: ${props =>
    props?.fontWeight
      ? props?.fontWeight
      : props?.theme?.fontWeights?.semiBold};
  color: ${props =>
    props?.active
      ? props?.theme?.DefaultPalette()?.common?.white
      : props?.theme?.DefaultPalette()?.common?.white};
  font-size: ${props => props?.theme?.WP(4.5)}px;
  margin-left: ${props => props?.theme?.WP(4)}px;
`;

export const DrawerFooter = styled(View)`
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding-left: ${props => props?.theme?.WP(5)}px;
`;

export const DrawerLogout = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: ${props => props?.theme?.WP(7)}px;
`;
