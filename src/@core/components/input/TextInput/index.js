import React, { useState, forwardRef } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

// ** Utils
import { resizeMode } from '../../../../utils/constants';
import { theme as AppTheme } from '../../../infrustructure/theme';

// ** Third Party Packages
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {
  Input,
  InputLabel,
  InputContainer,
  TextInputWrapper,
  LeftIconWrapper,
  RightIconWrapper,
} from '../../../../styles/components';
import { ErrorText, ErrorTextWrapper } from '../../../../styles/infrustucture';

const TextInput = forwardRef((props, ref) => {
  const {
    error,
    width,
    title,
    height,
    submit,
    onBlur,
    onFocus,
    leftIcon,
    disabled,
    rightIcon,
    placeholder,
    formikError,
    nextInputRef,
    defaultValue,
    formikTouched,
    inputBackground,
    placeholderColor = AppTheme.DefaultPalette().text.main,
    borderColor = null,
    styleData = {},
    maxLength = 40,
    inputMode = 'text',
    textAlign = 'left',
    autoFocus = false,
    variant = 'outlined',
    autoComplete = 'off',
    returnKeyType = 'next',
    autoCorrect = false,
    blurOnSubmit = false,
    autoCapitalize = 'none',
    keyboardType = 'default',
    secureTextEntry = false,
    iconColor = AppTheme.DefaultPalette().text.text,
    imageIcon = null,
    ...rest
  } = props;

  const [showPass, setShowPass] = useState(true);

  // Only pass valid props to Input
  const inputProps = {
    ref,
    mode: variant,
    height,
    onBlur,
    onFocus,
    editable: !disabled,
    maxLength,
    autoFocus,
    inputMode,
    textAlign,
    placeholder,
    autoCorrect,
    keyboardType,
    defaultValue,
    autoComplete,
    blurOnSubmit,
    returnKeyType,
    autoCapitalize,
    secureTextEntry: secureTextEntry && showPass,
    placeholderTextColor: placeholderColor,
    onSubmitEditing: () => {
      if (nextInputRef && nextInputRef.current) {
        nextInputRef.current.focus();
      } else if (returnKeyType === 'done') {
        if (ref && ref.current && typeof ref.current.blur === 'function') {
          ref.current.blur();
        }
        if (typeof submit === 'function') submit();
      } else if (typeof onBlur === 'function') {
        onBlur();
      }
    },
    value: rest.value, // Only if you are controlling the value
    onChangeText: rest.onChangeText, // Only if you are controlling the value
  };

  return (
    <TextInputWrapper error={formikTouched && formikError} width={width}>
      {title && (
        <InputLabel labelStyles={styleData ? styleData?.labelStyles : {}}>
          {title}
        </InputLabel>
      )}
      <InputContainer
        height={height}
        left={leftIcon}
        right={rightIcon}
        borderColor={borderColor}
        inputBackground={inputBackground}
        secureTextEntry={secureTextEntry}
        error={formikTouched && formikError}
      >
        <LeftIconWrapper>
          {imageIcon?.left ? (
            <Image
              resizeMode={resizeMode}
              source={imageIcon?.left?.icon}
              style={{
                width: AppTheme.WP(imageIcon?.left?.width),
                height: AppTheme.WP(imageIcon?.left?.height),
              }}
            />
          ) : (
            leftIcon && (
              <Icon
                name={leftIcon}
                size={AppTheme.WP(5)}
                color={
                  disabled ? AppTheme?.DefaultPalette()?.grey[500] : iconColor
                }
              />
            )
          )}
        </LeftIconWrapper>

        <Input {...inputProps} />

        <RightIconWrapper>
          {imageIcon?.right ? (
            <Image
              resizeMode={resizeMode}
              source={imageIcon?.right?.icon}
              style={{
                width: AppTheme.WP(imageIcon?.right?.width),
                height: AppTheme.WP(imageIcon?.right?.height),
              }}
            />
          ) : (
            rightIcon &&
            !secureTextEntry && (
              <Icon
                name={rightIcon}
                color={
                  disabled ? AppTheme?.DefaultPalette()?.grey[500] : iconColor
                }
                size={AppTheme.WP(5.5)}
              />
            )
          )}

          {secureTextEntry && !rightIcon && (
            <Pressable onPress={() => setShowPass(!showPass)}>
              <Icon
                size={AppTheme.WP(5)}
                name={showPass ? 'eye-off' : 'eye'}
                color={
                  disabled
                    ? AppTheme?.DefaultPalette()?.grey[500]
                    : showPass
                    ? iconColor
                    : AppTheme.DefaultPalette().success?.main
                }
              />
            </Pressable>
          )}
        </RightIconWrapper>
      </InputContainer>

      {formikTouched && formikError && (
        <ErrorTextWrapper error={formikError}>
          <ErrorText
            style={styles.errorStyles(formikError, styleData?.errorMargin)}
          >
            {formikError}
          </ErrorText>
        </ErrorTextWrapper>
      )}
    </TextInputWrapper>
  );
});

const styles = StyleSheet.create({
  errorStyles: (error, errorMargin) => ({
    borderRadius: AppTheme?.WP(5),
    paddingHorizontal: AppTheme?.WP(2),
    paddingVertical: AppTheme?.WP(1),
  }),
});

TextInput.propTypes = {
  error: PropTypes.bool,
  onBlur: PropTypes.func,
  submit: PropTypes.func,
  title: PropTypes.string,
  width: PropTypes.string,
  disabled: PropTypes.bool,
  onFocus: PropTypes?.func,
  autoFocus: PropTypes.bool,
  variant: PropTypes.string,
  leftIcon: PropTypes.string,
  styleData: PropTypes.object,
  maxLength: PropTypes.number,
  inputMode: PropTypes.string,
  textAlign: PropTypes.string,
  rightIcon: PropTypes.string,
  autoCorrect: PropTypes.bool,
  iconColor: PropTypes.string,
  imageIcon: PropTypes.object,
  blurOnSubmit: PropTypes.bool,
  formikTouched: PropTypes.bool,
  placeholder: PropTypes.string,
  formikError: PropTypes.string,
  nextInputRef: PropTypes.object,
  defaultValue: PropTypes.string,
  keyboardType: PropTypes.string,
  autoComplete: PropTypes.string,
  returnKeyType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  autoCapitalize: PropTypes.string,
};

export { TextInput };
