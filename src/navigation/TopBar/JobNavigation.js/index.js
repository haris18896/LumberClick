/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

// ** Third Party Packages
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// ** Custom Components
import {
  Hover,
  Overview,
  Documents,
  MaterialQuantity,
} from '../../../screens/Jobs';
import TopBar from '../TopBar';
import { TextItem } from '../../../styles/typography';
import LoadingComponent from '../../../@core/components/loading/LoadingComponent';

// ** Store && Actions
import {
  fetchJobById,
  clearJobDetails,
  fetchJobRevisions,
  fetchMaterialCount,
  fetch_3DModel_and_Revision,
} from '../../../redux/Jobs/JobDetailsSlice';

const JobTab = createMaterialTopTabNavigator();

const JobNavigation = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Extract the params
  const { company, id } = route.params || {};

  const [url_3d, setUrl_3d] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documentsLength, setDocumentsLength] = useState(0);
  const [isDocumentsLoaded, setIsDocumentsLoaded] = useState(false);

  // Centralized API call function
  const apiCall = useCallback(() => {
    if (id) {
      setIsLoading('jobs_pending');
      setIsDocumentsLoaded(false);
      return Promise.all([
        dispatch(
          fetchJobById({
            data: { id },
            refreshing: () => {},
            callback: res => {
              setDocumentsLength(res?.documents?.length);
              setIsDocumentsLoaded(true);
            },
            errorCallback: () => {
              setIsLoading('');
              setIsDocumentsLoaded(true);
            },
          }),
        ),
        dispatch(
          fetchJobRevisions({
            data: { id },
            refreshing: () => {},
            callback: () => {},
            errorCallback: () => {
              setIsLoading('');
            },
          }),
        ),
        dispatch(
          fetchMaterialCount({
            data: { id },
            refreshing: () => {},
            callback: () => {},
            errorCallback: () => {
              setIsLoading('');
            },
          }),
        ),
        dispatch(
          fetch_3DModel_and_Revision({
            data: { id },
            refreshing: () => {},
            errorCallback: () => {
              setIsLoading('');
            },
            callback: () => {},
          }),
        ),
      ]).then(() => {
        setIsLoading('');
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    apiCall();
    return () => {
      dispatch(clearJobDetails());
    };
  }, [company, id, apiCall, dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isLoading === 'refreshing') {
        apiCall();
      }
    });

    return unsubscribe;
  }, [navigation, apiCall, isLoading]);

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <TextItem size={4}>Missing job ID</TextItem>
      </View>
    );
  }

  const TopBarRender = props => (
    <TopBar
      {...props}
      url_3d={url_3d}
      setUrl_3d={setUrl_3d}
      title={company || 'Job Details'}
      setIsLoading={setIsLoading}
    />
  );

  // if (!isDocumentsLoaded) {
  //   return <LoadingComponent />;
  // }

  return (
    <JobTab.Navigator
      // initialRouteName={documentsLength > 0 ? 'Overview' : 'Documents'}
      initialRouteName={'Overview'}
      screenOptions={{
        tabBarScrollEnabled: false,
        swipeEnabled: true,
        animationEnabled: true,
        sceneStyle: {
          backgroundColor: 'white',
        },
      }}
      screenListeners={{
        tabPress: () => {
          setUrl_3d('');
        },
      }}
      tabBar={TopBarRender}
    >
      <JobTab.Screen
        name="Overview"
        options={{ tabBarLabel: 'Overview' }}
        children={() => (
          <Overview
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            jobId={id}
            company={company}
            apiCall={apiCall}
          />
        )}
      />

      <JobTab.Screen
        name="Documents"
        options={{ tabBarLabel: 'Documents' }}
        children={() => (
          <Documents
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            jobId={id}
            company={company}
            apiCall={apiCall}
          />
        )}
      />

      <JobTab.Screen
        name="MaterialQuantity"
        options={{ tabBarLabel: '3D & Material' }}
        children={() => (
          <MaterialQuantity
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            jobId={id}
            company={company}
            apiCall={apiCall}
          />
        )}
      />

      <JobTab.Screen
        name="Hover"
        options={{ tabBarLabel: 'Hover' }}
        children={() => (
          <Hover
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            jobId={id}
            company={company}
            apiCall={apiCall}
            url_3d={url_3d}
            setUrl_3d={setUrl_3d}
          />
        )}
      />
    </JobTab.Navigator>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  safeView: {
    position: 'relative',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default JobNavigation;
