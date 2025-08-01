import React, { forwardRef } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

// ** Utils
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Third Party packages
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {
  ButtonLabel,
  ButtonWrapper,
  IconWrapper,
  LoadingWrapper,
} from '../../styles/components';

const ButtonAction = forwardRef((props, ref) => {
  const {
    icon,
    size,
    title,
    border,
    color,
    width,
    onPress,
    children,
    loadingColor,
    titleWeight,
    radius,
    styles = {},
    end = false,
    start = false,
    padding = 1,
    underline = false,
    loading = false,
    disabled = false,
    labelColor = `#fff`,
  } = props;

  return (
    <ButtonWrapper
      ref={ref}
      radius={radius}
      color={color}
      width={width}
      padding={padding}
      onPress={onPress}
      style={styles}
      border={border}
      disabled={disabled || loading}
    >
      {icon?.name && start && (
        <IconWrapper left={start} icon={icon}>
          <Icon
            name={icon?.name}
            size={AppTheme?.WP(icon?.size)}
            color={icon?.color}
          />
        </IconWrapper>
      )}

      <ButtonLabel
        size={size}
        style={extraStyles.underline(underline)}
        labelColor={labelColor}
        titleWeight={titleWeight}
      >
        {title}
      </ButtonLabel>
      {children}
      <LoadingWrapper size={size} left={start} right={end} loading={loading}>
        <ActivityIndicator size={AppTheme.WP('5')} color={loadingColor} />
      </LoadingWrapper>
      {icon?.name && end && (
        <IconWrapper right={end} icon={icon}>
          <Icon
            name={icon?.name}
            size={AppTheme?.WP(icon?.size)}
            color={icon?.color}
          />
        </IconWrapper>
      )}
    </ButtonWrapper>
  );
});

ButtonAction.propTypes = {
  end: PropTypes.any,
  icon: PropTypes.object,
  start: PropTypes.any,
  size: PropTypes.number,
  loading: PropTypes.bool,
  title: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  styles: PropTypes.object,
  underline: PropTypes.bool,
  padding: PropTypes.number,
  border: PropTypes?.string,
  titleWeight: PropTypes.string,
  loadingColor: PropTypes.string,
  labelColor: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const extraStyles = StyleSheet.create({
  underline: underline => ({
    textDecorationLine: underline ? 'underline' : 'none',
  }),
});

export { ButtonAction };
