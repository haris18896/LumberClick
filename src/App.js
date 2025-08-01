import React from 'react';
import 'react-native-gesture-handler';

// ** Third Party Packages
import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
// import { StripeProvider } from '@stripe/stripe-react-native';

// ** Store
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// ** Custom Components
import MainStack from './navigation';
import { persistor, store } from './redux/store';
import { theme as AppTheme } from './@core/infrustructure/theme';
import { NotificationProvider } from './@core/infrustructure/context/NotificationContext';
import AuthProvider from './@core/infrustructure/context/AuthContext';
import { STRIPE_PUBLISHABLE_KEY } from './utils/constants';
import { StripeProvider } from '@stripe/stripe-react-native';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ThemeProvider theme={AppTheme}>
            <PaperProvider>
              <StripeProvider
                publishableKey={STRIPE_PUBLISHABLE_KEY}
                merchantIdentifier="merchant.com.lumber.click"
              >
                <NotificationProvider>
                  <MainStack />
                  <Toast />
                </NotificationProvider>
              </StripeProvider>
            </PaperProvider>
          </ThemeProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
