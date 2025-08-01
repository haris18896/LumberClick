// JobsSlice.js
import {createSlice, combineReducers} from '@reduxjs/toolkit';
import useJwt from '../../@core/auth/useJwt';
import {createAction} from '../createAction';
import jobDetailsReducer from './JobDetailsSlice';

// ** function: Actions
export const JobsAction = createAction('Jobs', useJwt.getMyJobs);
export const GetBidsByJobIdAction = createAction(
  'Bids By Job Id',
  useJwt.getBidsByJobId,
);

export const SelectEstimatorForBidAction = createAction(
  'Select Estimator For Bid',
  useJwt.selectEstimatorForBid,
);

// Initial State
const initialState = {
  jobs: {
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 0,
    data: [],
  },
  jobBids: {
    pageIndex: 1,
    pageSize: 50,
    data: [],
  },
};

const JobsSlice = createSlice({
  name: 'Jobs',
  initialState,
  reducers: {
    clearJobs: state => {
      state.jobs = initialState.jobs;
      state.jobBids = initialState.jobBids;
    },
  },
  extraReducers: builder => {
    builder
      // ** States
      .addCase(JobsAction.fulfilled, (state, action) => {
        state.jobs.totalRecords = action.payload?.totalRecords || 0;
        state.jobs.data = action.payload?.jobs;
        state.jobs.pageIndex =
          action.payload?.pageIndex || state.jobs.pageIndex;
        if (action.payload?.pageSize) {
          state.jobs.pageSize = action.payload.pageSize;
        }
      })

      .addCase(GetBidsByJobIdAction.fulfilled, (state, action) => {
        if (action.payload?.bids?.length > 0) {
          action.payload.bids = action.payload.bids.map(bid => {
            if (bid.user.reviews.length > 0) {
              const {totalRatings, numberOfRatings} = bid.user.reviews.reduce(
                (acc, review) => {
                  if (review.hasOwnProperty('rating') && review.rating > 0) {
                    acc.totalRatings += review.rating;
                    acc.numberOfRatings += 1;
                  }
                  return acc;
                },
                {totalRatings: 0, numberOfRatings: 0},
              );

              const averageRating =
                numberOfRatings > 0 ? totalRatings / numberOfRatings : 0;
              bid.user.averageRating = averageRating;
            } else {
              bid.user.averageRating = 0;
            }
            return bid;
          });
        }

        state.jobBids.data = action.payload?.bids || [];
        state.jobBids.pageIndex =
          action.payload?.pageIndex || state.jobBids.pageIndex;

        if (action.payload?.pageSize) {
          state.jobBids.pageSize = action.payload.pageSize;
        }

        if (action.payload?.totalRecords) {
          state.jobBids.totalRecords = action.payload.totalRecords;
        }
      });
  },
});

export default JobsSlice.reducer;
