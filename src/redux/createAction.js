import {showToast} from '../utils/utils';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const createAction = (type, apiFunction) => {
  return createAsyncThunk(
    `dashboard/${type}`,
    async (
      {data = {}, customData = {}, callback, refreshing, errorCallback},
      {fulfillWithValue, rejectWithValue},
    ) => {
      try {
        const res = await apiFunction(data);
        // console.log('res : ', JSON.stringify(res?.data, null, 2));
        const result = res?.data?.result;
        refreshing();

        if (res?.data?.success || res?.statusCode === 200) {
          callback({...result, customData});
        } else {
          errorCallback();
          showToast({
            type: 'error',
            title: 'Error Logging In',
            message: res?.data?.message,
          });
        }

        return fulfillWithValue(result);
      } catch (err) {
        console.log('error in API : ', JSON.stringify(err));
        errorCallback(err);
        showToast({
          title: `Error in ${type}`,
          message: err?.response?.data?.message || err?.message,
          type: 'error',
        });
        return rejectWithValue(err);
      }
    },
  );
};
