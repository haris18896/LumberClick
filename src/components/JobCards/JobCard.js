import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

// ** Utils
import {hexToRgba} from '../../utils/utils';
import {theme as AppTheme} from '../../@core/infrustructure/theme';
import {getStatusColor, jobDetails} from '../../utils/jobUtils';
import {permissions, ProtectedComponent} from '../../@core/auth/acl';

// ** Third Party Packages
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ** Custom Components
import {TextItem} from '../../styles/typography';
import {RowStart} from '../../styles/infrustucture';

// ** SVGs
import {useSelector} from 'react-redux';
import {useAuth} from '../../@core/infrustructure/context/AuthContext';

const JobCard = props => {
  // ** Props
  const {item, onPressBid, onPressCard} = props;

  const {role} = useAuth();

  // ** Navigation
  const navigation = useNavigation();

  // ** Store
  const {userMe} = useSelector(state => state?.auth);

  // ** Constants

  const statusColor = getStatusColor(item?.status);

  return (
    <TouchableOpacity
      onPress={onPressCard}
      style={[styles.card, {borderLeftColor: statusColor}]}>
      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => {
          navigation.navigate('Chat', {
            name: item?.title,
            _id: item?._id,
            userId: userMe?._id,
            userName: userMe?.username,
          });
        }}>
        <Icon
          name={'chat'}
          color={AppTheme?.DefaultPalette()?.success?.main}
          size={22}
        />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <TextItem size={4.5} weight="bold" style={styles.titleText}>
            {item?.title}
          </TextItem>

          <RowStart>
            {item?.customer && (
              <TextItem
                size={3.2}
                color={AppTheme?.DefaultPalette()?.grey[600]}
                style={styles.customerText}>
                {item.customer.firstName} {item.customer.lastName}
              </TextItem>
            )}
            {/* Status Pill below header */}
            <View style={styles.statusPillRow}>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: hexToRgba(statusColor, 0.15),
                    borderColor: statusColor,
                  },
                ]}>
                <TextItem size={2.8} color={statusColor} weight="medium">
                  {item?.status}
                </TextItem>
              </View>
            </View>
          </RowStart>
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {jobDetails(item).map((d, idx) => (
          <View key={idx} style={styles.detailItem}>
            <View style={styles.detailIcon}>{d.icon}</View>
            <View style={styles.detailTextCol}>
              <TextItem
                size={2.7}
                color={AppTheme?.DefaultPalette()?.grey[500]}>
                {d.label}
              </TextItem>
              <TextItem size={3.2} weight="medium" style={styles.detailValue}>
                {d.value}
              </TextItem>
            </View>
          </View>
        ))}
      </View>

      {/* Bids Button */}

      <TouchableOpacity style={styles.bidsButton} onPress={onPressBid}>
        <TextItem size={3.5} weight="bold" color="#fff">
          Bids
        </TextItem>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: AppTheme?.WP(2),
    marginHorizontal: AppTheme?.WP(2),
    padding: AppTheme?.WP(4),
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  chatButton: {
    position: 'absolute',
    top: AppTheme?.WP(3),
    right: AppTheme?.WP(3),
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme?.WP(2),
  },
  headerTextCol: {
    flex: 1,
  },
  titleText: {
    color: AppTheme?.DefaultPalette()?.text?.title,
    marginBottom: AppTheme?.WP(0.5),
  },
  customerText: {
    marginTop: AppTheme?.WP(0.5),
  },
  statusPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: AppTheme?.WP(2),
  },
  statusPill: {
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: AppTheme?.WP(3),
    paddingVertical: AppTheme?.WP(1),
    alignSelf: 'flex-start',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: AppTheme?.WP(2),
    marginBottom: AppTheme?.WP(3),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: AppTheme?.WP(2),
  },
  detailIcon: {
    marginRight: AppTheme?.WP(2),
  },
  detailTextCol: {
    flex: 1,
  },
  detailValue: {
    marginTop: AppTheme?.WP(0.5),
    color: AppTheme?.DefaultPalette()?.text?.primary,
  },
  bidsButton: {
    marginTop: AppTheme?.WP(2),
    backgroundColor: AppTheme?.DefaultPalette()?.success?.main,
    borderRadius: 24,
    paddingVertical: AppTheme?.WP(3),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: AppTheme?.DefaultPalette()?.success?.main,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export {JobCard};
