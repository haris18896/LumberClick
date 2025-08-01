import React from 'react';

// ** Utils
import { hexToRgba } from '../../utils/utils';
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Third Party
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import { ModalView } from '../../@core/components';
import { TextItem } from '../../styles/typography';
import { ButtonAction } from '../buttons/ButtonAction';
import { UserActivityWrapper } from '../../styles/screens';
import { ColumCenter, SpaceBetweenWrapper } from '../../styles/infrustucture';

const DeleteDocumentModel = ({
  title,
  visible,
  isLoading,
  onCancel,
  onConfirm,
  description,
}) => {
  return (
    <ModalView open={visible} title={title} toggleModal={onCancel}>
      <ColumCenter>
        <Icon
          name="information-outline"
          color={AppTheme?.DefaultPalette()?.primary?.main}
          size={AppTheme?.WP(15)}
        />
        <TextItem size={4} style={{ textAlign: 'center' }}>
          {description}
        </TextItem>
      </ColumCenter>
      <SpaceBetweenWrapper style={{ marginTop: AppTheme?.WP(4) }}>
        <UserActivityWrapper width={'48%'}>
          <ButtonAction
            end={true}
            title={'Cancel'}
            onPress={onCancel}
            border={hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.15)}
            color={hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.15)}
            loadingColor={hexToRgba(
              AppTheme?.DefaultPalette()?.primary?.main,
              1,
            )}
            labelColor={hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 1)}
          />
        </UserActivityWrapper>

        <UserActivityWrapper
          width={'48%'}
          style={{ marginLeft: AppTheme?.WP(2) }}
        >
          <ButtonAction
            end={true}
            title={'Delete'}
            disabled={isLoading}
            onPress={onConfirm}
            border={hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 0.15)}
            color={hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 0.15)}
            loadingColor={hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 1)}
            labelColor={hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 1)}
          />
        </UserActivityWrapper>
      </SpaceBetweenWrapper>
    </ModalView>
  );
};

export { DeleteDocumentModel };
