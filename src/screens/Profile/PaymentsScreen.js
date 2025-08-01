import React, { useState } from 'react';
import {
  View,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';

// ** Third Party Packages
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ** Utils
import { hexToRgba, showToast } from '../../utils/utils';
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Custom Components
import {
  BarHeader,
  ButtonAction,
  PaymentModel,
  DeleteDocumentModel,
} from '../../components';
import { Empty } from '../../@core/components';
import { TextItem } from '../../styles/typography';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { UserMeAction } from '../../redux/Auth';

const PaymentsScreen = () => {
  // ** Navigation
  const navigation = useNavigation();

  // ** Store
  const dispatch = useDispatch();
  const { userMe } = useSelector(state => state?.auth);

  // ** States
  const [modal, setModal] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  // ** Helper Functions
  const getCardType = cardNumber => {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = cardNumber.substring(0, 2);

    if (firstDigit === '4') {
      return { type: 'Visa', icon: 'credit-card', color: '#1A1F71' };
    } else if (firstTwoDigits >= '51' && firstTwoDigits <= '55') {
      return { type: 'Mastercard', icon: 'credit-card', color: '#EB001B' };
    } else if (firstTwoDigits === '34' || firstTwoDigits === '37') {
      return {
        type: 'American Express',
        icon: 'credit-card',
        color: '#006FCF',
      };
    } else {
      return {
        type: 'Card',
        icon: 'credit-card',
        color: AppTheme?.DefaultPalette()?.primary?.main,
      };
    }
  };

  // ** Render Payment Card
  const renderPaymentCard = (paymentMethod, index) => {
    const cardInfo = getCardType(paymentMethod.cardNumber);
    const gradientColors =
      index % 2 === 0
        ? [
            AppTheme?.DefaultPalette()?.primary?.main,
            AppTheme?.DefaultPalette()?.primary?.dark,
          ]
        : [
            AppTheme?.DefaultPalette()?.secondary?.main,
            AppTheme?.DefaultPalette()?.secondary?.dark,
          ];

    return (
      <View key={paymentMethod._id}>
        <LinearGradient
          colors={gradientColors}
          style={styles.creditCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContainer}>
            {/* <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                setModal('delete');
                setSelectedCard(paymentMethod);
              }}
            >
              <Icon name="delete" size={20} color={'white'} />
            </TouchableOpacity> */}

            <View style={styles.cardHeader}>
              <View style={styles.cardTypeContainer}>
                <Icon
                  name={cardInfo.icon}
                  size={AppTheme?.WP(5)}
                  color="#fff"
                />
                <TextItem
                  style={styles.cardTypeText}
                  size={4.5}
                  weight="medium"
                  color="#fff"
                >
                  {cardInfo.type}
                </TextItem>
              </View>
            </View>

            <View style={styles.cardNumberContainer}>
              <TextItem
                style={styles.cardNumber}
                size={4.5}
                weight="bold"
                color="#fff"
              >
                xxxx xxxx xxxx {paymentMethod.cardNumber}
              </TextItem>
            </View>

            <View style={styles.cardDetailsContainer}>
              <View style={styles.cardDetail}>
                <TextItem
                  style={styles.cardDetailLabel}
                  size={4}
                  weight="medium"
                  color="rgba(255, 255, 255, 0.7)"
                >
                  VALID THRU
                </TextItem>
                <TextItem
                  style={styles.cardDetailValue}
                  size={4}
                  weight="medium"
                  color="#fff"
                >
                  {paymentMethod.expiryMonth.padStart(2, '0')}/
                  {paymentMethod.expiryYear.slice(-2)}
                </TextItem>
              </View>
              <View style={styles.cardDetail}>
                <TextItem
                  style={styles.cardDetailLabel}
                  size={4}
                  weight="medium"
                  color="rgba(255, 255, 255, 0.7)"
                >
                  HOLDER
                </TextItem>
                <TextItem
                  style={styles.cardDetailValue}
                  size={4}
                  weight="medium"
                  color="#fff"
                >
                  {userMe?.firstName || 'CARD'} {userMe?.lastName || 'HOLDER'}
                </TextItem>
              </View>
            </View>

            <View style={styles.decorationCircle1} />
            <View style={styles.decorationCircle2} />
            <View style={styles.decorationCircle3} />
          </View>
        </LinearGradient>
      </View>
    );
  };

  const userMeApiCall = async () => {
    setIsLoading('user_me_pending');
    dispatch(
      UserMeAction({
        data: {},
        refreshing: () => setIsLoading(''),
        errorCallback: () => setIsLoading(''),
        callback: res => {
          console.log('check response...', res?.stripeBilling);
          setIsLoading('');
          showToast({
            type: 'success',
            title: 'Card Added',
            message: 'Payment method added successfully',
          });
        },
      }),
    );
    setIsLoading('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.MainContainer}>
        <BarHeader
          title="Payment Cards"
          onBack={() => navigation.goBack()}
          user={{
            bg: AppTheme?.DefaultPalette()?.grey[100],
            marginBottom: 0,
            marginTop: 0,
            width: 11,
            height: 11,
          }}
        />
        <View style={styles.headerContainer}>
          <TextItem
            size={5}
            family="PoppinsSemiBold"
            weight="medium"
            color={AppTheme?.DefaultPalette()?.grey[700]}
          >
            My Payment Cards
          </TextItem>
        </View>

        <FlatList
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={isLoading === 'user_me_pending'}
              onRefresh={userMeApiCall}
            />
          }
          data={userMe?.stripeBilling?.payment_methods}
          renderItem={({ item, index }) => renderPaymentCard(item, index)}
          keyExtractor={item => item._id}
          ListEmptyComponent={<Empty title={'No Payment Cards'} />}
        />

        <View style={styles.paymentButton}>
          <ButtonAction
            start={3}
            radius={2}
            title={'Add Payment Method'}
            border={'transparent'}
            icon={{
              name: 'credit-card',
              size: 6,
              color: AppTheme?.DefaultPalette()?.success?.main,
            }}
            onPress={() => setModal('add_payment_method')}
            color={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.25)}
            labelColor={AppTheme.DefaultPalette().success.main}
            loadingColor={AppTheme.DefaultPalette().success.white}
          />
        </View>

        <DeleteDocumentModel
          title={'Delete Document'}
          visible={modal === 'delete'}
          onCancel={() => setModal('')}
          isLoading={isLoading === 'delete_document_pending'}
          description={`Are you sure you want to delete ${selectedCard?.cardNumber} payment method?`}
          onConfirm={() => {
            setModal('');
            showToast({
              type: 'success',
              title: 'Card Deleted',
              message: `Payment method ${selectedCard?.cardNumber} deleted successfully`,
            });
          }}
        />

        <PaymentModel
          title={'Add Payment Method'}
          onCancel={() => setModal('')}
          visible={modal === 'add_payment_method'}
          isLoading={isLoading === 'add_payment_method'}
          onConfirm={() => {}}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: AppTheme.WP(4),
    position: 'relative',
  },
  MainContainer: {
    flex: 1,
    paddingTop: Platform?.OS === 'ios' ? AppTheme?.WP(14) : AppTheme?.WP(4),
    backgroundColor: AppTheme?.DefaultPalette()?.grey[50],
  },

  headerContainer: {
    paddingHorizontal: AppTheme?.WP(7),
    paddingTop: AppTheme?.WP(4),
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    margin: AppTheme?.WP(3),
    borderRadius: 20,
  },
  cardsContainer: {},

  creditCard: {
    borderRadius: 20,
    marginBottom: AppTheme?.WP(4),
    height: AppTheme?.WP(45),
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: AppTheme?.WP(0),
    right: AppTheme?.WP(0),
    backgroundColor: AppTheme?.DefaultPalette()?.error?.dark,
    borderRadius: 20,
    padding: AppTheme?.WP(2),
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: AppTheme?.WP(1.5),
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTypeText: {
    marginLeft: AppTheme?.WP(2),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardNumberContainer: {},
  cardNumber: {
    letterSpacing: 2,
    textAlign: 'center',
  },
  cardDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    paddingHorizontal: AppTheme?.WP(2),
  },
  cardDetail: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardDetailLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: AppTheme?.WP(0.5),
  },
  cardDetailValue: {
    textTransform: 'uppercase',
  },
  decorationCircle1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    position: 'absolute',
    top: -20,
    right: -20,
    opacity: 0.1,
  },
  decorationCircle2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    top: AppTheme?.WP(-10),
    right: -20,
    opacity: 0.1,
  },
  decorationCircle3: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: AppTheme?.WP(-5),
    left: AppTheme?.WP(-15),
    opacity: 0.1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme?.WP(12),
  },
  emptyStateIcon: {
    width: AppTheme?.WP(20),
    height: AppTheme?.WP(20),
    borderRadius: AppTheme?.WP(10),
    backgroundColor: AppTheme?.DefaultPalette()?.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: AppTheme?.WP(4),
  },
  emptyStateTitle: {
    marginBottom: AppTheme?.WP(2),
    textAlign: 'center',
  },
  emptyStateDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme?.DefaultPalette()?.primary?.main,
    borderRadius: 16,
    paddingVertical: AppTheme?.WP(4),
    paddingHorizontal: AppTheme?.WP(6),
    marginHorizontal: AppTheme?.WP(4),
    marginTop: AppTheme?.WP(6),
    shadowColor: AppTheme?.DefaultPalette()?.primary?.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addCardButtonText: {
    marginLeft: AppTheme?.WP(2),
  },
  paymentButton: {
    paddingHorizontal: AppTheme?.WP(4),
    paddingBottom: Platform?.OS === 'ios' ? AppTheme?.WP(8) : AppTheme?.WP(6),
  },
});
export default PaymentsScreen;
