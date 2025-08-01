import {StyleSheet} from 'react-native';

// ** Utils
import {theme as AppTheme} from '../@core/infrustructure/theme';

export const CommonStyles = StyleSheet.create({
  shadow: {
    zIndex: 10,
    elevation: 2,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowColor: AppTheme?.DefaultPalette()?.shadow?.paper,
  },
  smallShadow: {
    zIndex: 10,
    elevation: 5,
    shadowRadius: 3,
    shadowOpacity: 0.12,
    shadowOffset: {width: 0, height: 1},
    shadowColor: AppTheme?.DefaultPalette()?.shadow?.paper,
  },
  selector: {
    buttonStyle: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: AppTheme?.DefaultPalette().borders.inputBorder,
      width: '48%',
      padding: 0,
      margin: 0,
      height: AppTheme?.WP(10.5),
      borderRadius: AppTheme?.WP(2),
      marginTop: AppTheme?.WP(3),
    },
    buttonTextStyle: {
      fontSize: AppTheme?.WP(3.5),
      color: AppTheme?.DefaultPalette().text.primary,
      fontWeight: AppTheme?.fontWeights?.regular,
      fontFamily: AppTheme?.fonts?.PoppinsRegular,
    },
    rowStyle: {},
    selectedRowStyle: {
      backgroundColor: AppTheme?.DefaultPalette()?.success?.main,
    },
    selectedRowTextStyle: {
      color: AppTheme?.DefaultPalette()?.text?.text,
    },
    dropdownStyle: {
      borderRadius: AppTheme?.WP(3),
      backgroundColor: AppTheme?.DefaultPalette()?.background?.paper,
    },
    searchInputStyle: {
      borderBottomWidth: 1,
      borderBottomColor: AppTheme?.DefaultPalette().borders.inputBorder,
    },
    searchInputTxtStyle: {},
  },
});
