import React, {
  useRef,
  useMemo,
  useState,
  Fragment,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  FlatList,
  Platform,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';

// **  Utils
import {hexToRgba} from '../../utils/utils';
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Components
import _ from 'lodash';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {
  SearchBar,
  JobButton,
  JobButtonContainer,
  JobsButtonWrapper,
} from '../../styles/screens/Jobs';
import {Layout} from '../../@core/layout';
import {TextItem} from '../../styles/typography';
import {JobCard, BarHeader, InitiateJobModel} from '../../components';
import {Empty, HeadingDetails, TextInput} from '../../@core/components';
import LoadingComponent from '../../@core/components/loading/LoadingComponent';

// ** Store && Actions
import {JobsAction} from '../../redux/Jobs';
import {useDispatch, useSelector} from 'react-redux';
import {useAuth} from '../../@core/infrustructure/context/AuthContext';
import {addJobAPI, clearJobDetails} from '../../redux/Jobs/JobDetailsSlice';

const Jobs = () => {
  // ** navigation
  const navigation = useNavigation();

  // ** Context
  const {role, isSalesman} = useAuth();

  // ** Refs
  const search_ref = useRef(null);

  // ** Store
  const dispatch = useDispatch();
  const {jobs} = useSelector(state => state?.jobs);
  const {userMe} = useSelector(state => state?.auth);

  // ** States
  const [model, setModel] = useState('');
  const [search, setSearch] = useState('');
  const [job, setJob] = useState('current');
  const [isLoading, setIsLoading] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastLoadedPage, setLastLoadedPage] = useState(1);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(jobs?.data || []);

  const apiCall = useCallback(
    async ({isCurrent, pageIndex, keyword, loadMore = false}) => {
      if (!loadMore) {
        setIsLoading(keyword ? 'searching' : 'jobs_pending');
        setAllDataLoaded(false);
        setLastLoadedPage(1);
      }

      return new Promise((resolve, reject) => {
        dispatch(
          JobsAction({
            data: {
              pageIndex,
              isCurrent,
              pageSize: jobs?.pageSize,
              keyword: keyword || undefined,
            },
            refreshing: () => {
              setIsLoading('');
              setLoadingMore(false);
            },
            errorCallback: err => {
              reject(err);
              setIsLoading('');
              setLoadingMore(false);
            },
            callback: res => {
              if (
                !res?.jobs ||
                res.jobs.length === 0 ||
                res.jobs.length < jobs?.pageSize
              ) {
                setAllDataLoaded(true);
              }

              if (loadMore && pageIndex > 1) {
                setFilteredJobs(prevJobs => {
                  const existingIds = new Set(prevJobs.map(job => job._id));
                  const newJobs = res?.jobs.filter(
                    job => !existingIds.has(job._id),
                  );
                  return [...prevJobs, ...newJobs];
                });
                setLastLoadedPage(pageIndex);
              } else {
                setFilteredJobs(res?.jobs);
                setLastLoadedPage(1);
              }
              resolve(res);
            },
          }),
        );
      });
    },
    [dispatch, jobs?.pageSize],
  );

  const handleSearch = useMemo(() => {
    return _.debounce(searchTerm => {
      setIsLoading('searching');
      if (searchTerm.trim()) {
        apiCall({
          isCurrent: job === 'current',
          pageIndex: 1,
          keyword: searchTerm.trim(),
        });
      } else {
        apiCall({
          isCurrent: job === 'current',
          pageIndex: 1,
        });
      }
      setIsLoading('');
    }, 1000);
  }, [apiCall, job]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setAllDataLoaded(false);
      setLastLoadedPage(0);

      apiCall({
        isCurrent: job === 'current',
        pageIndex: 1,
      }).then(() => {
        setSearch('');
        setJob('current');
      });
    });
  }, [navigation, apiCall, job]);

  const onRefresh = async () => {
    setIsLoading('refreshing');
    setSearch('');
    setAllDataLoaded(false);
    setLastLoadedPage(0);

    await apiCall({
      isCurrent: job === 'current',
      pageIndex: 1,
    });
  };

  const handleLoadMore = async () => {
    const totalPages = Math.ceil(jobs?.totalRecords / jobs?.pageSize);
    const nextPageToLoad = lastLoadedPage + 1;

    if (
      !loadingMore &&
      nextPageToLoad <= totalPages &&
      !isLoading &&
      filteredJobs.length < jobs?.totalRecords &&
      !allDataLoaded
    ) {
      setLoadingMore(true);

      // Load next page
      await apiCall({
        isCurrent: job === 'current',
        pageIndex: nextPageToLoad,
        keyword: search?.trim() || undefined,
        loadMore: true,
      });
    }
  };

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator
          size="small"
          color={AppTheme?.DefaultPalette()?.primary?.main}
        />
        <TextItem size={3} style={styles.loadingMoreText}>
          Loading more...
        </TextItem>
      </View>
    );
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
      {['searching', 'jobs_pending'].includes(isLoading) && (
        <LoadingComponent
          top={-2}
          borders={{
            topLeft: 10,
            topRight: 10,
          }}
        />
      )}

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Layout>
          <HeadingDetails
            justifyContent={'flex-start'}
            heading={'Jobs'}
            description={''}
            details={{
              heading: {
                size: 6.5,
                color: AppTheme?.DefaultPalette()?.text?.title,
              },

              customStyles: {
                heading: {
                  marginBottom: AppTheme?.WP(1),
                  width: '100%',
                  paddingHorizontal: AppTheme?.WP(2),
                },
              },
            }}
          />

          {isSalesman && (
            <TouchableOpacity
              style={styles.addNew}
              onPress={() => setModel('add_new_job')}>
              <Icon
                name="plus"
                size={AppTheme?.WP(5)}
                color={AppTheme?.DefaultPalette()?.success?.main}
              />
              <TextItem
                style={{marginLeft: AppTheme?.WP(2)}}
                size={4}
                color={AppTheme?.DefaultPalette()?.success?.main}>
                Add New
              </TextItem>
            </TouchableOpacity>
          )}

          <JobButtonContainer justifyContent={'space-between'}>
            <View style={styles.paginationInfo}>
              <TextItem size={2.8} color="#666">
                {jobs?.totalRecords > 0
                  ? `Showing ${Math.min(
                      filteredJobs.length,
                      jobs.totalRecords,
                    )} of ${jobs.totalRecords} jobs`
                  : 'No Jobs Found'}
              </TextItem>
            </View>

            <JobsButtonWrapper>
              <JobButton
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  borderRightWidth: 2,
                  borderColor: AppTheme?.DefaultPalette()?.success?.main,
                }}
                active={job === 'current'}
                onPress={async () => {
                  setJob('current');
                  dispatch(clearJobDetails());
                  await apiCall({
                    pageIndex: 1,
                    isCurrent: true,
                    keyword: search?.trim() || undefined,
                  });
                }}>
                <TextItem
                  size={3.5}
                  color={
                    job === 'current' &&
                    AppTheme?.DefaultPalette()?.success?.main
                  }>
                  Current
                </TextItem>
              </JobButton>
              <JobButton
                active={job === 'past'}
                onPress={async () => {
                  setJob('past');
                  await apiCall({
                    pageIndex: 1,
                    isCurrent: false,
                    keyword: search?.trim() || undefined,
                  });
                }}>
                <TextItem
                  size={3.5}
                  color={
                    job === 'past' && AppTheme?.DefaultPalette()?.success?.main
                  }>
                  Past
                </TextItem>
              </JobButton>
            </JobsButtonWrapper>
          </JobButtonContainer>

          <SearchBar>
            <TextInput
              value={search}
              ref={search_ref}
              multiline={false}
              variant={'outlined'}
              inputMode={'text'}
              rightIcon={'magnify'}
              disabled={!!isLoading}
              returnKeyType={'done'}
              secureTextEntry={false}
              placeholderColor={AppTheme?.DefaultPalette()?.text?.primary}
              placeholder={'Search Keyword...'}
              onChangeText={text => {
                setSearch(text);
                handleSearch(text);
              }}
              submit={() => {}}
            />
          </SearchBar>

          <FlatList
            data={filteredJobs}
            style={styles.flatList}
            keyExtractor={item =>
              `item_${item._id}_${item.createdAt || new Date().toISOString()}`
            }
            showsVerticalScrollIndicator={false}
            refreshing={isLoading === 'refreshing'}
            onRefresh={() => onRefresh()}
            contentContainerStyle={styles.flatListContainer(
              filteredJobs?.length,
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <Empty height={35} title={`No ${job} jobs are available`} />
            }
            renderItem={({item}) => (
              <JobCard
                role={role}
                item={item}
                onPressBid={() =>
                  navigation.navigate('JobBidding', {
                    company: item?.title,
                    id: item?._id,
                  })
                }
                onPressCard={() =>
                  navigation.navigate('JobNavigation', {
                    company: item?.title,
                    id: item?._id,
                  })
                }
              />
            )}
          />
        </Layout>
      </TouchableWithoutFeedback>

      {/* Models */}
      {['add_new_job'].includes(model) && (
        <InitiateJobModel
          addJobPending={isLoading === 'adding_job'}
          title={'Add new Job'}
          visible={['add_new_job'].includes(model)}
          onCancel={() => setModel('')}
          onConfirm={({
            jobTitle,
            customer,
            paymentBy,
            hoverServices,
            takeoffs,
            hardware,
          }) => {
            setIsLoading('adding_job');

            dispatch(
              addJobAPI({
                data: {
                  title: jobTitle,
                  supplierSalesman: userMe?._id,
                  customer: customer,
                  takeoffs: takeoffs?.filter(takeoff => takeoff.trim() !== ''),
                  paymentBy: paymentBy,
                  isEnableHoverServices: hoverServices,
                  isHardware: hardware,
                },
                callback: async () => {
                  await apiCall({
                    isCurrent: job === 'current',
                    pageIndex: 1,
                  }).then(() => {
                    setModel('');
                    setIsLoading('');
                  });
                },
                errorCallback: () => {
                  setIsLoading('');
                },
                refreshing: () => {
                  setIsLoading('');
                },
              }),
            );
          }}
        />
      )}

      {/* {['job_submission'].includes(model) && (
        <JobSubmissionModal
          title={'Job Name'}
          visible={['job_submission'].includes(model)}
          onCancel={() => setModel('')}
          onConfirm={({description, attachment}) => {
            console.log('confirm', description, attachment);
            setModel('');
          }}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform?.OS === 'ios' ? AppTheme?.WP(14) : AppTheme?.WP(3),
    backgroundColor: 'white',
  },
  layoutModel: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme?.WP(3),
  },
  loadingMoreText: {
    marginLeft: AppTheme?.WP(2),
    color: AppTheme?.DefaultPalette()?.text?.secondary,
  },
  paginationInfo: {
    paddingHorizontal: AppTheme?.WP(3),
    paddingVertical: AppTheme?.WP(1),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  addNew: {
    flex: 1,
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AppTheme?.WP(5),
    paddingVertical: AppTheme?.WP(1.5),
    paddingHorizontal: AppTheme?.WP(4),
    position: 'absolute',
    right: AppTheme?.WP(4),
    top: AppTheme?.WP(4),
  },
});

export {Jobs};
