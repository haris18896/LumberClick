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
import {
  ColumCenter,
  ColumnStartCenter,
  SpaceBetweenWrapper,
} from '../../styles/infrustucture';
import { Checkbox } from 'react-native-paper';

const QuotationModel = ({
  title,
  visible,
  isLoading,
  onCancel,
  onConfirm,
  isQuotation,
  setIsQuotation,
}) => {
  console.log('isQuotation : ', isQuotation);
  return (
    <ModalView open={visible} title={title} toggleModal={onCancel}>
      <ColumCenter>
        <Icon
          name="information-outline"
          color={AppTheme?.DefaultPalette()?.primary?.main}
          size={AppTheme?.WP(10)}
        />
        <TextItem size={4} style={{ textAlign: 'center' }}>
          {`Are you sure you want to upload ${
            isQuotation ? 'Quotation' : 'Document'
          }?`}
        </TextItem>
      </ColumCenter>

      <SpaceBetweenWrapper style={{ marginTop: AppTheme?.WP(4) }}>
        <ButtonAction
          width={'48%'}
          title={'Document'}
          onPress={() => setIsQuotation(prev => !prev)}
          border={hexToRgba(
            AppTheme?.DefaultPalette()?.error?.main,
            !isQuotation ? 1 : 0.15,
          )}
          color={hexToRgba(
            AppTheme?.DefaultPalette()?.error?.main,
            !isQuotation ? 1 : 0.15,
          )}
          loadingColor={
            !isQuotation ? 'white' : AppTheme?.DefaultPalette()?.error?.main
          }
          labelColor={
            !isQuotation ? 'white' : AppTheme?.DefaultPalette()?.error?.main
          }
        />
        <ButtonAction
          width={'48%'}
          title={'Quotation'}
          onPress={() => setIsQuotation(prev => !prev)}
          border={hexToRgba(
            AppTheme?.DefaultPalette()?.error?.main,
            isQuotation ? 1 : 0.15,
          )}
          color={hexToRgba(
            AppTheme?.DefaultPalette()?.error?.main,
            isQuotation ? 1 : 0.15,
          )}
          loadingColor={
            isQuotation ? 'white' : AppTheme?.DefaultPalette()?.error?.main
          }
          labelColor={
            isQuotation ? 'white' : AppTheme?.DefaultPalette()?.error?.main
          }
        />
      </SpaceBetweenWrapper>

      <UserActivityWrapper
        style={{ marginTop: AppTheme?.WP(4), marginLeft: AppTheme?.WP(2) }}
      >
        <ButtonAction
          end={true}
          title={`Upload ${
            isQuotation === 'checked' ? 'Quotation' : 'Document'
          }`}
          disabled={isLoading}
          onPress={onConfirm}
          border={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.15)}
          color={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.15)}
          loadingColor={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 1)}
          labelColor={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 1)}
        />
      </UserActivityWrapper>
    </ModalView>
  );
};

QuotationModel.propTypes = {
  visible: PropTypes.bool,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export { QuotationModel };
