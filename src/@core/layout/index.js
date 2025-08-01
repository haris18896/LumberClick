import React from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Packages
import PropTypes from 'prop-types';

// ** Custom Components
import LoadingComponent from '../components';
import {SafeArea} from '../../styles/infrustucture';

const Layout = ({
  barStyle = 'dark-content',
  isLoading,
  children,
  loadingHeight,
  background,
  customStyles,
  animated = true,
  hidden = false,
  barBG = AppTheme?.DefaultPalette()?.background?.paper,
}) => {
  return (
    <SafeArea background={background}>
      {isLoading && <LoadingComponent height={loadingHeight} />}
      <View style={[styles.layoutContainer, customStyles]}>
        <StatusBar
          hidden={hidden}
          barStyle={barStyle}
          animated={animated}
          backgroundColor={barBG}
          showHideTransition={'fade'}
        />
        {children}
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    flexGrow: 1,
    position: 'relative',
    padding: AppTheme?.WP(4),
  },
});

export {Layout};

Layout.propTypes = {
  children: PropTypes.node,
  background: PropTypes.string,
  customStyles: PropTypes.object,
  barBG: PropTypes.string,
  barStyle: PropTypes.string,
};
