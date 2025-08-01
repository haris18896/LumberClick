import React, {useState, useEffect} from 'react';
import {
  View,
  Platform,
  Keyboard,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';

// **  Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Components
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

// ** Custom Components
import {BarHeader, ChatCard} from '../../components';
import {LayoutModel} from '../../@core/layout/LayoutModel';
import {Empty, HeadingDetails} from '../../@core/components';
import LoadingComponent from '../../@core/components/loading/LoadingComponent';

// ** Store && Actions
import {useDispatch, useSelector} from 'react-redux';

const ChatHub = () => {
  // ** navigation
  const navigation = useNavigation();

  // ** Store
  const dispatch = useDispatch();
  const {userMe} = useSelector(state => state?.auth);

  // ** States
  // const [unread, setUnread] = useState('All');
  const [isLoading, setIsLoading] = useState('');
  const [chats, setChats] = useState([]);

  useEffect(() => {
    setIsLoading('fetching_chats');
    const chatsRef = database().ref('/messages');
    const unsubscribe = chatsRef.on('value', snapshot => {
      const data = snapshot.val();

      if (data) {
        const chatData = Object.keys(data)
          .map(chatId => {
            const messages = data[chatId]['Chat-Customer'];

            if (messages) {
              const keys = Object.keys(messages);
              const lastKey = keys[keys.length - 1];
              // const lastKey = keys[0];
              const lastItem = messages[lastKey];
              console.log('check last item ...', JSON.stringify(messages));
              return {
                chatId,
                lastItem,
              };
            }
            return null; // Explicitly return null for filtering
          })
          .filter(Boolean); // Filter out null/undefined values
        setChats(chatData);
      } else {
        setChats([]);
      }
      setIsLoading('');
    });

    return () => chatsRef.off('value', unsubscribe);
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
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
          {isLoading === 'fetching_chats' && (
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
              heading={'Chat'}
              description={''}
              details={{
                heading: styles.headingMain,
                customStyles: {
                  heading: styles.customStyles?.heading,
                },
              }}
            />

            {/*<JobButtonContainer*/}
            {/*  style={styles.unReadButtons}*/}
            {/*  justifyContent={'flex-start'}>*/}
            {/*  <JobsButtonWrapper>*/}
            {/*    <JobButton*/}
            {/*      style={{*/}
            {/*        borderRightWidth: 2,*/}
            {/*        borderColor: AppTheme?.DefaultPalette()?.primary?.main,*/}
            {/*      }}*/}
            {/*      active={unread === 'All'}*/}
            {/*      onPress={() => {*/}
            {/*        setUnread('All');*/}
            {/*        setChats(chatsArray);*/}
            {/*      }}>*/}
            {/*      <TextItem*/}
            {/*        size={3.5}*/}
            {/*        color={*/}
            {/*          unread === 'All' &&*/}
            {/*          AppTheme?.DefaultPalette()?.primary?.main*/}
            {/*        }>*/}
            {/*        All*/}
            {/*      </TextItem>*/}
            {/*    </JobButton>*/}
            {/*    <JobButton*/}
            {/*      active={unread === 'unread'}*/}
            {/*      onPress={() => {*/}
            {/*        setUnread('unread');*/}
            {/*        const _chats = chats.filter(item => item?.read === false);*/}
            {/*        setChats(_chats);*/}
            {/*      }}>*/}
            {/*      <TextItem*/}
            {/*        size={3.5}*/}
            {/*        color={*/}
            {/*          unread === 'unread' &&*/}
            {/*          AppTheme?.DefaultPalette()?.primary?.main*/}
            {/*        }>*/}
            {/*        Unread*/}
            {/*      </TextItem>*/}
            {/*    </JobButton>*/}
            {/*  </JobsButtonWrapper>*/}
            {/*</JobButtonContainer>*/}

            <FlatList
              data={chats}
              style={styles.flatList}
              keyExtractor={item => item?.chatId}
              showsVerticalScrollIndicator={false}
              // refreshing={isLoading === 'refreshing'}
              // onRefresh={() => console.log('refreshing...')}
              contentContainerStyle={styles.flatListContainer(chats?.length)}
              ListEmptyComponent={
                <Empty height={35} title={'No Chats Available'} />
              }
              renderItem={({item}) => (
                <ChatCard
                  read={true}
                  image={item?.lastItem?.avatar}
                  name={item?.lastItem?.receiver?.name}
                  time={item?.lastItem?.CreatedAt}
                  // recent={item?.lastItem?.text || item?.lastItem?.Text}
                  onPress={() =>
                    navigation.navigate('Chat', {
                      name: item?.lastItem?.receiver?.name,
                      _id: item?.chatId,
                      userId: userMe?._id,
                      userName: userMe?.username,
                    })
                  }
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
  headingMain: {
    size: '6.5',
    color: AppTheme?.DefaultPalette()?.text?.title,
  },
  customStyles: {
    heading: {
      marginBottom: AppTheme?.WP(0),
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
    marginTop: AppTheme?.WP(1),
    flexDirection: 'column',
    justifyContent: length === 0 ? 'center' : 'flex-start',
  }),
  unReadButtons: {
    paddingLeft: AppTheme?.WP(2),
  },
});

export {ChatHub};
