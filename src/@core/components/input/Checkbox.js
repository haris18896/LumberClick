import React from 'react';

// ** Third Party Packages
import PropTypes from 'prop-types';
import {Checkbox} from 'react-native-paper';

// ** Custom Components
import {CheckBoxLabel, CheckBoxWrapper} from '../../../styles/components';

const CheckBox = ({
  state,
  color,
  label,
  onPress,
  variant,
  disabled,
  uncheckedColor,
  position = 'leading',
}) => {
  return (
    <CheckBoxWrapper>
      <Checkbox.Android
        color={color}
        status={state}
        onPress={onPress}
        position={position}
        disabled={disabled}
        labelVariant={variant}
        uncheckedColor={uncheckedColor}
      />
      <CheckBoxLabel>{label}</CheckBoxLabel>
    </CheckBoxWrapper>
  );
};

CheckBox.propTypes = {
  disabled: PropTypes.bool,
  state: PropTypes.oneOf(['checked', 'unchecked', 'indeterminate']),
  color: PropTypes.string,
  label: PropTypes.string,
  onPress: PropTypes.func,
  variant: PropTypes.string,
  uncheckedColor: PropTypes.string,
  position: PropTypes.string,
};

export {CheckBox};
