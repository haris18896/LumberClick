import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, RefreshControl, StyleSheet} from 'react-native';

// ** Custom Components
import {Empty} from '../empty';
import {EmptyCenter} from '../../../styles/components';
import {theme as AppTheme} from '../../infrustructure/theme';
import Loader from '../loading';

const Scroller = props => {
  const {
    style,
    length,
    onScroll,
    skeleton,
    children,
    isLoading,
    tintcolor,
    onRefresh,
    emptyTitle,
    emptyHeight,
    horizontal,
    refreshing,
    customStyles,
  } = props;

  return (
    <>
      {isLoading ? (
        skeleton
      ) : (
        <ScrollView
          style={{...style}}
          onScroll={onScroll}
          horizontal={horizontal}
          vertical={!horizontal}
          scrollEventThrottle={1000}
          showVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer(length),
            customStyles,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              tintColor={'transparent'}
              colors={['transparent']}
              refreshing={isLoading === 'refreshing'}
              progressViewOffset={AppTheme?.WP(-30)}
              progressBackgroundColor={
                AppTheme?.DefaultPalette()?.background?.paper
              }
            />
          }>
          {refreshing && <Loader />}
          {length === 0 ? (
            <EmptyCenter>
              <Empty height={emptyHeight} title={emptyTitle} />
            </EmptyCenter>
          ) : (
            children
          )}
        </ScrollView>
      )}
    </>
  );
};

Scroller.propTypes = {
  onScroll: PropTypes?.func,
  isLoading: PropTypes.bool,
  onRefresh: PropTypes.func,
  horizontal: PropTypes.bool,
  refreshing: PropTypes.bool,
  tintcolor: PropTypes.string,
  emptyHeight: PropTypes?.number,
  customStyles: PropTypes.object,
  length: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  skeleton: PropTypes.element.isRequired,
  emptyTitle: PropTypes?.string?.isRequired,
};

const styles = StyleSheet.create({
  contentContainer: length => ({
    flex: length === 0 ? 1 : 0,
    alignItems: length === 0 ? 'center' : 'flex-start',
    justifyContent: length === 0 ? 'center' : 'flex-start',
  }),
});

export {Scroller};
