import React, {useEffect, forwardRef} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

// ** Utils
import {theme as AppTheme} from '../../infrustructure/theme';

// ** Third Party Packages
import PropTypes from 'prop-types';
import {Icon} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';

// ** Custom components
import {ButtonAction} from '../../../components';
import {TextItem} from '../../../styles/typography';
import {UserActivityWrapper} from '../../../styles/screens';
import {
  RBSheetWrapper,
  RowCenter,
  SpaceBetweenWrapper,
} from '../../../styles/infrustucture';

const BottomSheet = forwardRef((props, ref) => {
  const {
    title,
    height,
    visible,
    onClose,
    onSubmit,
    disabled,
    children,
    isLoading,
    closeIcon,
    strictOpen,
    submitText,
  } = props;

  useEffect(() => {
    if (ref && visible) {
      ref?.current?.open();
    } else {
      ref?.current?.close();
    }
  }, [visible, ref]);

  return (
    <RBSheet
      ref={ref}
      height={height}
      onClose={onClose}
      closeOnPressBack={true}
      closeOnDragDown={strictOpen === false ? strictOpen : true}
      closeOnPressMask={strictOpen === false ? strictOpen : true}
      animationType="fade"
      duration={300}
      customStyles={{
        container: {
          paddingHorizontal: AppTheme.WP(5),
          borderTopLeftRadius: AppTheme.WP(5),
          borderTopRightRadius: AppTheme.WP(5),
        },
      }}>
      <RBSheetWrapper>
        <SpaceBetweenWrapper style={styles.heading}>
          {title && (
            <TextItem
              size={5}
              style={styles.title}
              color={AppTheme?.DefaultPalette()?.text?.primary}>
              {title}
            </TextItem>
          )}
          {onClose && (
            <TouchableOpacity onPress={() => onClose()}>
              <Icon
                source="close"
                size={AppTheme.WP(6)}
                color={AppTheme.DefaultPalette().text.text}
              />
            </TouchableOpacity>
          )}
        </SpaceBetweenWrapper>

        {children}

        {submitText && (
          <UserActivityWrapper style={{marginTop: 'auto'}} marginBottom={30}>
            <ButtonAction
              end
              title={submitText}
              loading={isLoading}
              disabled={disabled}
              titleWeight={'700'}
              onPress={() => onSubmit()}
              color={AppTheme?.DefaultPalette()?.buttons?.primary}
              labelColor={AppTheme.DefaultPalette().common.white}
              loadingColor={AppTheme.DefaultPalette().common.white}
            />
          </UserActivityWrapper>
        )}
      </RBSheetWrapper>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  heading: {
    paddingVertical: AppTheme?.WP(4),
  },
  title: {
    textAlign: 'left',
  },
});

export {BottomSheet};

BottomSheet.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  closeIcon: PropTypes.bool,
  strictOpen: PropTypes.bool,
  submitText: PropTypes.string,
};
