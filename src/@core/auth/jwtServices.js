import axios from 'axios';

// ** Utils
import { MAIN_URL } from '../../utils/constants';
import { navigateTo } from '../../navigation/utils';

// ** Third Party Packages
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class JwtService {
  jwtConfig = {};

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    axios.interceptors.request.use(
      async config => {
        const token = await AsyncStorage.getItem('token');
        // config.headers.Connection = 'keep-alive';
        // config.headers['Access-Control-Request-Method'] = '*';
        config.headers['Content-Type'] = 'application/json';
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.accessToken = token;

        return config;
      },
      error => Promise.reject(error),
    );

    axios.interceptors.response.use(
      response => response,
      async error => {
        const { response } = error;
        if (response && response.status === 401) {
          await AsyncStorage.removeItem('token');
          navigateTo('AuthStack');
        }

        return Promise.reject(error);
      },
    );
  }

  // ** API_ENDPOINT: Users API CALLS
  login = async data => {
    return axios.post(`${MAIN_URL}/auth/login`, data);
  };

  register = async data => {
    return axios.post(`${MAIN_URL}/auth/register`, data);
  };

  UserMe = async data => {
    return axios.get(`${MAIN_URL}/auth/me`);
  };

  ForgotPassword = async data => {
    return axios.post(`${MAIN_URL}/auth/forgot-password`, data);
  };

  ResetPassword = async data => {
    return axios.post(`${MAIN_URL}/auth/reset-password/${data?.token}`, {
      newPassword: data?.password,
    });
  };

  updateAccount({ userId, data }) {
    return axios.put(`${MAIN_URL}/user/updateUser/${userId}`, data);
  }

  tokensCall = data => {};

  addPayment(data) {
    console.log('check data : ', data);
    return axios.post(`${MAIN_URL}/user/addPaymentMethod`, data);
  }

  deleteAccount() {
    return axios.delete(`${MAIN_URL}/auth/me`);
  }

  // ** Jobs
  getMyJobs(data) {
    let endpoint = `${MAIN_URL}/job/getMyJobs?pageIndex=${data?.pageIndex}&pageSize=${data?.pageSize}&isCurrent=${data?.isCurrent}&sortBy=createdAt&sortOrder=desc`;

    if (data?.keyword) {
      endpoint += `&keyword=${data?.keyword}`;
    }

    return axios.get(endpoint);
  }

  getBidsByJobId(data) {
    return axios.get(
      `${MAIN_URL}/job/getAllBids/${data?.id}?pageIndex=${data?.pageIndex}&pageSize=${data?.pageSize}`,
    );
  }

  submitJobForBidding(data) {
    return axios.put(`${MAIN_URL}/job/postJob/${data?.jobId}`, {
      isPosted: true,
    });
  }

  selectEstimatorForBid(data) {
    return axios.post(
      `${MAIN_URL}/job/assignBid/${data?.jobId}/${data?.bidId}`,
    );
  }

  // ** Dashboard
  dashboardJobStats() {
    return axios.get(`${MAIN_URL}/dashboard/get-jobs-statistics`);
  }

  // ** Job Details
  getJobRevisionDetails(data) {
    return axios.get(`${MAIN_URL}/job/getRevisions/${data?.id}`);
  }

  getJobById(data) {
    return axios.get(`${MAIN_URL}/job/getJobById/${data?.id}`);
  }

  getMaterialCount(data) {
    return axios.get(`${MAIN_URL}/job/materialCount/${data?.id}`);
  }

  get_3DModel_and_Revision(data) {
    return axios.get(`${MAIN_URL}/home/materialLookup/${data?.id}`);
  }

  addJob(data) {
    return axios.post(`${MAIN_URL}/job/createJob`, data);
  }

  deleteDocument(data) {
    let endpoint = `${MAIN_URL}/job/deleteFile?jobId=${data?.jobId}&fileId=${data?.fileId}`;

    return axios.delete(endpoint);
  }

  uploadDocument(data) {
    return axios.post(`${MAIN_URL}/job/upload/${data?.jobId}`, data);
  }

  getMyCustomers(data) {
    return axios.get(`${MAIN_URL}/lookup/getMyCustomers/${data?.id}`);
  }

  registerCustomer(data) {
    return axios.post(
      `${MAIN_URL}/supplier/createSupplierCustomer?fromJob=true`,
      data,
    );
  }
}
