import React from 'react';

// ** Third Party Packages
import Icon from 'react-native-vector-icons/MaterialIcons';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Custom Components
import {JobsCardWrapper} from '../../styles/components/JobsPendingCard';
import {JobCardUserWrapper} from '../../styles/components/JobCard';
import {StyleSheet, View} from 'react-native';
import {
  ColumnStart,
  RowEnd,
  RowStart,
  SpaceBetweenWrapper,
} from '../../styles/infrustucture';
import {TextItem} from '../../styles/typography';
import {HeaderImage} from '../../styles/components';
import {appImages} from '../../assets';
import {JobCardProfile} from '../../styles/components/JobOverViewCard';
import {hexToRgba} from '../../utils/utils';

const JobDetailsCardHeader = ({company, customer, salesman}) => {
  return (
    <JobsCardWrapper
      disabled={true}
      onPress={() => {}}
      direction={'column'}
      style={{paddingBottom: AppTheme?.WP(6)}}
      background={hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.2)}>
      <JobCardUserWrapper style={styles.JobCardUser}>
        <Icon
          name={'language'}
          color={AppTheme?.DefaultPalette()?.success?.main}
          size={AppTheme?.WP(6)}
        />

        <ColumnStart style={styles.JobUser}>
          <TextItem size={4.5}>{company}</TextItem>
        </ColumnStart>
      </JobCardUserWrapper>

      <View style={styles.profileContainer}>
        {customer?.name !== 'undefined undefined' && (
          <RowStart>
            <JobCardProfile
              size={8}
              source={
                customer?.profileImage
                  ? {uri: customer?.profileImage}
                  : appImages?.Logo
              }
              resizeMode={'cover'}
            />
            <View style={styles.profileDetails}>
              <TextItem size={3.5}>{customer?.name}</TextItem>
              <TextItem size={3} color={AppTheme?.DefaultPalette()?.grey[500]}>
                Customer
              </TextItem>
            </View>
          </RowStart>
        )}

        {salesman?.name !== 'undefined undefined' && (
          <RowStart style={{marginTop: AppTheme?.WP(2)}}>
            <JobCardProfile
              size={8}
              source={
                salesman?.profileImage
                  ? {uri: salesman?.profileImage}
                  : appImages?.Logo
              }
              resizeMode={'cover'}
            />
            <View style={styles.profileDetails}>
              <TextItem size={3.5}>{salesman?.name}</TextItem>
              <TextItem size={3} color={AppTheme?.DefaultPalette()?.grey[500]}>
                Salesman
              </TextItem>
            </View>
          </RowStart>
        )}
      </View>
    </JobsCardWrapper>
  );
};

const styles = StyleSheet.create({
  JobCardUser: {
    paddingBottom: AppTheme?.WP(1),
  },
  JobUser: {
    marginLeft: AppTheme?.WP(2),
  },
  profileContainer: {
    paddingTop: AppTheme?.WP(2),
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  profileDetails: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: AppTheme?.WP(2),
  },
});

export {JobDetailsCardHeader};
