/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third Party Packages
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {Avatar} from '../Avatar/Avatar';
import {TextItem} from '../../styles/typography';

const JobBiddingCard = props => {
  // ** props
  const {item, isLoading, onPress} = props;

  // Calculate average rating
  const reviews = item?.user?.reviews || [];
  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      ).toFixed(1)
    : null;

  return (
    <View
      style={[
        styles.compactCard,
        item?.isSelected && {
          borderColor: AppTheme?.DefaultPalette()?.success?.main,
          borderWidth: 2,
        },
      ]}>
      {/* Avatar */}
      <View style={styles.avatarCol}>
        <Avatar
          size={4.5}
          avatarSize={8}
          image={null}
          name={`${item?.user?.firstName} ${item?.user?.lastName}`}
        />
      </View>
      {/* Main Info */}
      <View style={styles.infoCol}>
        {/* Top Row: Name, Rating, Price, Days */}
        <View style={styles.topRow}>
          <TextItem
            size={3.7}
            weight="bold"
            style={styles.nameText}
            numberOfLines={1}>
            {item?.user?.firstName} {item?.user?.lastName}
          </TextItem>
          <View style={styles.ratingInline}>
            {avgRating ? (
              <>
                <Icon
                  name="star"
                  size={15}
                  color="#FFD700"
                  style={{marginRight: 2}}
                />
                <TextItem
                  size={2.7}
                  color={AppTheme?.DefaultPalette()?.grey[700]}>
                  {avgRating}
                </TextItem>
                <TextItem
                  size={2.5}
                  color={AppTheme?.DefaultPalette()?.grey[500]}>
                  ({reviews.length})
                </TextItem>
              </>
            ) : (
              <TextItem
                size={2.5}
                color={AppTheme?.DefaultPalette()?.grey[400]}>
                No reviews
              </TextItem>
            )}
          </View>
          <TextItem
            size={3.7}
            weight="bold"
            color={AppTheme?.DefaultPalette()?.info?.main}
            style={styles.priceText}>
            {item?.price ? `$${item?.price}` : '--'}
          </TextItem>
          {item?.expectedDays && (
            <View style={styles.daysBadge}>
              <TextItem
                size={2.5}
                color={AppTheme?.DefaultPalette()?.info?.main}
                weight="medium">
                {item.expectedDays}d
              </TextItem>
            </View>
          )}
        </View>
        {/* Bottom Row: Proposal, Select Button */}
        <View style={styles.bottomRow}>
          <TextItem
            size={2.9}
            color={AppTheme?.DefaultPalette()?.grey[700]}
            numberOfLines={1}
            style={styles.proposalText}>
            {item?.proposal || 'No proposal'}
          </TextItem>
          <TouchableOpacity
            style={[
              styles.selectPill,
              (item?.isSelected || isLoading) && styles.selectPillDisabled,
            ]}
            onPress={onPress}
            disabled={isLoading || item?.isSelected}>
            <TextItem size={2.9} weight="bold" color="#fff">
              {item?.isSelected
                ? 'Selected'
                : isLoading
                ? 'Loading...'
                : 'Select'}
            </TextItem>
          </TouchableOpacity>
        </View>
        {/* Bid Date (optional, compact) */}
        {item?.bidAt && (
          <TextItem
            size={2.3}
            color={AppTheme?.DefaultPalette()?.grey[400]}
            style={styles.bidDateText}>
            {moment(item.bidAt).format('MMM DD, YYYY')}
          </TextItem>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginVertical: AppTheme?.WP(1),
    marginHorizontal: AppTheme?.WP(2),
    paddingVertical: AppTheme?.WP(2),
    paddingHorizontal: AppTheme?.WP(3),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    borderColor: 'transparent',
    borderWidth: 2,
  },
  avatarCol: {
    marginRight: AppTheme?.WP(3),
  },
  infoCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme?.WP(0.5),
    gap: AppTheme?.WP(2),
  },
  nameText: {
    flex: 1,
    marginRight: AppTheme?.WP(1),
  },
  ratingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: AppTheme?.WP(2),
    gap: 2,
  },
  priceText: {
    marginRight: AppTheme?.WP(2),
  },
  daysBadge: {
    backgroundColor: AppTheme?.DefaultPalette()?.info?.light,
    borderRadius: 10,
    paddingHorizontal: AppTheme?.WP(2),
    paddingVertical: AppTheme?.WP(0.5),
    alignSelf: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme?.WP(0.5),
    gap: AppTheme?.WP(2),
  },
  proposalText: {
    flex: 1,
    marginRight: AppTheme?.WP(2),
  },
  selectPill: {
    backgroundColor: AppTheme?.DefaultPalette()?.info?.main,
    borderRadius: 16,
    paddingHorizontal: AppTheme?.WP(4),
    paddingVertical: AppTheme?.WP(1),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: AppTheme?.WP(16),
  },
  selectPillDisabled: {
    backgroundColor: AppTheme?.DefaultPalette()?.grey[400],
  },
  bidDateText: {
    marginTop: AppTheme?.WP(0.5),
    color: AppTheme?.DefaultPalette()?.grey[400],
    textAlign: 'right',
  },
});

export {JobBiddingCard};
