/* eslint-disable react-hooks/exhaustive-deps */

import React, {Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Platform} from 'react-native';

// **  Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Components
import {useNavigation} from '@react-navigation/native';

// ** Custom Components
import {LayoutModel} from '../../@core/layout/LayoutModel';
import {Empty, HeadingDetails} from '../../@core/components';
import {BarHeader, JobOverViewCard, JobPendingCard} from '../../components';

// ** Store && Actions
import {useDispatch, useSelector} from 'react-redux';

// ** Dummy
import {jobs} from '../../utils/dummy';
import {DashboardJobStatsAction} from '../../redux/dashboard';
import LoadingComponent from '../../@core/components/loading/LoadingComponent';
import {Layout} from '../../@core/layout';

const Dashboard = () => {
  // ** navigation
  const navigation = useNavigation();

  // ** Store
  const dispatch = useDispatch();
  const {dashboardJobStats} = useSelector(state => state.dashboard);

  // ** States
  const [isLoading, setIsLoading] = useState('');

  // ** Constants
  const jobsLength = jobs.length || 0;

  const apiCall = async () => {
    return new Promise((resolve, reject) => {
      dispatch(
        DashboardJobStatsAction({
          data: {},
          refreshing: () => setIsLoading(''),
          callback: res => {
            resolve(res);
          },
          errorCallback: err => {
            setIsLoading('');
            reject(err);
          },
        }),
      );
    });
  };

  useEffect(() => {
    setIsLoading('dashboard_data_pending');
    return navigation.addListener('focus', apiCall);
  }, [navigation]);

  const onRefresh = () => {
    setIsLoading('refreshing');
    apiCall().then(() => {});
  };

  return (
    <View style={styles.MainContainer}>
      <BarHeader
        onPressBar={() => navigation.toggleDrawer()}
        user={{
          bg: AppTheme?.DefaultPalette()?.grey[100],
          marginBottom: 0,
          marginTop: 0,
          width: 11,
          height: 11,
        }}
      />
      {isLoading === 'dashboard_data_pending' && (
        <LoadingComponent
          top={-2}
          borders={{
            topLeft: 10,
            topRight: 10,
          }}
        />
      )}
      <Layout>
        <Fragment key={0}>
          <HeadingDetails
            justifyContent={'flex-start'}
            heading={'Job Cards Pending Info'}
            description={''}
            details={{
              heading: {
                size: '6.5',
                color: AppTheme?.DefaultPalette()?.text?.title,
              },

              customStyles: {
                heading: {
                  marginBottom: AppTheme?.WP(2),
                  width: '100%',
                  paddingHorizontal: AppTheme?.WP(2),
                },
              },
            }}
          />
          <JobOverViewCard
            completed={dashboardJobStats?.totalCompletedJobs}
            inProgress={dashboardJobStats?.totalPendingJobs}
            jobPercentage={
              (dashboardJobStats?.totalCompletedJobs /
                dashboardJobStats?.totalJobs) *
              100
            }
            title={'Job Overview'}
          />
        </Fragment>
        {/*<FlatList*/}
        {/*  data={jobs}*/}
        {/*  style={styles.flatList}*/}
        {/*  keyExtractor={item => item.id}*/}
        {/*  onRefresh={() => onRefresh()}*/}
        {/*  showsVerticalScrollIndicator={false}*/}
        {/*  refreshing={isLoading === 'refreshing'}*/}
        {/*  contentContainerStyle={styles.flatListContainer(jobs.length)}*/}
        {/*  ListEmptyComponent={*/}
        {/*    <Empty height={35} title={'No Job Cards Available'} />*/}
        {/*  }*/}
        {/*  ListHeaderComponent={<></>}*/}
        {/*  renderItem={({item}) => (*/}
        {/*    <JobPendingCard*/}
        {/*      item={item}*/}
        {/*      onPressCard={() => console.log(item)}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*/>*/}
      </Layout>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform?.OS === 'ios' ? AppTheme?.WP(14) : AppTheme?.WP(4),
    backgroundColor: 'white',
  },
  layoutModel: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: AppTheme?.WP(4),
  },
  flatListContainer: length => ({
    flexDirection: 'column',
    justifyContent: length === 0 ? 'center' : 'flex-start',
  }),
  flatList: {
    flex: 1,
    width: '100%',
    paddingBottom: AppTheme?.WP(10),
  },
});

export {Dashboard};
