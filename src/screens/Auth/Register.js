import React, {useRef, useState} from 'react';
import {
  View,
  Keyboard,
  Platform,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';

// ** Utils
import {
  formatUSAPhoneNumber,
  FormikValuesChanged,
  isObjEmpty,
} from '../../utils/utils';
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Packages
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';

// ** Custom Components
import {
  AuthActivityLabel,
  AuthActivityWrapper,
  AuthContainer,
  UserActivityWrapper,
} from '../../styles/screens';
import {HeadingDetails, TextInput} from '../../@core/components';
import {LayoutModel} from '../../@core/layout/LayoutModel';
import {LogoComponent} from '../../@core/components/logo';

// ** Store && Actions
import {useDispatch} from 'react-redux';
import {ButtonAction} from '../../components';
import {BackButton} from '../../components/buttons/BackButton';

const Register = () => {
  // ** Refs
  const first_name_ref = useRef(null);
  const last_name_ref = useRef(null);
  const email_ref = useRef(null);
  const password_ref = useRef(null);
  const contact_ref = useRef(null);

  // ** Navigation
  const navigation = useNavigation();

  // ** Store
  const dispatch = useDispatch();

  // ** States
  const [isLoading, setIsLoading] = useState('');

  // ** Schema
  const schema = Yup.object().shape({
    firstName: Yup.string().required('First Name is a required field'),
    lastName: Yup.string().required('Last Name is a required field'),
    email: Yup.string().email().required('Email is a required field'),
    contact: Yup.string().required('Contact number is a required field'),
    password: Yup.string().required('Password is a required field'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async values => {
      if (isObjEmpty(formik.errors)) {
        console.log('Register Values...', values);
        navigation.navigate('Login');
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <LayoutModel MT={7}>
            <AuthContainer
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}>
              <HeadingDetails
                customStyles={{marginBottom: AppTheme?.WP(5)}}
                justifyContent={'flex-start'}
                heading={''}
                description={'Please add the following information to continue'}
                details={{
                  description: {
                    size: '5',
                    weight: 'regular',
                    family: 'PoppinsRegular',
                  },
                  customStyles: {
                    description: {
                      marginBottom: AppTheme?.WP(2),
                    },
                  },
                }}
              />
              <TextInput
                ref={first_name_ref}
                multiline={false}
                disabled={false}
                leftIcon={'account'}
                title={'First Name'}
                variant={'outlined'}
                inputMode={'text'}
                returnKeyType={'next'}
                styleData={{
                  labelStyles: {
                    weight: 'medium',
                    color: AppTheme?.DefaultPalette()?.text?.title,
                  },
                }}
                secureTextEntry={false}
                value={formik.values.firstName}
                nextInputRef={last_name_ref}
                placeholder={'Enter your first name'}
                formikError={formik.errors?.firstName}
                formikTouched={formik.touched.firstName}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={text => formik.setFieldValue('firstName', text)}
                onBlur={() => formik.setFieldTouched('firstName', true)}
              />

              <TextInput
                ref={last_name_ref}
                multiline={false}
                disabled={false}
                leftIcon={'account'}
                title={'Last Name'}
                variant={'outlined'}
                inputMode={'text'}
                returnKeyType={'next'}
                styleData={{
                  labelStyles: {
                    weight: 'medium',
                    color: AppTheme?.DefaultPalette()?.text?.title,
                  },
                }}
                secureTextEntry={false}
                value={formik.values.lastName}
                nextInputRef={email_ref}
                placeholder={'Enter your last name'}
                formikError={formik.errors?.lastName}
                formikTouched={formik.touched.lastName}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={text => formik.setFieldValue('lastName', text)}
                onBlur={() => formik.setFieldTouched('lastName', true)}
              />

              <TextInput
                ref={email_ref}
                multiline={false}
                disabled={false}
                leftIcon={'email'}
                title={'Email'}
                variant={'outlined'}
                inputMode={'email'}
                returnKeyType={'next'}
                styleData={{
                  labelStyles: {
                    weight: 'medium',
                    color: AppTheme?.DefaultPalette()?.text?.title,
                  },
                }}
                secureTextEntry={false}
                value={formik.values.email}
                nextInputRef={contact_ref}
                placeholder={'Enter your email'}
                formikError={formik.errors?.email}
                formikTouched={formik.touched.email}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={text => formik.setFieldValue('email', text)}
                onBlur={() => formik.setFieldTouched('email', true)}
              />

              <TextInput
                maxLength={10}
                ref={contact_ref}
                multiline={false}
                disabled={false}
                leftIcon={'phone'}
                title={'Contact Number'}
                variant={'outlined'}
                inputMode={'decimal'}
                returnKeyType={'next'}
                styleData={{
                  labelStyles: {
                    weight: 'medium',
                    color: AppTheme?.DefaultPalette()?.text?.title,
                  },
                }}
                secureTextEntry={false}
                value={formik.values.contact}
                nextInputRef={password_ref}
                placeholder={'+1 234 867 1234'}
                formikError={formik.errors?.contact}
                formikTouched={formik.touched.contact}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={text => formik.setFieldValue('contact', text)}
                onBlur={() => {
                  formik.setFieldTouched('contact', true);
                  if (formik.values.contact.length >= 10) {
                    formik.setFieldValue(
                      'contact',
                      formatUSAPhoneNumber(formik.values.contact),
                    );
                  }
                }}
              />

              <TextInput
                disabled={false}
                multiline={false}
                ref={password_ref}
                title={'Password'}
                variant={'outlined'}
                secureTextEntry={true}
                returnKeyType={'done'}
                leftIcon={'lock'}
                value={formik.values.password}
                placeholder={'**************'}
                formikError={formik.errors.password}
                formikTouched={formik.touched.password}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={text => formik.setFieldValue('password', text)}
                onBlur={() => formik.setFieldTouched('password', true)}
                styleData={{
                  labelStyles: {
                    weight: 'medium',
                    color: AppTheme?.DefaultPalette()?.text?.title,
                  },
                }}
                submit={() => {
                  if (isObjEmpty(formik.errors)) {
                    formik.handleSubmit();
                  }
                }}
              />

              <AuthActivityWrapper justifyContent={'flex-end'} mt={2} mb={8}>
                <Pressable
                  disabled={false}
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate('Login')}>
                  <AuthActivityLabel
                    color={AppTheme?.DefaultPalette()?.text?.title}>
                    Already have an account?{' '}
                    <AuthActivityLabel>Login</AuthActivityLabel>
                  </AuthActivityLabel>
                </Pressable>
              </AuthActivityWrapper>
            </AuthContainer>
            <UserActivityWrapper
              style={styles.buttonsWrapper}
              direction={'column'}
              alignItems={'flex-end'}
              justifyContent={'flex-end'}>
              <ButtonAction
                end={true}
                title={'Sign Up'}
                titleWeight={'bold'}
                loading={isLoading === 'login_pending'}
                onPress={() => formik.handleSubmit()}
                border={AppTheme?.DefaultPalette()?.buttons?.primary}
                color={AppTheme?.DefaultPalette()?.buttons?.primary}
                labelColor={AppTheme.DefaultPalette().common.white}
                loadingColor={AppTheme.DefaultPalette().common.white}
                disabled={
                  FormikValuesChanged(formik.initialValues, formik.values) ||
                  !isObjEmpty(formik.errors)
                }
              />
            </UserActivityWrapper>
          </LayoutModel>
        </KeyboardAvoidingView>
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
  title: {
    paddingHorizontal: AppTheme?.WP(4),
    marginBottom: AppTheme?.WP(2),
  },
});

export {Register};
