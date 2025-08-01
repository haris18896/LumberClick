import React, { useState } from 'react';
import {
  View,
  Keyboard,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

// ** Utils
import { theme as AppTheme } from '../../@core/infrustructure/theme';
import { FormikValuesChanged, isObjEmpty, showToast } from '../../utils/utils';

// ** Third Party Packages
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';

// ** Custom Components
import { HeadingDetails, TextInput } from '../../@core/components';
import { AuthContainer, UserActivityWrapper } from '../../styles/screens';

// ** Store && Actions
import { useDispatch } from 'react-redux';
import { ButtonAction } from '../../components';
import { TextItem } from '../../styles/typography';
import { ForgotPasswordAction } from '../../redux/Auth';
import { BackButton } from '../../components/buttons/BackButton';
import { LayoutArea, RowCenter } from '../../styles/infrustucture';

const ForgotPassword = () => {
  // ** Navigation
  const navigation = useNavigation();

  // ** Store
  const dispatch = useDispatch();

  // ** States
  const [isLoading, setIsLoading] = useState('');

  // ** Schema
  const schema = Yup.object().shape({
    email: Yup.string().email().required('Email is a required field'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async values => {
      if (isObjEmpty(formik.errors)) {
        setIsLoading('sending_email_pending');

       
      }
    },
  });

  return (
    <View style={styles.MainContainer}>
      <BackButton
        size={6}
        onPress={() => navigation.goBack()}
        icon={'arrow-left'}
        iconColor={'white'}
        bg={'transparent'}
        customStyles={{
          marginLeft: AppTheme?.WP(4),
        }}
      />
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={false}
        hidden={false}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1 }}>
          <RowCenter>
            <TextItem size={8} weight={'medium'} color={'white'}>
              Forgot Password
            </TextItem>
          </RowCenter>

          <LayoutArea
            bg={AppTheme?.DefaultPalette()?.success?.main}
            style={{ marginTop: AppTheme?.WP(4) }}
          >
            <View style={styles.container}>
              <AuthContainer
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}
              >
                <HeadingDetails
                  customStyles={{ marginBottom: AppTheme?.WP(5) }}
                  justifyContent={'center'}
                  heading={' '}
                  description={
                    'Enter your email to receive a reset password email'
                  }
                  details={{
                    description: {
                      size: '5',
                      weight: 'regular',
                      family: 'PoppinsRegular',
                    },
                    customStyles: {
                      description: {
                        marginBottom: AppTheme?.WP(2),
                        textAlign: 'center',
                      },
                    },
                  }}
                />
                <TextInput
                  multiline={false}
                  disabled={false}
                  leftIcon={'email'}
                  title={'Email'}
                  variant={'outlined'}
                  inputMode={'email'}
                  returnKeyType={'done'}
                  styleData={{
                    labelStyles: {
                      weight: 'medium',
                      color: AppTheme?.DefaultPalette()?.text?.title,
                    },
                  }}
                  secureTextEntry={false}
                  value={formik.values.email}
                  placeholder={'Enter your email'}
                  submit={() => {
                    formik.handleSubmit();
                    Keyboard.dismiss();
                  }}
                  formikError={formik.errors?.email}
                  formikTouched={formik.touched.email}
                  onBlur={() => formik.setFieldTouched('email', true)}
                  placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                  onChangeText={text => formik.setFieldValue('email', text)}
                />
              </AuthContainer>
              <UserActivityWrapper
                style={styles.buttonsWrapper}
                direction={'column'}
                alignItems={'flex-end'}
                justifyContent={'flex-end'}
              >
                <ButtonAction
                  end={true}
                  title={'Next'}
                  titleWeight={'bold'}
                  onPress={() => formik.handleSubmit()}
                  loading={isLoading === 'sending_email_pending'}
                  color={AppTheme?.DefaultPalette()?.success?.main}
                  labelColor={AppTheme.DefaultPalette().common.white}
                  loadingColor={AppTheme.DefaultPalette().common.white}
                  disabled={
                    FormikValuesChanged(formik.initialValues, formik.values) ||
                    !isObjEmpty(formik.errors)
                  }
                />
              </UserActivityWrapper>
            </View>

            {/* <SafeArea background={'white'}>
              <LayoutContainer marginTop={7} bg={'white'} />
            </SafeArea> */}
          </LayoutArea>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: AppTheme?.WP(14),
    backgroundColor: AppTheme?.DefaultPalette()?.success?.main,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: AppTheme?.WP(10),
    borderTopRightRadius: AppTheme?.WP(10),
    paddingBottom: AppTheme?.WP(10),
    paddingHorizontal: AppTheme?.WP(4),
  },
  title: {
    paddingHorizontal: AppTheme?.WP(4),
    marginBottom: AppTheme?.WP(2),
  },
});

export { ForgotPassword };
