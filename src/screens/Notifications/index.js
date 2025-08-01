import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';

// **  Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Components
import {useNavigation} from '@react-navigation/native';

// ** Custom Components
import {
  JobButton,
  JobsButtonWrapper,
  JobButtonContainer,
} from '../../styles/screens/Jobs';
import {TextItem} from '../../styles/typography';
import {BarHeader, NotificationCard} from '../../components';
import {Empty, HeadingDetails} from '../../@core/components';
import {LayoutModel} from '../../@core/layout/LayoutModel';

// ** Store && Actions
import {useSelector} from 'react-redux';

// ** Dummy
import database from '@react-native-firebase/database';
import LoadingComponent from '../../@core/components/loading/LoadingComponent';

const Notifications = () => {
  // ** navigation
  const navigation = useNavigation();

  // ** Store
  const {userMe} = useSelector(state => state?.auth);

  // ** States
  const [notes, setNotes] = useState([]);
  const [unread, setUnread] = useState('All');
  const [isLoading, setIsLoading] = useState('');
  const [notifications, setNotifications] = useState(notes);

  useEffect(() => {
    setIsLoading('fetching_notifications');
    const notificationsRef = database().ref(
      `/notification/user/${userMe?._id}`,
    );
    const unsubscribe = notificationsRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const notificationData = Object.keys(data).map(messageId => {
          const message = data[messageId];
          return {
            userId: userMe?._id,
            messageId,
            icon: 'message',
            iconColor: '#28C76F',
            unread: message?.unread,
            title: message?.job?.name,
            lastMessage: message?.text,
          };
        });
        setNotes(notificationData);
        setNotifications(notificationData);
      } else {
        setNotes([]);
        setNotifications([]);
      }
      setIsLoading('');
    });

    return () => notificationsRef.off('value', unsubscribe);
  }, [navigation, userMe]);

  const updateMessageReadStatus = ({jobId, userId, messageId}) => {
    const messageRef = database().ref(
      `/notification/user/${userId}/${messageId}`,
    );

    messageRef.once('value', snapshot => {
      if (snapshot.exists() && snapshot.val().unread === true) {
        messageRef
          .update({unread: false})
          .then(() => {
            console.log('Message status updated to read');
          })
          .catch(error => {
            console.error('Error updating message status: ', error);
          });
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View style={styles.MainContainer}>
          <BarHeader
            onBack={() => navigation.toggleDrawer()}
            user={{
              bg: AppTheme?.DefaultPalette()?.grey[100],
              marginBottom: 0,
              marginTop: 0,
              width: 11,
              height: 11,
            }}
          />
          {isLoading === 'fetching_notifications' && (
            <LoadingComponent
              top={-2}
              borders={{
                topLeft: 10,
                topRight: 10,
              }}
            />
          )}
          <LayoutModel>
            <HeadingDetails
              justifyContent={'flex-start'}
              heading={'Notifications'}
              description={''}
              details={{
                heading: styles.headingMain,
                customStyles: {
                  heading: styles.customStyles?.heading,
                },
              }}
            />

            <JobButtonContainer
              style={styles.unReadButtons}
              justifyContent={'flex-start'}>
              <JobsButtonWrapper>
                <JobButton
                  style={{
                    borderRightWidth: 2,
                    borderColor: AppTheme?.DefaultPalette()?.success?.main,
                  }}
                  active={unread === 'All'}
                  onPress={() => {
                    setUnread('All');
                    setNotifications(notes);
                  }}>
                  <TextItem
                    size={3.5}
                    color={
                      unread === 'All' &&
                      AppTheme?.DefaultPalette()?.success?.main
                    }>
                    All
                  </TextItem>
                </JobButton>
                <JobButton
                  active={unread === 'unread'}
                  onPress={() => {
                    setUnread('unread');
                    const _notifications =
                      notes?.length > 0
                        ? notes.filter(item => item?.unread === true)
                        : [];
                    setNotifications(_notifications);
                  }}>
                  <TextItem
                    size={3.5}
                    color={
                      unread === 'unread' &&
                      AppTheme?.DefaultPalette()?.success?.main
                    }>
                    Unread
                  </TextItem>
                </JobButton>
              </JobsButtonWrapper>
            </JobButtonContainer>

            <FlatList
              data={notifications}
              style={styles.flatList}
              keyExtractor={item => item.messageId}
              showsVerticalScrollIndicator={false}
              // refreshing={isLoading === 'refreshing'}
              // onRefresh={() => console.log('refreshing...')}
              contentContainerStyle={styles.flatListContainer(
                notifications?.length,
              )}
              ListEmptyComponent={
                <Empty height={35} title={'No Notifications Available'} />
              }
              renderItem={({item}) => (
                <NotificationCard
                  read={!item?.unread}
                  icon={item?.icon}
                  title={item?.title}
                  iconColor={item?.iconColor}
                  description={item?.lastMessage}
                  onPress={() => {
                    updateMessageReadStatus({
                      jobId: item?.jobId,
                      userId: item?.userId,
                      messageId: item?.messageId,
                    });
                  }}
                />
              )}
            />
          </LayoutModel>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform?.OS === 'ios' ? AppTheme?.WP(14) : AppTheme?.WP(4),
    backgroundColor: 'white',
  },
  authContainer: {
    paddingBottom: AppTheme?.WP(15),
  },
  headingMain: {
    size: '6.5',
    color: AppTheme?.DefaultPalette()?.text?.title,
  },
  customStyles: {
    heading: {
      marginBottom: AppTheme?.WP(1),
      width: '100%',
      paddingHorizontal: AppTheme?.WP(2),
    },
  },
  flatList: {
    flex: 1,
    width: '100%',
    paddingBottom: AppTheme?.WP(10),
  },
  flatListContainer: length => ({
    marginTop: AppTheme?.WP(4),
    flexDirection: 'column',
    justifyContent: length === 0 ? 'center' : 'flex-start',
  }),
  unReadButtons: {
    paddingLeft: AppTheme?.WP(2),
  },
});

export {Notifications};
