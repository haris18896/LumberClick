import {TouchableOpacity, StyleSheet} from 'react-native';
import React, {useContext} from 'react';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Components
import {Badge} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

// ** Custom Components
import {
  HeaderWrapper,
  HeaderDetailWrapper,
  HeaderImage,
} from '../../styles/components';
import {appImages} from '../../assets';
import {TextItem} from '../../styles/typography';
import {ColumnStart, RowStart} from '../../styles/infrustucture';

// ** SVGs
import ChevronLeft from '../../assets/svgs/chevron-left.svg';
import PropTypes from 'prop-types';

const ChatHeader = props => {
  // ** Props
  const {
    onBack,
    name = '',
    user,
    customStyles,
    backIconColor,
    status = 'Online',
  } = props;

  // ** navigation
  const navigation = useNavigation();

  return (
    <HeaderWrapper style={customStyles}>
      <RowStart style={styles.UserDataView}>
        {onBack && (
          <TouchableOpacity
            style={styles.leftItem(backIconColor)}
            onPress={onBack}>
            <ChevronLeft width={AppTheme?.WP(6)} height={AppTheme?.WP(6)} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Profile', {
              biddingUser: {},
            })
          }>
          <HeaderImage
            marginRight={2}
            width={user?.width}
            height={user?.height}
            source={appImages?.Logo}
            resizeMode={'cover'}
          />
        </TouchableOpacity>

        <ColumnStart style={styles.UserCredsView}>
          <TextItem size={4}>{name}</TextItem>
          {status && <TextItem size={3}>{status}</TextItem>}
        </ColumnStart>
      </RowStart>

      <HeaderDetailWrapper />
    </HeaderWrapper>
  );
};

const styles = StyleSheet.create({
  leftItem: backIconColor => ({
    zIndex: 2,
    borderRadius: AppTheme?.WP(1),
    backgroundColor: backIconColor
      ? AppTheme?.DefaultPalette()?.primary.main
      : 'transparent',
  }),
  UserDataView: {width: '100%'},
  UserCredsView: {flex: 1},
  badge: {
    position: 'absolute',
    zIndex: 2,
    top: AppTheme?.WP(-1),
    right: AppTheme?.WP(-1.5),
    backgroundColor: AppTheme?.DefaultPalette()?.error?.main,
  },
});

ChatHeader.prototype = {
  name: PropTypes.string,
  status: PropTypes.string,
  customStyles: PropTypes.object,
  onBack: PropTypes.func,
  user: PropTypes.object,
  backIconColor: PropTypes?.bool,
};

export {ChatHeader};
