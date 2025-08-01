import React from 'react';

// ** Utils
import {theme as AppTheme} from '../@core/infrustructure/theme';

// ** Third Party Packages
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const getStatusColor = status => {
  switch ((status || '').toLowerCase()) {
    case 'pending info':
      return AppTheme?.DefaultPalette()?.warning?.main;
    case 'bidding in progress':
      return AppTheme?.DefaultPalette()?.info?.main;
    case 'pending payment':
      return AppTheme?.DefaultPalette()?.error?.main;
    case 'job in progress':
      return AppTheme?.DefaultPalette()?.primary?.main;
    case 'pending 3d model review':
      return AppTheme?.DefaultPalette()?.secondary?.main;
    case 'completed':
      return AppTheme?.DefaultPalette()?.success?.main;
    case 'quotation':
      return AppTheme?.DefaultPalette()?.warning?.main;
    case 'no-quotation':
      return AppTheme?.DefaultPalette()?.success?.main;
    default:
      return AppTheme?.DefaultPalette()?.grey[400];
  }
};

export const jobDetails = item => {
  return [
    {
      icon: (
        <MaterialCommunityIcons
          name="account-supervisor"
          size={18}
          color={AppTheme?.DefaultPalette()?.primary?.main}
        />
      ),
      label: 'QC Rep',
      value: `${item?.assignedQc?.firstName || '---'} ${
        item?.assignedQc?.lastName || '---'
      }`,
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="calculator-variant"
          size={18}
          color={AppTheme?.DefaultPalette()?.success?.main}
        />
      ),
      label: 'Estimator',
      value: `${item?.selectedEstimator?.firstName || '---'} ${
        item?.selectedEstimator?.lastName || '---'
      }`,
    },
    {
      icon: (
        <Icon
          name="credit-card"
          size={18}
          color={AppTheme?.DefaultPalette()?.warning?.main}
        />
      ),
      label: 'Payment By',
      value: item?.paymentBy || '---',
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="account-tie"
          size={18}
          color={AppTheme?.DefaultPalette()?.error?.main}
        />
      ),
      label: 'Salesman',
      value: `${item?.supplierSalesman?.firstName || '---'} ${
        item?.supplierSalesman?.lastName || '---'
      }`,
    },
  ];
};
