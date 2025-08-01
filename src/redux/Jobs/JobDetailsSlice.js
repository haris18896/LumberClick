import {createSlice} from '@reduxjs/toolkit';
import {createAction} from '../createAction';
import useJwt from '../../@core/auth/useJwt';
import {isObjEmpty} from '../../utils/utils';

// Async thunks for API calls

export const fetchJobById = createAction(
  'jobDetails/fetchJobById',
  useJwt.getJobById,
);

export const fetchJobRevisions = createAction(
  'jobDetails/fetchJobRevisions',
  useJwt.getJobRevisionDetails,
);

export const fetchMaterialCount = createAction(
  'jobDetails/fetchMaterialCount',
  useJwt.getMaterialCount,
);

export const fetch_3DModel_and_Revision = createAction(
  'jobDetails/fetch_3DModel_and_Revision',
  useJwt.get_3DModel_and_Revision,
);

export const deleteDocumentAPI = createAction(
  'jobDetials/delete-document',
  useJwt.deleteDocument,
);

export const uploadDocumentAPI = createAction(
  'jobDetials/upload-document',
  useJwt.uploadDocument,
);

export const addJobAPI = createAction('jobDetails/add-job', useJwt.addJob);

export const submitJobForBiddingAPI = createAction(
  'jobDetials/submit-job-for-bidding',
  useJwt.submitJobForBidding,
);

const initialState = {
  jobData: {},
  revisionData: [],
  materialCount: {},
  _3DModel_and_Revision: [],
};

const jobDetailsSlice = createSlice({
  name: 'jobDetails',
  initialState,
  reducers: {
    clearJobDetails: state => {
      state.jobData = {};
      state.revisionData = [];
    },
  },
  extraReducers: builder => {
    builder
      // Job details
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobData = action.payload;
      })

      // Revisions
      .addCase(fetchJobRevisions.fulfilled, (state, action) => {
        state.revisionData = action.payload;
      })

      // Material count
      .addCase(fetchMaterialCount.fulfilled, (state, action) => {
        state.materialCount = action.payload;
      })

      // 3D Model and Revision
      .addCase(fetch_3DModel_and_Revision.fulfilled, (state, action) => {
        state._3DModel_and_Revision = isObjEmpty(action.payload)
          ? []
          : action.payload;
      });
  },
});

export const {clearJobDetails} = jobDetailsSlice.actions;
export default jobDetailsSlice.reducer;
