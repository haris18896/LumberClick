import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Platform,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

// **  Utils
import {
  showToast,
  isObjEmpty,
  formatUSAPhoneNumber,
  getSuperModifiedValues,
  hexToRgba,
} from '../../utils/utils';
import { CommonStyles } from '../../utils/CommonStyles';
import { MAIN_URL, getData } from '../../utils/constants';
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Third Party Components
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

// ** Custom Components
import {
  ProfileImage,
  AuthContainer,
  UserProfileWrapper,
  ProfileImageWrapper,
  UserActivityWrapper,
} from '../../styles/screens';
import { appImages } from '../../assets';
import { Layout } from '../../@core/layout';
import { TextInput } from '../../@core/components';
import { TextItem } from '../../styles/typography';
import { BarHeader, ButtonAction } from '../../components';
import { ColumnStart, SpaceBetweenWrapper } from '../../styles/infrustucture';

// ** Store && Actions
import { UserMeAction, UpdateAccountAction } from '../../redux/Auth';

// ** SVGs
import PencilCircle from '../../assets/svgs/pencil-circle.svg';

const Profile = () => {
  // ** Params
  const route = useRoute();
  const biddingUser = route?.params?.biddingUser || '';

  // ** Refs
  const email_ref = useRef(null);
  const contact_ref = useRef(null);
  const last_name_ref = useRef(null);
  const first_name_ref = useRef(null);

  // ** navigation
  const navigation = useNavigation();

  // ** Store
  const dispatch = useDispatch();
  const { userMe } = useSelector(state => state?.auth);

  // ** States
  const [isLoading, setIsLoading] = useState('');

  // ** Schema
  const schema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email().required('Email is a required field'),
    contactNumber: Yup.string().required('Contact number is a required field'),
  });

  const initialValues = () => {
    if (isObjEmpty(biddingUser)) {
      return {
        firstName: userMe?.firstName || '',
        lastName: userMe?.lastName || '',
        email: userMe?.email || '',
        contactNumber: userMe?.contactNumber || '',
      };
    } else {
      return {
        firstName: biddingUser?.firstName || '',
        lastName: biddingUser?.lastName || '',
        email: biddingUser?.email || '',
        contactNumber: biddingUser?.contactNumber || '',
      };
    }
  };

  const formik = useFormik({
    initialValues: initialValues(),
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async values => {
      if (isObjEmpty(formik.errors)) {
        if (!isObjEmpty(getSuperModifiedValues(formik.initialValues, values))) {
          setIsLoading('updating');
          dispatch(
            UpdateAccountAction({
              data: {
                userId: userMe?._id,
                data: getSuperModifiedValues(formik.initialValues, values),
              },
              refreshing: () => setIsLoading(''),
              errorCallback: () => setIsLoading(''),
              callback: () => {
                navigation.goBack();
                showToast({
                  type: 'success',
                  title: 'Update',
                  message: 'Your profile has been updated!',
                });
              },
            }),
          );
        } else {
          showToast({
            type: 'info',
            title: 'No Updates',
            message: 'No Updates has been made to the fields!',
          });
        }
      }
    },
  });

  const isCurrentUser = useCallback(() => {
    if (isObjEmpty(biddingUser)) {
      if (Platform.OS === 'android') {
        (async () => {
          try {
            await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.CAMERA,
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);
          } catch (error) {
            showToast({
              type: 'error',
              title: 'Permission Error',
              message: error.message,
            });
          }
        })();
      }
    }
  }, [biddingUser]);

  useEffect(() => {
    return navigation.addListener('focus', isCurrentUser);
  }, [navigation, isCurrentUser]);

  const handleSelectOrTakePhoto = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        const file = {
          uri: image?.path,
          type: image?.mime,
          name: image?.filename || `profile_${Date.now()}.jpg`,
        };

        // Upload the image
        uploadProfileImage(file);
      })
      .catch(err => {
        showToast({
          title: 'Error in Image Selection',
          message: err.message,
          type: 'error',
        });
      });
  };

  const uploadProfileImage = async file => {
    setIsLoading('uploading_image');

    try {
      const accessToken = await getData('token');

      if (!accessToken) {
        setIsLoading('');
        showToast({
          title: 'Error',
          message: 'Authentication token not found',
          type: 'error',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      // Make the API call using fetch
      const response = await fetch(`${MAIN_URL}/user/updateProfile/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          accessToken: accessToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const responseData = await response.json();

      if (responseData.success) {
        setIsLoading('');
        showToast({
          title: 'Success',
          message: 'Profile image updated successfully!',
          type: 'success',
        });

        // Refresh user data to get the updated profile image
        dispatch(
          UserMeAction({
            data: {},
            refreshing: () => {},
            errorCallback: () => {},
            callback: () => {
              console.log('User data refreshed after image upload');
            },
          }),
        );
      } else {
        throw new Error(responseData.message || 'Upload failed');
      }
    } catch (error) {
      setIsLoading('');
      console.error('Upload error:', error);
      showToast({
        title: 'Upload Failed',
        message:
          error.message || 'Failed to upload profile image. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      > */}
      <View
        style={{
          flex: 1,
          paddingBottom: AppTheme?.WP(10),
          paddingHorizontal: AppTheme?.WP(4),
        }}
      >
        <View style={styles.MainContainer}>
          <BarHeader
            onPressBar={() => navigation.toggleDrawer()}
            user={{
              bg: AppTheme?.DefaultPalette()?.grey[100],
              marginBottom: 0,
              marginTop: 0,
              width: 11,
              height: 11,
            }}
          />
          {/* <Layout> */}
          <AuthContainer
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            justifyContent={'flex-start'}
            contentContainerStyle={styles.authContainer}
          >
            <UserProfileWrapper>
              <ProfileImageWrapper
                marginBottom={2}
                marginTop={2}
                style={CommonStyles.shadow}
              >
                {isObjEmpty(biddingUser) && (
                  <TouchableOpacity
                    style={[
                      styles.EditButton,
                      isLoading === 'uploading_image' && styles.disabledButton,
                    ]}
                    disabled={isLoading === 'uploading_image'}
                    onPress={() => handleSelectOrTakePhoto()}
                  >
                    {isLoading === 'uploading_image' ? (
                      <ActivityIndicator
                        size="small"
                        color={AppTheme?.DefaultPalette()?.primary?.main}
                      />
                    ) : (
                      <PencilCircle
                        width={AppTheme?.WP(8)}
                        height={AppTheme?.WP(8)}
                        color={AppTheme?.DefaultPalette()?.primary?.main}
                      />
                    )}
                  </TouchableOpacity>
                )}
                <ProfileImage
                  source={
                    userMe?.profileImage && isObjEmpty(biddingUser)
                      ? { uri: userMe?.profileImage }
                      : appImages?.Logo
                  }
                  resizeMode={'cover'}
                />
                {isLoading === 'uploading_image' && (
                  <View style={styles.imageLoadingOverlay}>
                    <ActivityIndicator
                      size="large"
                      color={AppTheme?.DefaultPalette()?.primary?.main}
                    />
                  </View>
                )}
              </ProfileImageWrapper>
              <TextItem
                style={{ textTransform: 'capitalize' }}
                color={AppTheme?.DefaultPalette()?.text?.primary}
                size={7}
              >
                {isObjEmpty(biddingUser)
                  ? `${userMe?.firstName} ${userMe?.lastName}`
                  : `${biddingUser?.firstName} ${biddingUser?.lastName}`}
              </TextItem>

              <TextItem
                style={{ textTransform: 'capitalize' }}
                color={AppTheme?.DefaultPalette()?.text?.primary}
                size={4}
              >
                {isObjEmpty(biddingUser)
                  ? userMe?.role?.name
                  : biddingUser?.role?.name}
              </TextItem>
            </UserProfileWrapper>
            <SpaceBetweenWrapper>
              <TextInput
                width={'48%'}
                ref={first_name_ref}
                multiline={false}
                disabled={!isObjEmpty(biddingUser)}
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
                width={'48%'}
                ref={last_name_ref}
                multiline={false}
                disabled={!isObjEmpty(biddingUser)}
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
                nextInputRef={email_ref}
                value={formik.values.lastName}
                placeholder={'Enter your last name'}
                formikError={formik.errors?.lastName}
                formikTouched={formik.touched.lastName}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={text => formik.setFieldValue('lastName', text)}
                onBlur={() => formik.setFieldTouched('lastName', true)}
              />
            </SpaceBetweenWrapper>
            <TextInput
              ref={email_ref}
              multiline={false}
              disabled={!isObjEmpty(biddingUser)}
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

            <View style={{ paddingBottom: AppTheme?.WP(30) }}>
              <TextInput
                maxLength={10}
                ref={contact_ref}
                multiline={false}
                disabled={!isObjEmpty(biddingUser)}
                leftIcon={'phone'}
                title={'Contact Number'}
                variant={'outlined'}
                inputMode={'decimal'}
                returnKeyType={'done'}
                styleData={{
                  labelStyles: {
                    weight: 'medium',
                    color: AppTheme?.DefaultPalette()?.text?.title,
                  },
                }}
                secureTextEntry={false}
                value={formik.values.contactNumber}
                placeholder={'Enter your contact number'}
                formikError={formik.errors?.contactNumber}
                formikTouched={formik.touched.contactNumber}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={text =>
                  formik.setFieldValue('contactNumber', text)
                }
                onBlur={() => {
                  formik.setFieldTouched('contactNumber', true);
                  if (formik.values.contactNumber.length >= 10) {
                    formik.setFieldValue(
                      'contactNumber',
                      formatUSAPhoneNumber(formik.values.contactNumber),
                    );
                  }
                }}
                submit={() => {
                  if (isObjEmpty(formik.errors)) {
                    formik.handleSubmit();
                  }
                }}
              />
            </View>
          </AuthContainer>

          {/* </Layout> */}
        </View>

        {isObjEmpty(biddingUser) && (
          <>
            <ButtonAction
              start={3}
              radius={2}
              title={'Payment Methods'}
              border={'transparent'}
              icon={{
                name: 'credit-card',
                size: 6,
                color: AppTheme?.DefaultPalette()?.success?.main,
              }}
              onPress={() => navigation.navigate('PaymentsScreen')}
              color={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.1)}
              labelColor={AppTheme.DefaultPalette().success.main}
              loadingColor={AppTheme.DefaultPalette().success.white}
            />
          </>
        )}

        {isObjEmpty(biddingUser) && (
          <UserActivityWrapper
            style={styles.buttonsWrapper}
            direction={'column'}
            alignItems={'flex-end'}
            justifyContent={'flex-end'}
          >
            <ButtonAction
              end={true}
              title={'Update'}
              titleWeight={'bold'}
              loading={isLoading === 'updating'}
              onPress={() => formik.handleSubmit()}
              border={AppTheme?.DefaultPalette()?.success?.main}
              color={AppTheme?.DefaultPalette()?.success?.main}
              labelColor={AppTheme.DefaultPalette().common.white}
              loadingColor={AppTheme.DefaultPalette().common.white}
              disabled={
                !isObjEmpty(formik.errors) ||
                ['updating', 'uploading_image'].includes(isLoading)
              }
            />
          </UserActivityWrapper>
        )}
      </View>
      {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform?.OS === 'ios' ? AppTheme?.WP(14) : AppTheme?.WP(4),
    // backgroundColor: 'white',
  },
  authContainer: {
    paddingBottom: AppTheme?.WP(15),
  },
  EditButton: {
    zIndex: 10,
    position: 'absolute',
    borderRadius: AppTheme?.WP(10),
    width: AppTheme?.WP(8),
    height: AppTheme?.WP(8),
    bottom: 0,
    right: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: AppTheme?.WP(20),
  },
  PaymentButton: {
    marginTop: AppTheme?.WP(2),
    marginBottom: AppTheme?.WP(1),
  },
  PaymentButtonLabel: {
    paddingBottom: AppTheme?.WP(1),
    paddingLeft: AppTheme?.WP(1),
  },
});

export default Profile;
