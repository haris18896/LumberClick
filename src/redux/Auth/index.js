// AuthSlice.js
import { createSlice } from '@reduxjs/toolkit';
import useJwt from '../../@core/auth/useJwt';
import { createAction } from '../createAction';
import { setData } from '../../utils/constants';

// ** Function: Actions
export const LoginAction = createAction('Login', useJwt.login);

export const register = createAction('DeleteAccount', useJwt.register);

export const UserMeAction = createAction('User Me', useJwt.UserMe);

export const ForgotPasswordAction = createAction(
  'Forgot Password',
  useJwt.ForgotPassword,
);

export const ResetPasswordAction = createAction(
  'Forgot Password',
  useJwt.ForgotPassword,
);

export const DeleteAccountAction = createAction(
  'DeleteAccount',
  useJwt.deleteAccount,
);
export const UpdateAccountAction = createAction(
  'DeleteAccount',
  useJwt.updateAccount,
);

export const AddPaymentAction = createAction('AddPayment', useJwt.addPayment);

// Initial State
const initialState = {
  login: {},
  userMe: {},
  avatar: null,
  role: null,
  permissions: [],
};

// ** Function: Reducer
const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    Logout: state => {
      return {
        ...initialState,
        isLoading: false,
      };
    },
    UserProfileAction: (state, action) => {
      return {
        ...state,
        avatar: action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder
      // ** STATES: LoginAction
      .addCase(LoginAction.fulfilled, (state, action) => {
        state.login = action.payload;
      })

      // ** STATES: UserMeAction
      .addCase(UserMeAction.fulfilled, (state, action) => {
        const userPayload = action.payload;

        state.userMe = userPayload;
        state.role = userPayload?.role || null;
        state.permissions = userPayload?.role?.permissions[0]?.actions || [];

        // Handle AsyncStorage in a separate side effect (not in reducer)
        if (userPayload?.role?.name) {
          setData('role', userPayload.role.name);
        }
        if (userPayload?.role?.permissions) {
          setData(
            'permissions',
            JSON.stringify(userPayload.role.permissions[0]?.actions),
          );
        }
      });
  },
});

export const { Logout, UserProfileAction } = AuthSlice.actions;
export default AuthSlice.reducer;
