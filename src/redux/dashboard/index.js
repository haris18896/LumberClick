// DashboardSlice.js
import {createSlice} from '@reduxjs/toolkit';
import useJwt from '../../@core/auth/useJwt';
import {createAction} from '../createAction';

export const DashboardJobStatsAction = createAction(
  'Dashboard Job Stats',
  useJwt.dashboardJobStats,
);

// ** Initial State
const initialState = {
  dashboardJobStats: {},
};

const DashboardSlice = createSlice({
  name: 'Dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(DashboardJobStatsAction.fulfilled, (state, action) => {
      state.dashboardJobStats = action.payload;
    });
  },
});

export default DashboardSlice.reducer;
