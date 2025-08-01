import React, {useEffect} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl} from 'react-native';

// ** Third Party Packages
import moment from 'moment';
import {Card} from 'react-native-paper';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ** Utils
import {hexToRgba} from '../../../utils/utils';
import {theme as AppTheme} from '../../../@core/infrustructure/theme';

// ** Custom Components
import {TextItem} from '../../../styles/typography';
import {RowStart} from '../../../styles/infrustucture';
import {useNavigation} from '@react-navigation/native';
import {JobDetailsCardHeader} from '../../../components';
import LoadingComponent from '../../../@core/components/loading/LoadingComponent';

const Overview = ({company, jobId, isLoading, setIsLoading, apiCall}) => {
  const navigation = useNavigation();
  const {jobData, revisionData} = useSelector(state => state.jobDetails);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isLoading === 'refreshing') {
        apiCall();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, apiCall, isLoading]);

  return (
    <View style={styles.mainContainer}>
      {isLoading === 'jobs_pending' && (
        <LoadingComponent top={AppTheme?.WP(-6)} />
      )}

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading === 'refreshing'}
            onRefresh={() => {
              setIsLoading('refreshing');
              apiCall();
            }}
          />
        }>
        <JobDetailsCardHeader
          company={company}
          customer={{
            name:
              jobData?.customer?.firstName + ' ' + jobData?.customer?.lastName,
            profileImage: jobData?.customer?.profileImage,
          }}
          salesman={{
            name:
              jobData?.supplier?.firstName + ' ' + jobData?.supplier?.lastName,
            profileImage: jobData?.supplier?.profileImage,
          }}
        />

        {jobData && (
          <>
            <View style={styles.cardWrapper}>
              <Card style={styles.card('#fff')}>
                <View style={styles.cardInner}>
                  <Card.Content>
                    <View style={styles.infoContainer}>
                      <TextItem
                        style={{marginBottom: AppTheme?.WP(2)}}
                        size={4}
                        weight="medium"
                        color="#444">
                        Overview
                      </TextItem>

                      <RowStart>
                        <TextItem size={3} color="#666">
                          Job Title :
                        </TextItem>
                        <View style={styles.OverviewValues}>
                          <TextItem size={2.8}>{jobData?.title}</TextItem>
                        </View>
                      </RowStart>

                      <RowStart>
                        <TextItem size={3} color="#666">
                          Customer :
                        </TextItem>
                        <View style={styles.OverviewValues}>
                          <TextItem size={2.8}>
                            {jobData?.customer?.firstName || '---'}{' '}
                            {jobData?.customer?.lastName || '---'}
                          </TextItem>
                        </View>
                      </RowStart>

                      <RowStart>
                        <TextItem size={3} color="#666">
                          Supplier Salesman :
                        </TextItem>
                        <View style={styles.OverviewValues}>
                          <TextItem size={2.8}>
                            {jobData?.supplier?.firstName || '---'}{' '}
                            {jobData?.supplier?.lastName || '---'}
                          </TextItem>
                        </View>
                      </RowStart>

                      <RowStart>
                        <TextItem size={3} color="#666">
                          Payment By :
                        </TextItem>
                        <View
                          style={[
                            styles.OverviewValues,
                            {
                              backgroundColor: jobData?.isPosted
                                ? hexToRgba(
                                    AppTheme?.DefaultPalette()?.success?.main,
                                    0.2,
                                  )
                                : hexToRgba(
                                    AppTheme?.DefaultPalette()?.error?.main,
                                    0.2,
                                  ),
                            },
                          ]}>
                          <TextItem size={2.8}>{jobData?.paymentBy}</TextItem>
                        </View>
                      </RowStart>

                      <RowStart>
                        <TextItem size={3} color="#666">
                          Approved By Qc-R :
                        </TextItem>
                        <View
                          style={[
                            styles.OverviewValues,
                            {
                              backgroundColor: jobData?.isApprovedByQcRep
                                ? hexToRgba(
                                    AppTheme?.DefaultPalette()?.success?.main,
                                    0.2,
                                  )
                                : hexToRgba(
                                    AppTheme?.DefaultPalette()?.error?.main,
                                    0.2,
                                  ),
                            },
                          ]}>
                          <TextItem size={2.8}>
                            {jobData?.isApprovedByQcRep
                              ? moment(jobData?.approvedByQc).format(
                                  'DD MMM YYYY HH:MM a',
                                )
                              : 'Not Approved'}
                          </TextItem>
                        </View>
                      </RowStart>
                    </View>

                    <View
                      style={[
                        styles.infoContainer,
                        {marginTop: AppTheme?.WP(4)},
                      ]}>
                      <TextItem
                        style={{marginBottom: AppTheme?.WP(1)}}
                        size={4}
                        weight="medium"
                        color="#444">
                        Others
                      </TextItem>

                      <RowStart>
                        <TextItem size={3} color="#666">
                          Hardware
                        </TextItem>
                        <View
                          style={styles.hardwareContainer(jobData?.isHardware)}>
                          <TextItem
                            size={2.8}
                            color={
                              jobData?.isHardware
                                ? AppTheme?.DefaultPalette()?.success?.main
                                : AppTheme?.DefaultPalette()?.error?.main
                            }>
                            {jobData?.isHardware ? 'Required' : 'Not Required'}
                          </TextItem>
                        </View>
                      </RowStart>
                    </View>
                  </Card.Content>
                </View>
              </Card>
            </View>

            {/* Revisions Card */}
            <View style={styles.cardWrapper}>
              <Card style={styles.card('#fff')}>
                <View style={styles.cardInner}>
                  <Card.Content>
                    <View style={styles.revisionHeader}>
                      <TextItem size={4} weight="medium" color="#444">
                        Revisions
                      </TextItem>
                      <View size={AppTheme.WP(7)} style={styles.revisionBadge}>
                        <TextItem size={3} color="#0288d1">
                          {`Total ${
                            revisionData?.revisions?.length || '---'
                          } revision${
                            revisionData?.revisions?.length > 1 ? 's' : ''
                          }`}
                        </TextItem>
                      </View>
                    </View>

                    {revisionData?.revisions &&
                      revisionData?.revisions?.length > 0 &&
                      revisionData?.revisions.map((revision, index) => (
                        <View
                          key={revision._id || index}
                          style={styles.revisionItem}>
                          <View style={styles.revisionDate}>
                            <Icon
                              name="calendar-today"
                              size={18}
                              color="#555"
                              style={styles.revisionIcon}
                            />
                            <TextItem size={3.2}>
                              {moment(revision.revisedAt).format(
                                'DD MMM YYYY HH:MM A',
                              )}
                            </TextItem>
                          </View>

                          <View style={styles.revisionInfo}>
                            {revision.revisedBy && (
                              <View style={styles.revisionBy}>
                                <Icon
                                  name="person"
                                  size={18}
                                  color="#555"
                                  style={styles.revisionIcon}
                                />
                                <TextItem size={3} color="#666">
                                  Revised by{' '}
                                  {`${revision.revisedBy.firstName} ${revision.revisedBy.lastName}`}
                                </TextItem>
                              </View>
                            )}

                            <View style={styles.revisionStatus}>
                              <Icon
                                name={
                                  revision.isApproved
                                    ? 'check-circle'
                                    : 'pending'
                                }
                                size={18}
                                color={
                                  revision.isApproved ? '#4CAF50' : '#FF9800'
                                }
                                style={styles.revisionIcon}
                              />
                              <TextItem
                                size={3}
                                color={
                                  revision.isApproved ? '#4CAF50' : '#FF9800'
                                }>
                                {revision.isApproved
                                  ? 'Approved'
                                  : 'Pending Approval'}
                              </TextItem>
                            </View>
                          </View>
                        </View>
                      ))}
                  </Card.Content>
                </View>
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: AppTheme?.WP(2),
  },
  container: {
    flex: 1,
    padding: AppTheme.WP(4),
    position: 'relative',
  },
  cardWrapper: {
    borderRadius: AppTheme.WP(3),
    marginBottom: AppTheme.WP(4),
  },
  card: backgroundColor => ({
    paddingVertical: AppTheme.WP(3),
    elevation: 3,
    borderRadius: AppTheme.WP(3),
    backgroundColor: backgroundColor,
  }),
  cardInner: {
    borderRadius: AppTheme.WP(3),
    overflow: 'hidden',
  },

  cardBorders: {
    borderWidth: 1,
    borderColor: AppTheme?.DefaultPalette()?.success?.main,
    borderStyle: 'dashed',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme?.WP(4),
    paddingHorizontal: AppTheme?.WP(3),
  },

  iconContainer: {
    width: AppTheme?.WP(10),
    height: AppTheme?.WP(10),
    borderRadius: AppTheme?.WP(5),
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme?.WP(3),
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    marginBottom: AppTheme?.WP(1),
    color: AppTheme?.DefaultPalette()?.text?.title,
  },
  titleContainer: {
    marginBottom: AppTheme.WP(1),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: AppTheme.WP(1),
  },
  section: {
    marginVertical: AppTheme.WP(2),
  },
  sectionTitle: {
    marginBottom: AppTheme.WP(2),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: AppTheme.WP(2),
  },
  profileDetails: {
    marginLeft: AppTheme.WP(3),
    flex: 1,
  },
  divider: {
    marginVertical: AppTheme.WP(3),
    height: 1,
  },
  infoContainer: {
    marginTop: AppTheme.WP(2),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.WP(3),
  },
  infoIcon: {
    marginRight: AppTheme.WP(3),
  },
  infoContent: {
    flex: 1,
  },
  revisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.WP(3),
  },
  revisionBadge: {
    backgroundColor: '#e1f5fe',
    color: '#0288d1',
    paddingHorizontal: AppTheme.WP(2),
    paddingVertical: AppTheme.WP(1),
    borderRadius: AppTheme.WP(2),
  },
  revisionItem: {
    borderRadius: AppTheme.WP(2),
    marginBottom: AppTheme.WP(2),
  },
  revisionDate: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.WP(2),
  },
  revisionInfo: {
    marginLeft: AppTheme.WP(1),
  },
  revisionBy: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.WP(1),
  },
  revisionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revisionIcon: {
    marginRight: AppTheme.WP(1),
  },
  avatar: {
    backgroundColor: '#eee',
  },
  hardwareContainer: isHardware => ({
    marginLeft: 'auto',
    paddingHorizontal: AppTheme.WP(2),
    borderRadius: AppTheme.WP(2),
    backgroundColor: isHardware
      ? hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.2)
      : hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 0.2),
  }),
  OverviewValues: {
    marginTop: AppTheme.WP(1),
    marginLeft: 'auto',
    paddingHorizontal: AppTheme.WP(2),
    borderRadius: AppTheme.WP(2),
  },
});

export {Overview};
