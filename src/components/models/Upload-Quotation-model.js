import React from 'react';

// ** Utils
import {hexToRgba} from '../../utils/utils';
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {CheckBox, ModalView} from '../../@core/components';
import {TextItem} from '../../styles/typography';
import {ButtonAction} from '../buttons/ButtonAction';
import {UserActivityWrapper} from '../../styles/screens';
import {ColumCenter, ColumnStartCenter} from '../../styles/infrustucture';

const QuotationModel = ({
  title,
  visible,
  isLoading,
  onCancel,
  onConfirm,
  isQuotation,
  setIsQuotation,
}) => {
  return (
    <ModalView open={visible} title={title} toggleModal={onCancel}>
      <ColumCenter>
        <Icon
          name="information-outline"
          color={AppTheme?.DefaultPalette()?.primary?.main}
          size={AppTheme?.WP(10)}
        />
        <TextItem size={4} style={{textAlign: 'center'}}>
          {`Are you sure you want to upload ${
            isQuotation === 'checked' ? 'Quotation' : 'Document'
          }?`}
        </TextItem>
      </ColumCenter>

      <ColumnStartCenter>
        <CheckBox
          disabled={false}
          state={isQuotation ? 'checked' : 'unchecked'}
          label={'Upload Quotation'}
          onPress={setIsQuotation}
          color={AppTheme?.DefaultPalette()?.success?.main}
          uncheckedColor={AppTheme?.DefaultPalette()?.primary?.light}
        />
      </ColumnStartCenter>

      <UserActivityWrapper
        style={{marginTop: AppTheme?.WP(4), marginLeft: AppTheme?.WP(2)}}>
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

export {QuotationModel};
