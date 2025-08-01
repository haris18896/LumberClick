import { TouchableOpacity, StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';

// ** Utils
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Third Party Components
import { useSelector } from 'react-redux';
import { Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {
  HeaderWrapper,
  IconCountWrapper,
  HeaderDetailWrapper,
  HeaderImage,
} from '../../styles/components';
import { appImages } from '../../assets';

// ** SVGs
import Bar from '../../assets/svgs/bar.svg';
import Chat from '../../assets/svgs/chat.svg';
import Bell from '../../assets/svgs/bell.svg';
import { TextItem } from '../../styles/typography';
import { ellipsisText } from '../../utils/utils';

const BarHeader = props => {
  // ** Props
  const {
    onBack,
    user,
    title,
    customStyles,
    onPressBar,
    backIconColor,
    showChat = {
      chat: true,
      badge: false,
    },
    close = false,
    showNotification = {
      notification: true,
      badge: false,
    },
  } = props;

  // ** navigation
  const navigation = useNavigation();

  // ** Context
  const { userMe } = useSelector(state => state?.auth);

  return (
    <HeaderWrapper style={customStyles}>
      <View style={styles.headerContainer}>
        {onPressBar && (
          <TouchableOpacity
            style={styles.leftItem(backIconColor)}
            left={2}
            onPress={onPressBar}
          >
            <Bar width={AppTheme?.WP(6)} height={AppTheme?.WP(6)} />
          </TouchableOpacity>
        )}

        {onBack && (
          <TouchableOpacity
            style={styles.leftItem(backIconColor)}
            onPress={onBack}
          >
            <Icon
              name={close ? 'close' : 'chevron-left'}
              size={close ? AppTheme?.WP(7) : AppTheme?.WP(8)}
              color={AppTheme?.DefaultPalette()?.text?.primary}
            />
          </TouchableOpacity>
        )}

        {title && (
          <TextItem size={3.5} color="#666" style={styles.title}>
            {ellipsisText(title, 25)}
          </TextItem>
        )}
      </View>

      <HeaderDetailWrapper>
        {showChat.chat && (
          <IconCountWrapper onPress={() => navigation.navigate('ChatHub')}>
            {showChat.badge && (
              <Badge size={AppTheme?.WP(5)} style={styles.badge}>
                3
              </Badge>
            )}
            <Chat
              stroke={'red'}
              width={AppTheme?.WP(6)}
              height={AppTheme?.WP(6)}
            />
          </IconCountWrapper>
        )}

        {showNotification.notification && (
          <IconCountWrapper
            onPress={() => navigation.navigate('Notifications')}
          >
            {showNotification.badge && (
              <Badge size={AppTheme?.WP(5)} style={styles.badge}>
                4
              </Badge>
            )}
            <Bell width={AppTheme?.WP(6)} height={AppTheme?.WP(6)} />
          </IconCountWrapper>
        )}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Profile', {
              biddingUser: {},
            })
          }
        >
          <HeaderImage
            width={user?.width}
            height={user?.height}
            source={
              userMe?.profileImage
                ? { uri: userMe?.profileImage }
                : appImages?.Logo
            }
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      </HeaderDetailWrapper>
    </HeaderWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftItem: backIconColor => ({
    zIndex: 2,
    borderRadius: AppTheme?.WP(1),
    backgroundColor: backIconColor
      ? AppTheme?.DefaultPalette()?.primary.main
      : 'transparent',
  }),
  badge: {
    position: 'absolute',
    zIndex: 2,
    top: AppTheme?.WP(-1),
    right: AppTheme?.WP(-1.5),
    backgroundColor: AppTheme?.DefaultPalette()?.error?.main,
  },
});

export { BarHeader };
