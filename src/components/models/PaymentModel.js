import React, { useState } from 'react';

// ** Utils
import { getErrorText, hexToRgba, showToast } from '../../utils/utils';
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Third Party
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import { ModalView } from '../../@core/components';
import { TextItem } from '../../styles/typography';
import { ButtonAction } from '../buttons/ButtonAction';
import { UserActivityWrapper } from '../../styles/screens';
import { ColumCenter, SpaceBetweenWrapper } from '../../styles/infrustucture';
import { Card } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AddPaymentAction, UserMeAction } from '../../redux/Auth';
import { getData } from '../../utils/constants';

const PaymentModel = ({ title, visible, onCancel, onConfirm = () => {} }) => {
  const dispatch = useDispatch();
  const { userMe } = useSelector(state => state?.auth);

  // && Stripe
  const stripe = useStripe();

  const [card, setCard] = useState(null);
  const [cardError, setCardError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async card => {
    setIsLoading('add_payment_method');
    try {
      const cardFormat = {
        type: 'Card',
        billingDetails: {
          email: userMe?.email,
        },
        cardDetails: {
          currency: 'USD',
          brand: card?.brand,
          last4: card?.last4,
          country: card?.country,
          funding: card?.funding,
          validCVC: card?.validCVC,
          complete: card?.complete,
          expiryYear: card?.expYear,
          expiryMonth: card?.expMonth,
          validNumber: card?.validNumber,
          validExpiryDate: card?.validExpiryDate,
        },
      };

      await stripe.createToken(cardFormat).then(res => {
        if (res?.error) {
          setCardError(res?.error);
          setIsLoading('');
        } else if (res?.token?.id) {
          console.log('token is : ', res?.token?.id);

          dispatch(
            AddPaymentAction({
              data: {
                token: res?.token?.id,
              },
              refreshing: () => {},
              callback: async res => {
                console.log('check response...', res);
                const loginToken = await getData('token');
                dispatch(
                  UserMeAction({
                    data: { token: loginToken },
                    refreshing: () => setIsLoading(''),
                    errorCallback: () => setIsLoading(''),
                    callback: () => {
                      setIsLoading('');
                      onCancel();
                      onConfirm();
                      showToast({
                        type: 'success',
                        title: 'Card Added',
                        message: 'Payment method added successfully',
                      });
                    },
                  }),
                );
              },
              errorCallback: err => {
                setIsLoading('');
                onCancel();
                showToast({
                  type: 'error',
                  title: 'Add Payment Error',
                  message: err?.message,
                });
              },
            }),
          );
        } else {
          showToast({
            type: 'error',
            title: 'Error Adding Card',
            message: 'Card token is not valid!',
          });
        }
      });
    } catch (error) {
      setCardError(error);
    }
  };

  return (
    <ModalView open={visible} title={title} toggleModal={onCancel}>
      <ColumCenter>
        <Card style={styles.card('#fff')}>
          <CardField
            postalCodeEnabled={false}
            style={styles.cardField(cardError)}
            cardStyle={styles.cardStyle(cardError)}
            placeholders={{
              number: 'xxxx xxxx xxxx xxxx',
            }}
            onFocus={() => {
              setCardError(null);
            }}
            onCardChange={cardDetails => {
              const invalidKey = Object.keys(cardDetails).find(
                key => cardDetails[key] === 'Invalid',
              );
              if (invalidKey) {
                setCardError(invalidKey);
              } else {
                setCardError(null);
                setCard(cardDetails);
              }
            }}
          />

          {cardError && (
            <TextItem
              size={3.4}
              style={{
                paddingHorizontal: AppTheme?.WP(2),
                paddingBottom: AppTheme?.WP(2),
              }}
              color={AppTheme?.DefaultPalette()?.error?.main}
            >
              {getErrorText(cardError)}
            </TextItem>
          )}
        </Card>
      </ColumCenter>

      <SpaceBetweenWrapper style={{ marginTop: AppTheme?.WP(4) }}>
        <UserActivityWrapper width={'48%'}>
          <ButtonAction
            end={true}
            title={'Cancel'}
            onPress={onCancel}
            border={hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 0.15)}
            color={hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 0.15)}
            loadingColor={hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 1)}
            labelColor={hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 1)}
          />
        </UserActivityWrapper>

        <UserActivityWrapper
          width={'48%'}
          style={{ marginLeft: AppTheme?.WP(2) }}
        >
          <ButtonAction
            end={true}
            title={'Add'}
            loading={isLoading === 'add_payment_method'}
            disabled={isLoading === 'add_payment_method'}
            onPress={() => handlePayment(card)}
            border={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.15)}
            color={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.15)}
            loadingColor={hexToRgba(
              AppTheme?.DefaultPalette()?.success?.main,
              1,
            )}
            labelColor={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 1)}
          />
        </UserActivityWrapper>
      </SpaceBetweenWrapper>
    </ModalView>
  );
};

const styles = StyleSheet.create({
  card: backgroundColor => ({
    marginVertical: AppTheme.WP(4),
    elevation: 3,
    borderRadius: AppTheme.WP(3),
    width: '100%',
    backgroundColor: backgroundColor,
  }),
  cardStyle: cardError => ({
    backgroundColor: '#FFFFFF',
    textColor: cardError ? 'red' : 'black',
    marginHorizontal: 10,
  }),
  cardField: cardError => ({
    width: '100%',
    height: 50,
    marginVertical: 3,
    borderRadius: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
  }),
  cardErrorText: {
    marginLeft: 2,
    marginBottom: 3,
  },
});

export { PaymentModel };
