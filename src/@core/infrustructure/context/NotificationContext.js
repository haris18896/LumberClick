/* eslint-disable react-hooks/exhaustive-deps */
import {Platform} from 'react-native';
import React, {createContext, useContext, useState, useEffect} from 'react';

// ** Utils
import {getData} from '../../../utils/constants';
import {addNotificationListener} from '../../../utils/utils';

// ** Third Party Packages
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

// ** Store && Actions
import {useDispatch, useSelector} from 'react-redux';

export const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({children}) => {
  // ** Store
  const dispatch = useDispatch();
  const {userMe} = useSelector(state => state?.auth);

  // ** States
  const [fcmToken, setFcmToken] = useState('');

  const TokenFunction = async accessToken => {
    await messaging()
      .getToken()
      .then(token => {
        setFcmToken(token);
        if (token) {
          if (accessToken) {
            console.log('check 0', Platform.OS, token);
            if (userMe?._id) {
              database().ref(`/users/${userMe._id}/fcmToken`).set(token);
            }
            addNotificationListener().then(() => {});
          }
        }
      })
      .catch(error => {
        console.log('error in notification messaging....', error);
      });
  };

  useEffect(() => {
    (async () => {
      const accessToken = await getData('token');
      if (Platform.OS === 'ios') {
        messaging()
          .requestPermission()
          .then(authStatus => {
            if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
              console.log('Notification permission granted...');
            } else {
              console.log('Notification permission denied');
            }
          })
          .then(async () => {
            TokenFunction(accessToken).then(() => {});
          });
      } else if (Platform.OS === 'android') {
        TokenFunction().then(() => {});
      }

      // Add a listener for FCM token refresh
      const onTokenRefresh = messaging().onTokenRefresh(token => {
        setFcmToken(token);
      });

      // Cleanup the listener when unmounting the component
      return () => {
        console.log('check its return...');
        onTokenRefresh();
      };
    })();
  }, []);

  return (
    <NotificationContext.Provider value={{fcmToken}}>
      {children}
    </NotificationContext.Provider>
  );
};
