/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Platform,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

// **  Utils
import { theme as AppTheme } from '../../@core/infrustructure/theme';

// ** Third Party Components
import database from '@react-native-firebase/database';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import { Empty } from '../../@core/components';
import { Avatar, ChatHeader } from '../../components';
import LoadingComponent from '../../@core/components/loading/LoadingComponent';

// ** Store && Actions
import { useSelector } from 'react-redux';

const renderAvatar = props => {
  const { currentMessage } = props;

  const image = currentMessage?.user?.avatar
    ? { uri: currentMessage?.user?.avatar }
    : null;

  return (
    <Avatar
      size={5.2}
      image={image}
      avatarSize={12}
      name={currentMessage?.user?.name}
      background={AppTheme?.DefaultPalette()?.grey[300]}
    />
  );
};

const renderEmptyChat = () => {
  return (
    <View style={styles.emptyChatView}>
      <Empty title={'No messages yet'} />
    </View>
  );
};

const Chat = () => {
  // ** Params
  const {
    params: { name, _id, userId, userName },
  } = useRoute();

  console.log(
    'check params...',
    JSON.stringify({ name, _id, userId, userName }),
  );

  // ** navigation
  const navigation = useNavigation();

  // ** Store
  const { userMe } = useSelector(state => state?.auth);

  // ** States
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState('');

  useEffect(() => {
    setIsLoading('fetching_chats');
    const messagesRef = database().ref(`/messages/${_id}/Chat-Customer`);
    const unsubscribe = messagesRef.on('value', snapshot => {
      if (snapshot.exists()) {
        const messageList = Object.values(snapshot.val());
        console.log(messageList);
        const giftedChatMessages = messageList.map(message => ({
          _id: message._id,
          userId: message?.user?._id,
          text: message.Text || message?.text,
          createdAt: new Date(message.CreatedAt),
          receiver: {
            _id: message?.receiver?._id,
            name: message?.receiver?.name || 'Unknown User',
          },
          user: {
            _id: message?.user?.userId === userMe?._id ? 1 : 2,
            name:
              message?.user?.name ||
              (message?.user?.userId === userMe?._id
                ? userMe?.name
                : userName) ||
              'Unknown User',
          },
        }));

        const sortedMessages = giftedChatMessages.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setMessages(sortedMessages);
      } else {
        setMessages([]);
      }
      setIsLoading('');
    });

    return () => messagesRef.off('value', unsubscribe);
  }, [_id]);

  const onSendMessage = useCallback(
    (messages = []) => {
      const newMessage = messages[0];
      const message = {
        _id: newMessage._id,
        Text: newMessage.text,
        CreatedAt: newMessage.createdAt.toString(),
        receiver: {
          _id: _id,
          name,
        },
        user: {
          userId,
          _id: newMessage.user._id,
          name: userName,
        },
      };

      database().ref(`/messages/${_id}/Chat-Customer`).push(message);
      setInputText('');
    },
    [_id],
  );

  // const onSendMessage = useCallback((messages = []) => {
  //   setInputText('');
  //   setMessages(previousMessages =>
  //     GiftedChat.append(previousMessages, messages),
  //   );
  // }, []);

  return (
    <View style={styles.MainContainer}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={AppTheme?.DefaultPalette()?.primary?.main}
        translucent={false}
        hidden={false}
      />
      <ChatHeader
        name={name}
        status={''}
        onBack={() => navigation.goBack()}
        user={{
          flex: 1,
          bg: AppTheme?.DefaultPalette()?.grey[100],
          marginBottom: 0,
          marginTop: 0,
          width: 11,
          height: 11,
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.chatView}>
          <GiftedChat
            user={{
              _id: 1,
            }}
            text={inputText}
            messages={messages}
            renderAvatar={renderAvatar}
            renderUsernameOnMessage={true}
            showAvatarForEveryMessage={true}
            renderChatEmpty={renderEmptyChat}
            onInputTextChanged={text => setInputText(text)}
            textInputStyle={styles.textInputStyle(inputText.length)}
            messagesContainerStyle={styles.chatWrapper}
            containerStyle={styles.chatContainer}
            onSend={messages => onSendMessage(messages)}
            renderSend={props => {
              return (
                <Send {...props}>
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => props.onSend({ text: props?.text })}
                  >
                    <Icon
                      name={'send'}
                      size={AppTheme?.WP(6)}
                      color={AppTheme?.DefaultPalette()?.success?.main}
                    />
                  </TouchableOpacity>
                </Send>
              );
            }}
            renderBubble={props => {
              const { currentMessage } = props;
              const isDeletedMessage =
                currentMessage?.text?.includes('Message deleted on');

              return (
                <Bubble
                  {...props}
                  linkStyle={styles.linkStyles}
                  wrapperStyle={{
                    left: styles.chatBubbleWrapperLeft,
                    right: styles.chatBubbleWrapperRight,
                  }}
                  textStyle={styles.chatBubble(isDeletedMessage)}
                />
              );
            }}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
      {isLoading === 'fetching_chats' && <LoadingComponent top={-25} />}
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform?.OS === 'ios' ? AppTheme?.WP(14) : AppTheme?.WP(4),
    backgroundColor: AppTheme?.DefaultPalette()?.background?.paper,
  },
  chatView: {
    flex: 1,
    width: '100%',
    position: 'relative',
    paddingHorizontal: AppTheme?.WP(4),
    marginTop: AppTheme?.WP(4),
    borderTopLeftRadius: AppTheme?.WP(4),
    borderTopRightRadius: AppTheme?.WP(4),
    backgroundColor: AppTheme?.DefaultPalette()?.background?.inputBG,
  },
  chatWrapper: {
    width: '100%',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingBottom: AppTheme?.WP(5),
  },
  chatBubbleWrapperLeft: {
    backgroundColor: AppTheme?.DefaultPalette().grey[300],
    marginLeft: 0,
    maxWidth: '75%',
    padding: AppTheme?.WP(1),
  },
  chatBubbleWrapperRight: {
    maxWidth: '75%',
    backgroundColor: AppTheme?.DefaultPalette()?.success?.main,
    padding: AppTheme?.WP(1),
  },
  chatBubble: isDeletedMessage => ({
    right: {
      color: isDeletedMessage
        ? AppTheme?.DefaultPalette()?.error?.main
        : AppTheme?.DefaultPalette()?.common?.white,
      fontSize: isDeletedMessage ? AppTheme?.WP(3) : AppTheme?.WP(4),
      fontFamily: AppTheme?.fonts?.PoppinsRegular,
    },
    left: {
      color: isDeletedMessage
        ? AppTheme?.DefaultPalette()?.error?.main
        : AppTheme?.DefaultPalette()?.grey[800],
      fontSize: isDeletedMessage ? AppTheme?.WP(3) : AppTheme?.WP(4),
      fontFamily: AppTheme?.fonts?.PoppinsRegular,
    },
  }),
  chatContainer: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    // marginTop: AppTheme?.WP(10),
    maxHeight: AppTheme?.WP(20),
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },

  textInputStyle: textLength => ({
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: AppTheme?.WP(5),
    backgroundColor: AppTheme?.DefaultPalette()?.grey[300],
    marginHorizontal: AppTheme?.WP(4),
    paddingTop: AppTheme?.WP(2),
    minHeight: AppTheme?.WP(10),
    paddingHorizontal: AppTheme?.WP(4),
    lineHeight: AppTheme?.WP(5),
    marginBottom: AppTheme?.WP(2),
    color: AppTheme?.DefaultPalette()?.grey[900],
  }),
  sendButton: {
    marginBottom: AppTheme?.WP(4),
    marginRight: AppTheme?.WP(2),
  },
  linkStyles: {
    left: {
      color: AppTheme?.DefaultPalette()?.primary?.light,
    },
    right: {
      color: AppTheme?.DefaultPalette()?.primary?.light,
    },
  },
  emptyChatView: {
    flexGrow: 1,
    transform: [{ scaleY: -1 }],
    paddingTop: '60%',
  },
});

export { Chat };
