import { showToast } from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
const isDev = __DEV__;

export const MAIN_URL = 'https://devapi.lumberclick.com';
export const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51RZaNIIoEHbyZj7ybGuDrJvzy8IGJiws8RJkSWourxG8cvXO0lym1PdHUkNDCsKaeeXwi5hRwNHLc1BD91cbOgEs00tShMTZuI';
// export const MAIN_URL = isDev
//   ? 'https://devapi.lumberclick.com'
//   : 'https://api.lumberclick.com';

export const MAIN_URL_3D = 'https://dev.lumberclick.com';

// export const STRIPE_PUBLISHABLE_KEY = isDev
//   ? 'pk_test_51RZaNIIoEHbyZj7ybGuDrJvzy8IGJiws8RJkSWourxG8cvXO0lym1PdHUkNDCsKaeeXwi5hRwNHLc1BD91cbOgEs00tShMTZuI'
//   : 'pk_live_51PIXNlEVQN67Da3EbxGAeE34sfIQ0pkOq78QK7YPySkea0tbq1EYHnxHaKXxd7eJwBzZEQadWdLYhRnbkDsGSR7d00Ayi4BqF5';

export const resizeMode = 'cover';

// ** DONE: Async Storage items has been set
export const getData = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    showToast({
      title: 'Fetch token',
      message: 'Failed to fetch token',
      type: 'error',
    });
  }
};

export const setData = async (key, value) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (e) {
    showToast({
      title: 'Set token',
      message: 'Failed to set token',
      type: 'error',
    });
  }
};

export const removeData = async key => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    showToast({
      title: 'Remove token',
      message: 'Failed to remove token',
      type: 'error',
    });
  }
};

export const getAllData = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    showToast({
      title: 'Get all data',
      message: 'Failed to get all data',
      type: 'error',
    });
  }

  return keys;
};

export const clearAllData = async () => {
  try {
    return await AsyncStorage.clear();
  } catch (e) {
    showToast({
      title: 'Clear all data',
      message: 'Failed to clear all data',
      type: 'error',
    });
  }
};
