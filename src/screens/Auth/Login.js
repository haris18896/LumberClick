import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Keyboard,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

// ** Utils
import { isObjEmpty, showToast } from '../../utils/utils';
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Third Party Packages
import * as Yup from 'yup';
import { useFormik } from 'formik';

// ** Custom Components
import {
  AuthActivityLabel,
  AuthActivityWrapper,
  AuthContainer,
  UserActivityWrapper,
} from '../../styles/screens';
import { CheckBox, TextInput } from '../../@core/components';
import { LayoutModel } from '../../@core/layout/LayoutModel';
import { LogoComponent } from '../../@core/components/logo';

// ** Store && Actions
import { useDispatch } from 'react-redux';
import { ButtonAction } from '../../components';
import { getData, removeData, setData } from '../../utils/constants';
import { navigateTo } from '../../navigation/utils';
import { LoginAction, UserMeAction } from '../../redux/Auth';
import { TextItem } from '../../styles/typography';
import { ColumCenter } from '../../styles/infrustucture';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  // ** Refs
  const email_ref = useRef(null);
  const password_ref = useRef(null);

  // ** Navigation
  const navigation = useNavigation();

  // ** Store
  const dispatch = useDispatch();

  // ** States
  const [isLoading, setIsLoading] = useState('');
  const [login_creds, setLoginCreds] = useState({});
  const [rememberMe, setRememberMe] = useState('checked');

  useEffect(() => {
    (async () => {
      if (rememberMe === 'checked') {
        const data = await getData('login_creds');
        setLoginCreds(JSON.parse(data));
      } else {
        setLoginCreds({});
      }
    })();
  }, [rememberMe]);

  // ** Schema
  const schema = Yup.object().shape({
    email: Yup.string().email().required('Email is a required field'),
    password: Yup.string().required('Password is a required field'),
  });

  const formik = useFormik({
    initialValues: {
      email: login_creds?.email || '', // haris-supplier@yopmail.com / haris-salesman@yopmail.com  / haris-customer@yopmail.com
      password: login_creds?.password || '', // Password@123
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async values => {
      if (isObjEmpty(formik.errors)) {
        setIsLoading('login_pending');
        dispatch(
          LoginAction({
            data: {
              email: values.email,
              password: values.password,
              is_mobile: true,
            },
            refreshing: () => {},
            errorCallback: () => {
              setIsLoading('');
            },
            callback: async res => {
              await setData('token', res?.token);
              dispatch(
                UserMeAction({
                  data: { token: res?.token },
                  refreshing: () => setIsLoading(''),
                  errorCallback: () => setIsLoading(''),
                  callback: async userMe => {
                    if (
                      ['Salesman', 'salesman', 'Customer', 'customer'].includes(
                        userMe?.role?.name,
                      )
                    ) {
                      navigateTo('AppStack', { role: userMe?.role?.name });
                    } else {
                      showToast({
                        type: 'info',
                        title: 'Not allowed',
                        message:
                          'Your are not allowed to login. Please contact admin.',
                      });
                      await removeData('token');
                    }
                  },
                }),
              );
            },
          }),
        );

        if (rememberMe === 'checked') {
          await setData('login_creds', JSON.stringify(values));
        }
      }
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.MainContainer}>
          <LayoutModel layoutBg={AppTheme?.DefaultPalette()?.common?.white}>
            <LogoComponent
              height={45}
              width={45}
              margin={{ top: 0, bottom: 2 }}
            />
            <AuthContainer
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              justifyContent={'flex-start'}
            >
              <ColumCenter>
                <TextItem
                  size={8}
                  weight={'regular'}
                  family={'PoppinsRegular'}
                  color={AppTheme?.DefaultPalette()?.grey?.[800]}
                >
                  Welcome
                </TextItem>
                <TextItem
                  size={8}
                  weight={'regular'}
                  family={'PoppinsRegular'}
                  color={AppTheme?.DefaultPalette()?.grey?.[800]}
                >
                  to{' '}
                  <TextItem
                    size={8}
                    weight={'medium'}
                    family={'PoppinsMedium'}
                    color={'#8cc63e'}
                  >
                    Lumber Click
                  </TextItem>
                </TextItem>
              </ColumCenter>

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
                nextInputRef={password_ref}
                placeholder={'Enter your email'}
                formikError={formik.errors?.email}
                formikTouched={formik.touched.email}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={text => formik.setFieldValue('email', text)}
                onBlur={() => formik.setFieldTouched('email', true)}
                onBlurChange={() => formik.setFieldTouched('email', true)}
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

              <AuthActivityWrapper mt={2} mb={8}>
                <CheckBox
                  disabled={false}
                  state={rememberMe}
                  label={'Remember me'}
                  color={AppTheme?.DefaultPalette()?.success?.main}
                  onPress={() =>
                    setRememberMe(prev =>
                      prev === 'checked' ? 'unchecked' : 'checked',
                    )
                  }
                  uncheckedColor={AppTheme?.DefaultPalette()?.primary?.light}
                />
                <Pressable
                  disabled={false}
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <AuthActivityLabel>Forgot your password?</AuthActivityLabel>
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
                  title={'Login'}
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
          </LayoutModel>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: AppTheme?.WP(Platform.OS === 'ios' ? 14 : 2),
    backgroundColor: AppTheme?.DefaultPalette()?.common?.white,
  },
  title: {
    paddingHorizontal: AppTheme?.WP(4),
    marginBottom: AppTheme?.WP(2),
  },
});

export { Login };
