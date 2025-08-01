import {Dimensions, PixelRatio, Platform} from 'react-native';

const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get('window').height;

const widthPercentageToDP = widthPercent => {
  const elemWidth = parseFloat(widthPercent);
  if (scrWidth > 600) {
    return PixelRatio.roundToNearestPixel((scrWidth * elemWidth) / 150);
  } else {
    return PixelRatio.roundToNearestPixel((scrWidth * elemWidth) / 100);
  }
};

const heightPercentageToDP = heightPercent => {
  const elemHeight = parseFloat(heightPercent);
  if (scrWidth > 600) {
    return PixelRatio.roundToNearestPixel((scrHeight * elemHeight) / 150);
  } else {
    return PixelRatio.roundToNearestPixel((scrHeight * elemHeight) / 100);
  }
};

const platformOrientedCode = (androidVal, iOSVal) =>
  Platform.select({android: androidVal, ios: iOSVal});

export {
  scrWidth,
  scrHeight,
  platformOrientedCode,
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
};
