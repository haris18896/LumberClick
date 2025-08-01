import React from 'react';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// ** Custom Components
import {
  CompanyIcon,
  JobDetailWrapper,
  JobDetailContainer,
  JobsCardWrapper,
} from '../../styles/components/JobsPendingCard';
import {appImages} from '../../assets';
import {TextItem} from '../../styles/typography';

const JobPendingCard = props => {
  const {onPressCard, item = {}} = props;

  const jobsDetails = [
    {
      name: item?.company,
      icon: 'office-building-outline',
    },
    {
      name: item?.location,
      icon: 'map-marker-radius',
    },
    {
      name: item?.time,
      icon: 'calendar-blank',
    },
  ];

  return (
    <JobsCardWrapper key={item?.id} onPress={onPressCard}>
      <CompanyIcon source={appImages?.Logo} resizeMode={'cover'} />
      <JobDetailWrapper>
        <TextItem size={5}>{item?.name}</TextItem>
        {jobsDetails.map((details, index) => (
          <JobDetailContainer key={index}>
            <Icon
              name={details.icon}
              color={AppTheme?.DefaultPalette()?.primary?.main}
              size={AppTheme?.WP(5)}
            />
            <TextItem
              size={3.7}
              color={AppTheme?.DefaultPalette()?.grey[700]}
              style={{marginLeft: AppTheme?.WP(2)}}>
              {details?.name}
            </TextItem>
          </JobDetailContainer>
        ))}
      </JobDetailWrapper>
    </JobsCardWrapper>
  );
};
export {JobPendingCard};
