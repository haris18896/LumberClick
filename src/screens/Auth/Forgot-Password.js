import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Keyboard,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
  TouchableOpacity,
} from 'react-native';

// ** Utils
import { isObjEmpty, showToast } from '../../utils/utils';
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Third Party Packages
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// ** Custom Components
import {
  AuthActivityLabel,
  AuthActivityWrapper,
  AuthContainer,
  UserActivityWrapper,
} from '../../styles/screens';
import { TextInput } from '../../@core/components';
import { LogoComponent } from '../../@core/components/logo';

// ** Store && Actions
import { useDispatch } from 'react-redux';
import { ButtonAction } from '../../components';
import { getData, removeData, setData } from '../../utils/constants';
import { navigateTo } from '../../navigation/utils';
import {
  ForgotPasswordAction,
  LoginAction,
  UserMeAction,
} from '../../redux/Auth';
import { TextItem } from '../../styles/typography';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  // ** Refs
  const email_ref = useRef(null);
  const password_ref = useRef(null);

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
        setIsLoading('login_pending');
        dispatch(
          ForgotPasswordAction({
            data: {
              email: values.email,
            },
            refreshing: () => setIsLoading(''),
            callback: () => {
              navigation.navigate('Login');
              showToast({
                type: 'success',
                title: 'Email sent successfully',
                message: 'Kindly check your email to reset your password',
              });
            },
            errorCallback: err => {
              setIsLoading('');
              console.log('error ForgotPasswordAction...', err);
            },
          }),
        );
      }
    },
  });

  console.log('formik errors : ', formik.errors);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.MainContainer}>
          <View style={styles.logoContainer}>
            <LogoComponent
              height={25}
              width={25}
              margin={{ top: 0, bottom: 2 }}
            />

            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="chevron-left"
                size={AppTheme?.WP(10)}
                color={AppTheme?.DefaultPalette()?.text?.title}
              />
            </TouchableOpacity>
          </View>

          <AuthContainer
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            justifyContent={'flex-start'}
          >
            <TextItem
              size={5}
              style={{ textAlign: 'center' }}
              weight={'regular'}
              family={'PoppinsRegular'}
              color={AppTheme?.DefaultPalette()?.grey?.[800]}
            >
              Enter your email to receive a reset password email
            </TextItem>

            <TextInput
              ref={email_ref}
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
              formikError={formik.errors?.email}
              formikTouched={formik.touched.email}
              placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
              onChangeText={text => formik.setFieldValue('email', text)}
              onBlur={() => formik.setFieldTouched('email', true)}
              onBlurChange={() => formik.setFieldTouched('email', true)}
              submit={() => {
                if (isObjEmpty(formik.errors)) {
                  formik.handleSubmit();
                }
              }}
            />

            <AuthActivityWrapper mt={2} mb={8} justifyContent={'flex-end'}>
              <Pressable
                disabled={false}
                style={styles.forgotPasswordButton}
                onPress={() => navigation.goBack()}
              >
                <AuthActivityLabel>Back to Login</AuthActivityLabel>
              </Pressable>
            </AuthActivityWrapper>

            <UserActivityWrapper
              style={styles.buttonsWrapper}
              direction={'column'}
              alignItems={'flex-end'}
              justifyContent={'flex-end'}
            >
              <ButtonAction
                end={true}
                title={'ForgotPassword'}
                titleWeight={'bold'}
                border={'transparent'}
                loading={isLoading === 'login_pending'}
                onPress={() => formik.handleSubmit()}
                color={AppTheme?.DefaultPalette()?.success?.main}
                labelColor={AppTheme.DefaultPalette().common.white}
                loadingColor={AppTheme.DefaultPalette().common.white}
                disabled={!isObjEmpty(formik.errors)}
              />
            </UserActivityWrapper>
          </AuthContainer>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: AppTheme?.WP(Platform.OS === 'ios' ? 14 : 10),
    backgroundColor: AppTheme?.DefaultPalette()?.common?.white,
  },
  logoContainer: {
    position: 'relative',
  },
  title: {
    paddingHorizontal: AppTheme?.WP(4),
    marginBottom: AppTheme?.WP(2),
  },
  backIcon: {
    position: 'absolute',
    left: AppTheme?.WP(4),
    top: AppTheme?.WP(8),
  },
});

export { ForgotPassword };
