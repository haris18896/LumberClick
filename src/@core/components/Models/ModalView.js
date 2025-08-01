import React from 'react';

// ** Utils
import {theme as AppTheme} from '../../infrustructure/theme';

// ** Third Party packages
import {Pressable} from 'react-native';
import {Modal, Icon} from 'react-native-paper';

// ** Custom Components
import {SectionTitle} from '../../../styles/typography';
import {SpaceBetweenWrapper} from '../../../styles/infrustucture';

const ModalView = props => {
  const {open, toggleModal, title, children} = props;
  const containerStyle = {
    borderRadius: AppTheme.WP(2),
    borderWidth: AppTheme.WP(0.5),
    paddingVertical: AppTheme.WP(4),
    paddingHorizontal: AppTheme.WP(4),
    marginHorizontal: AppTheme.WP(4.5),
    borderColor: AppTheme.DefaultPalette().borders.inputBorder,
    backgroundColor: AppTheme.DefaultPalette().common?.white,
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      dismissableBackButton={true}
      contentContainerStyle={containerStyle}
      onDismiss={() => toggleModal()}>
      <SpaceBetweenWrapper
        marginLeft={1}
        marginRight={1}
        style={{marginBottom: AppTheme.WP(2)}}>
        <SectionTitle>{title}</SectionTitle>
        <Pressable onPress={toggleModal}>
          <Icon
            source="close"
            size={AppTheme.WP(6)}
            color={AppTheme.DefaultPalette().text.text}
          />
        </Pressable>
      </SpaceBetweenWrapper>
      {children}
    </Modal>
  );
};
export {ModalView};
