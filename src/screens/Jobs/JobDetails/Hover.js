/* eslint-disable react/no-unstable-nested-components */
import React, { Fragment, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

// ** Third Party Packages
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';
import WebView from 'react-native-webview';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Utils
import { theme as AppTheme } from '../../../@core/infrustructure/theme';
import { hexToRgba, showToast } from '../../../utils/utils';

// ** Custom Components
import { ButtonAction } from '../../../components';
import { TextItem } from '../../../styles/typography';
import { UserActivityWrapper } from '../../../styles/screens';
import { MAIN_URL_3D } from '../../../utils/constants';

const Hover = ({ url_3d, setUrl_3d }) => {
  const { jobData } = useSelector(state => state.jobDetails);
  const [pdfError, setPdfError] = useState(false);

  const handleCopyLink = () => {
    if (jobData?.hover?.skp?.urn) {
      Clipboard.setString(
        `${MAIN_URL_3D}/view-model-external/${jobData?._id}/${jobData?.hover?.skp?.urn}`,
      );
      showToast({
        title: 'Copied!',
        message: 'Link copied to clipboard',
        type: 'success',
      });
    } else {
      showToast({
        title: 'Error',
        message: 'No link available to copy',
        type: 'error',
      });
    }
  };

  const PdfViewerModal = () => {
    if (!url_3d) {
      return null;
    }

    return (
      <Modal
        visible={!!url_3d}
        animationType="slide"
        onRequestClose={() => setUrl_3d(null)}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <SafeAreaView style={styles.pdfModalContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setUrl_3d(null)}
            >
              <Icon
                name="close"
                size={24}
                color={AppTheme?.DefaultPalette()?.text?.primary}
              />
            </TouchableOpacity>
            <TextItem size={4} weight="semiBold" style={styles.pdfHeaderTitle}>
              Exterior 3D Image
            </TextItem>
            <View style={styles.downloadIconButton} />
          </View>
          <View style={styles.pdfContainer}>
            {pdfError ? (
              <View style={styles.pdfErrorContainer}>
                <Icon name="alert-circle" size={60} color="#FF5722" />
                <TextItem size={4} weight="medium" style={styles.errorTitle}>
                  Unable to load PDF
                </TextItem>
                <TextItem size={3} color="#666" style={styles.errorMessage}>
                  The PDF file could not be displayed. You can still download
                  it.
                </TextItem>
              </View>
            ) : (
              <WebView
                source={{ uri: url_3d }}
                style={styles.webview}
                onLoadEnd={() => {
                  console.log('PDF loaded');
                }}
                onError={error => {
                  console.log('PDF Error:', error);
                  setPdfError(true);
                }}
                onPageChanged={(page, pageCount) => {
                  console.log(`Current page: ${page}/${pageCount}`);
                }}
                onPressLink={uri => {
                  console.log(`Link pressed: ${uri}`);
                }}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <Fragment>
      <View style={styles.mainContainer}>
        <View style={styles.cardWrapper}>
          <Card
            style={[
              styles.card3D(
                jobData?.hover?.skp?.urn
                  ? AppTheme?.DefaultPalette()?.card?.primary
                  : hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 0.2),
              ),
              styles.cardBorders,
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer(7)}>
                <Icon
                  name="information-outline"
                  size={24}
                  color={AppTheme?.DefaultPalette()?.warning?.main}
                />
              </View>
              <View style={styles.headerTextContainer}>
                <TextItem
                  size={4.5}
                  weight="semiBold"
                  style={styles.headerTitle}
                >
                  {jobData?.hover?.skp?.urn
                    ? 'View Exterior 3D Image'
                    : 'Exterior Files'}
                </TextItem>
                <TextItem
                  size={3.5}
                  color={AppTheme?.DefaultPalette()?.text?.secondary}
                  style={styles.headerSubtitle}
                >
                  {jobData?.hover?.skp?.urn
                    ? 'You can View Exterior 3D Image to view the SKP model'
                    : 'Processing exterior takeoff...'}
                  .
                </TextItem>
              </View>
            </View>

            {jobData?.hover?.skp?.urn && (
              <UserActivityWrapper
                style={styles.buttonsWrapper}
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <ButtonAction
                  left={false}
                  width={'66%'}
                  titleWeight={'bold'}
                  title={'View Exterior 3D Image'}
                  color={AppTheme.DefaultPalette().success.main}
                  labelColor={AppTheme.DefaultPalette().common.white}
                  loadingColor={AppTheme.DefaultPalette().common.white}
                  onPress={() =>
                    setUrl_3d(
                      `${MAIN_URL_3D}/view-model-external/${jobData?._id}/${jobData?.hover?.skp?.urn}`,
                    )
                  }
                />

                <ButtonAction
                  left={false}
                  width={'32%'}
                  titleWeight={'bold'}
                  title={'Copy Link'}
                  color={AppTheme.DefaultPalette().success.main}
                  labelColor={AppTheme.DefaultPalette().common.white}
                  loadingColor={AppTheme.DefaultPalette().common.white}
                  onPress={handleCopyLink}
                />
              </UserActivityWrapper>
            )}
          </Card>
        </View>
        <PdfViewerModal />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: AppTheme?.WP(4),
  },
  webview: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  mainHeading: {
    marginBottom: AppTheme?.WP(4),
    color: AppTheme?.DefaultPalette()?.text?.title,
  },
  container: {
    marginBottom: AppTheme?.WP(4),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: AppTheme?.WP(3),
    padding: AppTheme?.WP(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.2),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: size => ({
    width: AppTheme?.WP(size),
    height: AppTheme?.WP(size),
    borderRadius: AppTheme?.WP(5),
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme?.WP(3),
  }),
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    marginBottom: AppTheme?.WP(1),
    color: AppTheme?.DefaultPalette()?.text?.title,
  },
  headerSubtitle: {
    marginBottom: AppTheme?.WP(1),
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme?.WP(3),
    marginTop: AppTheme?.WP(4),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme?.WP(2),
    borderRadius: AppTheme?.WP(2),
    borderWidth: 1,
    borderColor: hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.3),
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.05),
  },
  downloadButton: {
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.1),
    borderColor: hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.5),
  },
  buttonText: {
    marginLeft: AppTheme?.WP(2),
  },
  buttonIcon: {
    marginRight: AppTheme?.WP(2),
  },
  processingContainer: {
    marginTop: AppTheme?.WP(6),
  },
  progressBar: {
    height: AppTheme?.WP(2),
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.warning?.main, 0.1),
    borderRadius: AppTheme?.WP(1),
    overflow: 'hidden',
    marginBottom: AppTheme?.WP(2),
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: AppTheme?.DefaultPalette()?.warning?.main,
    borderRadius: AppTheme?.WP(1),
  },
  processingText: {
    textAlign: 'center',
  },
  // PDF Modal Styles
  pdfModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AppTheme?.WP(4),
    borderBottomWidth: 1,
    borderBottomColor: AppTheme?.DefaultPalette()?.grey[200],
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: AppTheme?.WP(1),
  },
  pdfHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    color: AppTheme?.DefaultPalette()?.text?.title,
  },
  downloadIconButton: {
    padding: AppTheme?.WP(1),
    width: AppTheme?.WP(10),
    height: AppTheme?.WP(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfContainer: {
    flex: 1,
    position: 'relative',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#f0f0f0',
  },
  pdfLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: AppTheme?.WP(3),
  },
  card3D: backgroundColor => ({
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
    paddingHorizontal: AppTheme?.WP(2),
  },
  buttonsWrapper: {
    paddingHorizontal: AppTheme?.WP(4),
    marginTop: AppTheme?.WP(4),
  },
});

export { Hover };
