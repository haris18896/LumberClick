import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party
import PropTypes from 'prop-types';

// ** Custom Components
import {TextItem} from '../../styles/typography';
import {SearchBar} from '../../styles/screens/Jobs';
import {ButtonAction} from '../buttons/ButtonAction';
import {UserActivityWrapper} from '../../styles/screens';
import {ModalView, TextInput, CheckBox} from '../../@core/components';
import {
  AttachmentWrapper,
  ColumnStart,
  RowEnd,
  RowStart,
} from '../../styles/infrustucture';

const JobSubmissionModal = ({title, visible, onCancel, onConfirm}) => {
  // ** States
  const [description, setDescription] = useState('');

  // ** Refs
  const job_title_ref = useRef(null);

  const checklist = [
    {
      id: 1,
      name: 'Floorplan',
    },
    {
      id: 2,
      name: 'Architecture Drawings',
    },
  ];

  return (
    <ModalView open={visible} title={title} toggleModal={onCancel}>
      <ColumnStart style={{paddingLeft: AppTheme?.WP(1)}}>
        <TextItem size={3.5} color={AppTheme?.DefaultPalette()?.text?.primary}>
          Customer: <TextItem size={3.6}>Oliver Queen</TextItem>
        </TextItem>
      </ColumnStart>
      <ColumnStart style={styles.jobTitle}>
        <SearchBar>
          <TextInput
            height={AppTheme?.WP(25)}
            maxLength={400}
            value={description}
            title={'Description'}
            ref={job_title_ref}
            multiline={true}
            variant={'outlined'}
            inputMode={'text'}
            returnKeyType={'done'}
            secureTextEntry={false}
            placeholder={'Description...'}
            placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
            onChangeText={text => {
              setDescription(text);
            }}
            styleData={{
              labelStyles: {
                weight: 'medium',
                family: 'PoppinsMedium',
                color: AppTheme?.DefaultPalette()?.grey[800],
              },
            }}
            submit={() => onConfirm({description})}
          />
        </SearchBar>
      </ColumnStart>

      <ColumnStart>
        <TextItem size={3.5} color={AppTheme?.DefaultPalette()?.grey[800]}>
          Attachment
        </TextItem>
        <AttachmentWrapper>
          <TextItem size={3.5} color={AppTheme?.DefaultPalette()?.grey[800]}>
            Upload your file
          </TextItem>
        </AttachmentWrapper>
      </ColumnStart>

      <ColumnStart style={{marginTop: AppTheme?.WP(4)}}>
        <TextItem
          style={{marginBottom: AppTheme?.WP(1)}}
          size={3.5}
          color={AppTheme?.DefaultPalette()?.grey[800]}>
          Checklist
        </TextItem>

        {checklist.map((item, index) => (
          <TextItem
            style={styles.checklistItem}
            size={3}
            key={index}
            weight={'regular'}
            family={'PoppinsRegular'}
            color={AppTheme?.DefaultPalette()?.grey[700]}>
            {item?.id} - {item?.name}
          </TextItem>
        ))}
      </ColumnStart>

      <RowEnd style={{marginTop: AppTheme?.WP(4)}}>
        <UserActivityWrapper width={'35%'}>
          <ButtonAction
            size={'small'}
            end={true}
            title={'Cancel'}
            onPress={onCancel}
            border={AppTheme.DefaultPalette().grey[500]}
            color={AppTheme.DefaultPalette().grey[500]}
            loadingColor={AppTheme.DefaultPalette().common?.white}
            labelColor={AppTheme.DefaultPalette().common?.white}
          />
        </UserActivityWrapper>

        <UserActivityWrapper
          width={'35%'}
          style={{marginLeft: AppTheme?.WP(2)}}>
          <ButtonAction
            end={true}
            size={'small'}
            title={'Submit Job'}
            disabled={!description}
            onPress={() => {
              onConfirm({description});
            }}
            border={AppTheme.DefaultPalette().primary.main}
            color={AppTheme.DefaultPalette().primary.main}
            loadingColor={AppTheme.DefaultPalette().common?.white}
            labelColor={AppTheme.DefaultPalette().common?.white}
          />
        </UserActivityWrapper>
      </RowEnd>
    </ModalView>
  );
};

JobSubmissionModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

const styles = StyleSheet.create({
  jobTitle: {
    marginTop: AppTheme?.WP(3),
  },
  checklistItem: {
    paddingLeft: AppTheme?.WP(2),
    paddingBottom: AppTheme?.WP(1),
  },
});

export {JobSubmissionModal};
