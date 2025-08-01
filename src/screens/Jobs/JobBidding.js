/* eslint-disable react-hooks/exhaustive-deps */

import React, {
  useRef,
  useState,
  useMemo,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Platform,
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

// **  Utils
import {showToast} from '../../utils/utils';
import {navigateTo} from '../../navigation/utils';
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Components
import _ from 'lodash';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

// ** Custom Components
import {BarHeader} from '../../components';
import {JobBiddingCard} from '../../components/JobCards/JobBiddingCard';
import {Empty, TextInput} from '../../@core/components';
import LoadingComponent from '../../@core/components/loading/LoadingComponent';

// ** Store && Actions
import {
  GetBidsByJobIdAction,
  SelectEstimatorForBidAction,
} from '../../redux/Jobs';
import {useDispatch, useSelector} from 'react-redux';
import {AuthContext} from '../../@core/infrustructure/context/AuthContext';
import {Layout} from '../../@core/layout';
import {TextItem} from '../../styles/typography';
import {SearchBar} from '../../styles/screens/Jobs';

const JobBidding = ({route}) => {
  // ** params
  const company = route?.params?.company || '';
  const id = route?.params?.id || '';

  // ** navigation
  const navigation = useNavigation();

  // ** Context
  const {role} = useContext(AuthContext);

  // ** Refs
  const search_ref = useRef(null);

  // ** Store
  const dispatch = useDispatch();
  const {userMe} = useSelector(state => state?.auth);
  const {jobBids} = useSelector(state => state?.jobs);

  // ** States
  const [search, setSearch] = useState(null);
  const [isLoading, setIsLoading] = useState('');
  const [isDropDownOpen, setIsDropDownOpen] = useState(null);
  const [filteredBids, setFilteredBids] = useState(jobBids?.data || []);

  const handleSearch = useMemo(() => {
    return _.debounce(searchTerm => {
      setIsLoading('searching');
      if (searchTerm.trim()) {
        const filtered = jobBids?.data?.filter(bid => {
          const fullName =
            `${bid.user.firstName} ${bid.user.lastName}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        });
        setFilteredBids(filtered);
      } else {
        setFilteredBids(jobBids?.data);
      }
      setIsLoading('');
    }, 1000);
  }, [jobBids?.data]);

  const apiCall = async ({pageIndex}) => {
    return new Promise((resolve, reject) => {
      dispatch(
        GetBidsByJobIdAction({
          data: {
            id,
            pageIndex,
            pageSize: jobBids?.pageSize,
          },
          refreshing: () => setIsLoading(''),
          errorCallback: err => {
            reject(err);
            setIsLoading('');
          },
          callback: res => {
            resolve(res);
          },
        }),
      );
    });
  };

  useEffect(() => {
    setIsLoading('BidsByJobId_pending');
    return navigation.addListener('focus', () =>
      apiCall({pageIndex: jobBids?.pageIndex}).then(res =>
        setFilteredBids(res?.bids),
      ),
    );
  }, [navigation, id]);

  const onRefresh = async () => {
    setIsLoading('refreshing');
    await apiCall({pageIndex: 1}).then(res => setFilteredBids(res?.bids));
  };

  const handlePressSelect = ({bidId, userId, bidderName}) => {
    setIsLoading(bidId);
    dispatch(
      SelectEstimatorForBidAction({
        data: {
          jobId: id,
          bidId,
        },
        refreshing: () => setIsLoading(''),
        errorCallback: () => setIsLoading(''),
        callback: () => {
          navigateTo('Jobs');
          onSendMessage({jobId: id, userId, bidId, bidderName});
          showToast({
            type: 'success',
            title: 'Select Estimator',
            message: 'Estimator has been selected',
          });
        },
      }),
    );
  };

  const onSendMessage = useCallback(({jobId, userId, bidId, bidderName}) => {
    const message = {
      text: `${bidderName} has been selected as a new estimator`,
      job: {
        id: jobId,
        bidId,
        name: company,
      },
      createdAt: new Date(),
      receiver: {
        id: userId,
        name: bidderName,
      },
      sender: {
        id: userMe?._id,
        name: `${userMe?.firstName} ${userMe?.lastName}`,
      },
      unread: true,
    };

    database().ref(`/notification/user/${userId}`).push(message);

    database()
      .ref(`/users/${userId}/fcmToken`)
      .once('value', snapshot => {
        const fcmToken = snapshot.val();
        if (fcmToken) {
          sendPushNotification({
            fcmToken,
            title: message?.job?.name,
            message: message.text,
          }).then(() => {});
        }
      });
  }, []);

  const sendPushNotification = async ({fcmToken, title, message}) => {
    const notification = {
      to: fcmToken,
      notification: {
        title,
        body: message,
      },
      data: {
        title,
        body: message,
      },
    };

    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'key=AAAA3FsK6Kw:APA91bFem_deKoBT-EaBMOpWmDdyu0KI4u7WOtVvzsyCDaMt-D-zKuHUE3ZpYglriJKHu0bvBPJzWtcFJ4YFUahu1-VhazLwlBT8jfJrninJdgsrQ9fXfmd5fZ2px5E6Unx-_uOT5K2o',
        },
        body: JSON.stringify(notification),
      });

      const responseText = await response.text();
      console.log('Push notification response text:', responseText);

      // Try to parse the response as JSON
      try {
        const data = JSON.parse(responseText);
        console.log('Push notification response JSON:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  return (
    <View style={styles.MainContainer}>
      <BarHeader
        onBack={() => navigation.goBack()}
        user={{
          bg: AppTheme?.DefaultPalette()?.grey[100],
          marginBottom: 0,
          marginTop: 0,
          width: 11,
          height: 11,
        }}
      />
      {isLoading === 'BidsByJobId_pending' && (
        <LoadingComponent
          top={-2}
          borders={{
            topLeft: 10,
            topRight: 10,
          }}
        />
      )}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.layoutModel}>
          {/* Header with job/company name */}
          <View style={styles.headerContainer}>
            <TextItem size={5.2} weight="bold" style={styles.headerTitle}>
              {company}
            </TextItem>
          </View>
          {/* Search Bar */}
          <SearchBar style={styles.searchBarWrapper}>
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
          {/* List of Bids */}
          <FlatList
            data={filteredBids}
            style={styles.flatList}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading === 'refreshing'}
            onRefresh={() => onRefresh()}
            contentContainerStyle={styles.flatListContainer(
              filteredBids?.length,
            )}
            ListEmptyComponent={
              <Empty height={35} title={'No biddings are available'} />
            }
            renderItem={({item}) => (
              <JobBiddingCard
                item={item}
                role={role}
                isLoading={isLoading === item?._id}
                rating={item?.user?.averageRating}
                onPress={() => {
                  handlePressSelect({
                    bidId: item?._id,
                    userId: item?.user?._id,
                    bidderName: `${item?.user?.firstName} ${item?.user?.lastName}`,
                  });
                }}
              />
            )}
          />
        </View>
      </TouchableWithoutFeedback>
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
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: AppTheme?.WP(8),
    marginBottom: AppTheme?.WP(2),
    marginTop: AppTheme?.WP(2),
  },
  headerTitle: {
    color: AppTheme?.DefaultPalette()?.text?.title,
  },
  searchBarWrapper: {
    width: '100%',
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
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: AppTheme?.WP(10),
  },
});

export {JobBidding};
