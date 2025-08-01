import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party
import * as Yup from 'yup';
import {useFormik} from 'formik';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {
  ModalView,
  TextInput,
  CheckBox,
  DropDown,
  Switch,
} from '../../@core/components';
import {TextItem} from '../../styles/typography';
import {
  ColumnStart,
  RowEnd,
  RowStart,
  SpaceBetweenWrapper,
} from '../../styles/infrustucture';
import {hexToRgba, isObjEmpty} from '../../utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {getMyCustomersAPI, registerCustomerAPI} from '../../redux/settings';

const InitiateJobModel = ({
  title,
  visible,
  onCancel,
  onConfirm,
  addJobPending,
}) => {
  // ** Store
  const dispatch = useDispatch();
  const {userMe} = useSelector(state => state.auth);

  const job_title_ref = useRef(null);
  const first_name_ref = useRef(null);
  const last_name_ref = useRef(null);
  const email_ref = useRef(null);
  const contact_number_ref = useRef(null);
  const takeoffs_ref = useRef([]);

  // ** States
  const [jobTitle, setJobTitle] = useState('');
  const [takeoffs, setTakeoffs] = useState(['']);
  const [paymentBy, setPaymentBy] = useState('');
  const [customer, setCustomer] = useState({label: 'No Customer', value: ''});
  const [hardware, setHardware] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [hoverServices, setHoverServices] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);

  // ** Takeoffs Functions
  const addTakeoff = () => {
    setTakeoffs(prev => [...prev, '']);
  };

  const removeTakeoff = index => {
    if (takeoffs.length > 1) {
      setTakeoffs(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateTakeoff = (index, value) => {
    setTakeoffs(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  // ** Helper function to check if takeoffs are valid
  const isValidTakeoffs = () => {
    return takeoffs.some(takeoff => takeoff.trim() !== '');
  };

  // ** Queries
  const getMyCustomers = useCallback(() => {
    return new Promise((resolve, reject) => {
      dispatch(
        getMyCustomersAPI({
          data: {id: userMe?.supplier},
          refreshing: () => {},
          callback: data => {
            const dataModified = data?.users?.map(user => ({
              label: `${user?.firstName} ${user?.lastName}`,
              value: user?._id,
            }));
            setCustomers([
              {
                label: 'No Customer',
                value: '',
              },
              ...dataModified,
            ]);
            resolve(true);
          },
          errorCallback: () => {
            reject(false);
          },
        }),
      );
    });
  }, [userMe?.supplier, dispatch]);

  useEffect(() => {
    getMyCustomers();
  }, [getMyCustomers]);

  // Yup validation schema
  const newCustomerSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    contactNumber: Yup.string()
      .max(10, 'Contact Number must be less than 10 characters')
      .required('Contact Number is required'),
  });

  // Formik for Add Customer
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
    },
    validationSchema: newCustomerSchema,
    onSubmit: values => {
      setIsLoading(true);
      dispatch(
        registerCustomerAPI({
          data: values,
          refreshing: () => setIsLoading(false),
          errorCallback: () => {
            setIsLoading(false);
          },
          callback: async data => {
            await getMyCustomers();
            setAddCustomerModal(false);
            formik.resetForm();
            setIsLoading(false);
          },
        }),
      );
    },
  });

  const HandleReset = () => {
    setJobTitle('');
    setCustomer(null);
    setPaymentBy('');
    setHoverServices(false);
    setHardware(false);
    setTakeoffs(['']);
  };

  return (
    <>
      <ModalView open={visible} title={title} toggleModal={onCancel}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ColumnStart style={styles.section}>
              <TextInput
                title={'Job Title *'}
                value={jobTitle}
                ref={job_title_ref}
                multiline={false}
                variant={'outlined'}
                inputMode={'done'}
                placeholder={'Enter job title'}
                placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                onChangeText={setJobTitle}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
                onSubmit={() => {
                  Keyboard.dismiss();
                }}
                styleData={{
                  labelStyles: {
                    weight: 'medium',
                    color: AppTheme?.DefaultPalette()?.text?.title,
                  },
                }}
              />
            </ColumnStart>

            <ColumnStart style={styles.section}>
              <RowStart style={styles.inputTitle}>
                <TextItem
                  color={AppTheme?.DefaultPalette()?.grey[700]}
                  size={3.3}
                  weight="medium"
                  style={styles.label}>
                  Takeoffs *
                </TextItem>
                <TouchableOpacity
                  onPress={addTakeoff}
                  style={styles.addCustomerBtn}>
                  <Icon
                    name="plus-circle"
                    size={18}
                    color={AppTheme?.DefaultPalette()?.success?.main}
                  />
                  <TextItem
                    size={3.2}
                    color={AppTheme?.DefaultPalette()?.success?.main}
                    style={{marginLeft: 4}}>
                    Add Takeoffs
                  </TextItem>
                </TouchableOpacity>
              </RowStart>

              {takeoffs.map((takeoff, index) => (
                <RowStart key={index} style={{marginBottom: AppTheme?.WP(2)}}>
                  <TextInput
                    width={takeoffs.length === 1 ? '100%' : '90%'}
                    value={takeoff}
                    ref={ref => {
                      if (takeoffs_ref.current) {
                        takeoffs_ref.current[index] = ref;
                      }
                    }}
                    multiline={false}
                    variant={'outlined'}
                    inputMode={'done'}
                    placeholder={'Structure Name'}
                    placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                    onChangeText={value => updateTakeoff(index, value)}
                    onBlur={() => {
                      Keyboard.dismiss();
                    }}
                    onSubmit={() => {
                      Keyboard.dismiss();
                    }}
                    styleData={{
                      labelStyles: {
                        weight: 'medium',
                        color: AppTheme?.DefaultPalette()?.text?.title,
                      },
                    }}
                  />

                  {takeoffs.length > 1 && (
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => removeTakeoff(index)}>
                      <Icon
                        name="delete"
                        size={AppTheme?.WP(6)}
                        color={AppTheme?.DefaultPalette()?.error?.main}
                      />
                    </TouchableOpacity>
                  )}
                </RowStart>
              ))}
            </ColumnStart>

            <ColumnStart style={styles.section}>
              <RowStart style={styles.inputTitle}>
                <TextItem
                  color={AppTheme?.DefaultPalette()?.grey[700]}
                  size={3.3}
                  weight="medium"
                  style={styles.label}>
                  Customer *
                </TextItem>
                <TouchableOpacity
                  onPress={() => setAddCustomerModal(true)}
                  style={styles.addCustomerBtn}>
                  <Icon
                    name="plus-circle"
                    size={18}
                    color={AppTheme?.DefaultPalette()?.success?.main}
                  />
                  <TextItem
                    size={3.2}
                    color={AppTheme?.DefaultPalette()?.success?.main}
                    style={{marginLeft: 4}}>
                    Add Customer
                  </TextItem>
                </TouchableOpacity>
              </RowStart>

              <View style={{width: '100%', marginTop: AppTheme?.WP(2)}}>
                <DropDown
                  data={customers}
                  value={customer}
                  setValue={option => {
                    if (option?.value === '') {
                      setPaymentBy('salesman');
                    }
                    setCustomer(option);
                  }}
                  placeholder={'Select Customer...'}
                />
              </View>
            </ColumnStart>

            <ColumnStart style={styles.section}>
              <TextItem size={3.7} weight="medium" style={styles.label}>
                Payment By *
              </TextItem>
              <RowStart>
                <CheckBox
                  state={paymentBy === 'customer' ? 'checked' : 'unchecked'}
                  label={'Customer'}
                  disabled={!customer?.value}
                  color={AppTheme?.DefaultPalette()?.primary?.main}
                  onPress={() => setPaymentBy('customer')}
                  uncheckedColor={AppTheme?.DefaultPalette()?.primary?.light}
                />
                <CheckBox
                  state={paymentBy === 'salesman' ? 'checked' : 'unchecked'}
                  label={'Salesman'}
                  color={AppTheme?.DefaultPalette()?.primary?.main}
                  onPress={() => setPaymentBy('salesman')}
                  uncheckedColor={AppTheme?.DefaultPalette()?.primary?.light}
                />
              </RowStart>
            </ColumnStart>

            <ColumnStart style={styles.section}>
              <TextItem size={3.7} weight="medium" style={styles.label}>
                Hover Services
              </TextItem>
              <Switch
                value={hoverServices}
                onValueChange={setHoverServices}
                color={hexToRgba(
                  AppTheme?.DefaultPalette()?.success?.main,
                  0.4,
                )}
                thumbColor={hexToRgba(
                  AppTheme?.DefaultPalette()?.success?.main,
                  1,
                )}
              />

              {hoverServices && (
                <View style={styles.hoverServicesActive}>
                  <Icon
                    name="information"
                    size={AppTheme?.WP(5)}
                    color={AppTheme?.DefaultPalette()?.warning?.main}
                  />

                  <TextItem
                    style={{paddingLeft: AppTheme?.WP(2)}}
                    size={3.5}
                    color={AppTheme?.DefaultPalette()?.warning?.main}>
                    By enabling these services, you will be charged $150 for
                    this job.
                  </TextItem>
                </View>
              )}
            </ColumnStart>

            <ColumnStart style={styles.section}>
              <TextItem size={3.7} weight="medium" style={styles.label}>
                Others
              </TextItem>
              <CheckBox
                state={hardware ? 'checked' : 'unchecked'}
                label={'Hardware'}
                color={AppTheme?.DefaultPalette()?.primary?.main}
                onPress={() => setHardware(h => !h)}
                uncheckedColor={AppTheme?.DefaultPalette()?.primary?.light}
              />
            </ColumnStart>

            <RowEnd style={{marginTop: AppTheme?.WP(4)}}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <TextItem
                  size={3.5}
                  color={AppTheme?.DefaultPalette()?.grey[700]}>
                  Cancel
                </TextItem>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.addBtn,
                  !(jobTitle && paymentBy && isValidTakeoffs()) && {
                    opacity: 0.5,
                  },
                ]}
                disabled={
                  addJobPending || !(jobTitle && paymentBy && isValidTakeoffs())
                }
                onPress={() => {
                  // Filter out empty takeoffs before sending
                  const validTakeoffs = takeoffs.filter(
                    takeoff => takeoff.trim() !== '',
                  );
                  onConfirm({
                    jobTitle,
                    customer: customer?.value,
                    paymentBy,
                    hoverServices,
                    hardware,
                    takeoffs: validTakeoffs,
                  });
                }}>
                {addJobPending ? (
                  <ActivityIndicator size="small" color={'white'} />
                ) : (
                  <Icon name={'plus-circle'} size={18} color={'white'} />
                )}
                <TextItem size={3.5} color={'#fff'} weight="bold">
                  Add New Job
                </TextItem>
              </TouchableOpacity>
            </RowEnd>
          </ScrollView>
        </TouchableWithoutFeedback>
      </ModalView>

      {/* Add Customer Modal as a true Modal */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Modal
          visible={addCustomerModal}
          animationType="slide"
          transparent
          onRequestClose={() => {
            setAddCustomerModal(false);
            formik.resetForm();
          }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ModalView
              open={true}
              title={'Add New Customer'}
              toggleModal={() => {
                setAddCustomerModal(false);
                formik.resetForm();
              }}>
              <SpaceBetweenWrapper alignItems="flex-start">
                <TextInput
                  width={'48%'}
                  ref={first_name_ref}
                  multiline={false}
                  disabled={false}
                  title={'First Name'}
                  returnKeyType={'next'}
                  variant={'outlined'}
                  secureTextEntry={false}
                  value={formik.values.firstName}
                  nextInputRef={last_name_ref}
                  placeholder={'Enter first name'}
                  formikError={formik.errors?.firstName}
                  formikTouched={formik.touched.firstName}
                  placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                  onChangeText={text => formik.setFieldValue('firstName', text)}
                  onBlur={() => formik.setFieldTouched('firstName', true)}
                  onBlurChange={() => formik.setFieldTouched('firstName', true)}
                  styleData={{
                    labelStyles: {
                      weight: 'medium',
                      color: AppTheme?.DefaultPalette()?.text?.title,
                    },
                  }}
                />

                <TextInput
                  width={'48%'}
                  ref={last_name_ref}
                  multiline={false}
                  disabled={false}
                  title={'Last Name'}
                  returnKeyType={'next'}
                  variant={'outlined'}
                  secureTextEntry={false}
                  value={formik.values.lastName}
                  nextInputRef={email_ref}
                  placeholder={'Enter last name'}
                  formikError={formik.errors?.lastName}
                  formikTouched={formik.touched.lastName}
                  placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                  onChangeText={text => formik.setFieldValue('lastName', text)}
                  onBlur={() => formik.setFieldTouched('lastName', true)}
                  onBlurChange={() => formik.setFieldTouched('lastName', true)}
                  styleData={{
                    labelStyles: {
                      weight: 'medium',
                      color: AppTheme?.DefaultPalette()?.text?.title,
                    },
                  }}
                />
              </SpaceBetweenWrapper>

              <SpaceBetweenWrapper alignItems="flex-start">
                <TextInput
                  width={'48%'}
                  ref={email_ref}
                  multiline={false}
                  disabled={false}
                  title={'Email'}
                  returnKeyType={'next'}
                  variant={'outlined'}
                  secureTextEntry={false}
                  value={formik.values.email}
                  nextInputRef={contact_number_ref}
                  placeholder={'Enter email'}
                  formikError={formik.errors?.email}
                  formikTouched={formik.touched.email}
                  placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                  onChangeText={text => formik.setFieldValue('email', text)}
                  onBlur={() => formik.setFieldTouched('email', true)}
                  onBlurChange={() => formik.setFieldTouched('email', true)}
                  styleData={{
                    labelStyles: {
                      weight: 'medium',
                      color: AppTheme?.DefaultPalette()?.text?.title,
                    },
                  }}
                />

                <TextInput
                  width={'48%'}
                  ref={contact_number_ref}
                  multiline={false}
                  disabled={false}
                  maxLength={10}
                  inputMode={'tel'}
                  title={'Contact Number'}
                  returnKeyType={'done'}
                  variant={'outlined'}
                  secureTextEntry={false}
                  value={formik.values.contactNumber}
                  placeholder={'Enter contact number'}
                  formikError={formik.errors?.contactNumber}
                  formikTouched={formik.touched.contactNumber}
                  placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
                  onChangeText={text =>
                    formik.setFieldValue('contactNumber', text)
                  }
                  onBlur={() => {
                    Keyboard.dismiss();
                  }}
                  submit={() => {
                    Keyboard.dismiss();

                    if (isObjEmpty(formik.errors)) {
                      formik.handleSubmit();
                    }
                  }}
                  styleData={{
                    labelStyles: {
                      weight: 'medium',
                      color: AppTheme?.DefaultPalette()?.text?.title,
                    },
                  }}
                />
              </SpaceBetweenWrapper>

              <RowEnd style={{marginTop: AppTheme?.WP(4)}}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setAddCustomerModal(false);
                    formik.resetForm();
                  }}>
                  <TextItem
                    size={3.5}
                    color={AppTheme?.DefaultPalette()?.grey[700]}>
                    Cancel
                  </TextItem>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    !(formik.isValid && formik.dirty) && {opacity: 0.5},
                  ]}
                  disabled={isLoading || !(formik.isValid && formik.dirty)}
                  onPress={formik.handleSubmit}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={'white'} />
                  ) : (
                    <Icon name={'plus-circle'} size={18} color={'white'} />
                  )}
                  <TextItem size={3.5} color={'#fff'} weight="bold">
                    Add New Customer
                  </TextItem>
                </TouchableOpacity>
              </RowEnd>
            </ModalView>
          </KeyboardAvoidingView>
        </Modal>
      </TouchableWithoutFeedback>
    </>
  );
};

InitiateJobModel.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

const styles = StyleSheet.create({
  section: {
    marginBottom: AppTheme?.WP(3),
  },
  inputTitle: {
    alignItems: 'center',
    marginBottom: AppTheme?.WP(-2),
    marginLeft: AppTheme?.WP(1.5),
  },
  label: {
    marginBottom: AppTheme?.WP(1),
  },
  addCustomerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: AppTheme?.WP(2),
  },
  cancelBtn: {
    backgroundColor: AppTheme?.DefaultPalette()?.grey[200],
    borderRadius: 10,
    paddingVertical: AppTheme?.WP(2),
    paddingHorizontal: AppTheme?.WP(6),
    marginRight: AppTheme?.WP(2),
  },
  addBtn: {
    backgroundColor: AppTheme?.DefaultPalette()?.success?.main,
    borderRadius: 10,
    paddingVertical: AppTheme?.WP(2),
    paddingHorizontal: AppTheme?.WP(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme?.WP(2),
  },
  hoverServicesActive: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: AppTheme?.WP(3),
    borderWidth: 1,
    borderColor: AppTheme?.DefaultPalette()?.warning?.main,
    padding: AppTheme?.WP(2),
    borderRadius: AppTheme?.WP(2),
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.warning?.main, 0.1),
  },
  deleteIcon: {
    marginLeft: AppTheme?.WP(2),
    position: 'absolute',
    right: AppTheme?.WP(-8),
    top: AppTheme?.WP(5.2),
  },
});

export {InitiateJobModel};
