/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import {
  View,
  Modal,
  Linking,
  FlatList,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';

// ** Third Party Packages
import moment from 'moment';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { pick, types } from '@react-native-documents/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Utils
import { getStatusColor } from '../../../utils/jobUtils';
import { getData, MAIN_URL } from '../../../utils/constants';
import { theme as AppTheme } from '../../../@core/infrustructure/theme';
import { hexToRgba, downloadFile, showToast } from '../../../utils/utils';

// ** Custom Components
import { TextItem } from '../../../styles/typography';
import {
  DeleteDocumentModel,
  PaymentModel,
  QuotationModel,
} from '../../../components';
import LoadingComponent from '../../../@core/components/loading/LoadingComponent';

// ** Context
import { useAuth } from '../../../@core/infrustructure/context/AuthContext';
import { UserActivityWrapper } from '../../../styles/screens';
import {
  deleteDocumentAPI,
  submitJobForBiddingAPI,
} from '../../../redux/Jobs/JobDetailsSlice';

const Documents = ({ apiCall, jobId, isLoading, setIsLoading }) => {
  // ** Store
  const { jobData } = useSelector(state => state.jobDetails);

  // ** Context
  const dispatch = useDispatch();
  const { role, isCustomer, isSalesman } = useAuth();
  const { userMe } = useSelector(state => state?.auth);

  // ** States
  const [modal, setModal] = useState('');
  const [selectedDoc, setSelectedDoc] = useState({});
  const [is_quotation, set_is_quotation] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [downloadingDocId, setDownloadingDocId] = useState(null);
  const [deleteDocId, setDeleteDocId] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  const DownloadButtonFlex =
    role === jobData.paymentBy || isSalesman ? 0.48 : 1;

  // ** Helper function to decode file names
  const getDecodedFileName = fileName => {
    try {
      return decodeURIComponent(fileName || '');
    } catch (error) {
      console.warn('Error decoding filename:', fileName, error);
      return fileName || '';
    }
  };

  const openExternalDocument = async document => {
    try {
      await Linking.openURL(document.filePath);
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };

  const handleDownloadDocument = async document => {
    try {
      setDownloadingDocId(document._id);
      const result = await downloadFile(document.filePath);

      if (result) {
        // Show appropriate toast
        if (result.exists) {
          showToast({
            title: getDecodedFileName(document.fileName),
            message: 'File already exists',
            type: 'info',
          });
        } else {
          showToast({
            title: getDecodedFileName(document.fileName),
            message: 'Downloaded successfully',
            type: 'success',
          });
        }

        setCurrentDocument(document);
        setPdfModalVisible(true);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      showToast({
        title: 'Download Failed',
        message: error.message || 'Could not download file',
        type: 'error',
      });
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleDeleteDocument = (jobId, fileId) => {
    setDeleteDocId(fileId);
    dispatch(
      deleteDocumentAPI({
        data: { jobId, fileId },
        refreshing: () => {},
        callback: () => {
          apiCall().then(() => setDeleteDocId(''));
        },
        errorCallback: () => {
          setDeleteDocId('');
        },
      }),
    );
  };

  const handleDownloadAll = async () => {
    if (!jobData?.documents?.length) {
      return;
    }

    try {
      setDownloadingAll(true);

      // Show initial toast
      showToast({
        title: 'Download Started',
        message: `Downloading ${jobData.documents.length} files...`,
        type: 'info',
      });

      // Download all documents one by one
      let existingCount = 0;
      let successCount = 0;
      let failedCount = 0;

      // Track file names for reporting
      const succeededFiles = [];
      const existingFiles = [];
      const failedFiles = [];

      // Process each document
      for (const doc of jobData.documents) {
        try {
          // Show progress toast for larger downloads
          if (jobData.documents.length > 3) {
            showToast({
              title: 'Downloading',
              message: `Processing ${getDecodedFileName(doc.fileName)}...`,
              type: 'info',
            });
          }

          const result = await downloadFile(doc.filePath);

          if (result) {
            if (result.exists) {
              existingCount++;
              existingFiles.push(getDecodedFileName(doc.fileName));
            } else {
              successCount++;
              succeededFiles.push(getDecodedFileName(doc.fileName));

              // Show individual success toast if there are few files
              if (jobData.documents.length <= 3) {
                showToast({
                  title: 'File Downloaded',
                  message: getDecodedFileName(doc.fileName),
                  type: 'success',
                });
              }
            }
          }
        } catch (error) {
          console.error(
            `Error downloading ${getDecodedFileName(doc.fileName)}:`,
            error,
          );
          failedCount++;
          failedFiles.push(getDecodedFileName(doc.fileName));

          // Show individual error toast if there are few files
          if (jobData.documents.length <= 3) {
            showToast({
              title: 'Download Failed',
              message: `Could not download ${getDecodedFileName(doc.fileName)}`,
              type: 'error',
            });
          }
        }
      }

      // Create summary toast based on results
      let toastType = 'info';
      let toastTitle = 'Download Summary';
      let toastMessage = '';

      // If we have successful downloads
      if (successCount > 0) {
        toastType = 'success';
        toastTitle = 'Download Complete';

        // For few documents, show detailed file names
        if (jobData.documents.length <= 5) {
          let messageParts = [];

          if (successCount > 0) {
            messageParts.push(`Downloaded: ${succeededFiles.join(', ')}`);
          }

          if (existingCount > 0) {
            messageParts.push(`Already exists: ${existingFiles.join(', ')}`);
          }

          if (failedCount > 0) {
            messageParts.push(`Failed: ${failedFiles.join(', ')}`);
          }

          toastMessage = messageParts.join('\n');
        }
        // For many documents, just show counts
        else {
          toastMessage = `${successCount} files downloaded successfully`;

          if (existingCount > 0) {
            toastMessage += `, ${existingCount} already existed`;
          }

          if (failedCount > 0) {
            toastMessage += `, ${failedCount} failed`;
          }
        }
      }
      // If only existing files were found
      else if (existingCount > 0 && failedCount === 0) {
        toastType = 'info';
        toastTitle = 'Files Already Exist';

        if (jobData.documents.length <= 5) {
          toastMessage = `Already exists: ${existingFiles.join(', ')}`;
        } else {
          toastMessage = `${existingCount} files already exist on device`;
        }
      }
      // If there were failures
      else if (failedCount > 0) {
        toastType = 'error';
        toastTitle = 'Download Issues';

        if (jobData.documents.length <= 5) {
          let messageParts = [];

          messageParts.push(`Failed: ${failedFiles.join(', ')}`);

          if (existingCount > 0) {
            messageParts.push(`Already exists: ${existingFiles.join(', ')}`);
          }

          toastMessage = messageParts.join('\n');
        } else {
          toastMessage = `${failedCount} files failed to download`;

          if (existingCount > 0) {
            toastMessage += `, ${existingCount} already existed`;
          }
        }
      }

      // Show final summary toast
      showToast({
        title: toastTitle,
        message: toastMessage,
        type: toastType,
      });
    } catch (error) {
      console.error('Error downloading all documents:', error);
      showToast({
        title: 'Download Failed',
        message: error.message || 'Failed to download files',
        type: 'error',
      });
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleSubmitForBidding = async () => {
    setIsLoading('submit_for_bidding_pending');
    dispatch(
      submitJobForBiddingAPI({
        data: {
          jobId: jobData?._id,
        },
        refreshing: () => setIsLoading(''),
        errorCallback: () => setIsLoading(''),
        callback: () => {
          apiCall();
          showToast({
            type: 'success',
            title: 'Submit for bidding',
            message: 'Job has been submitted for bidding',
          });
        },
      }),
    );
  };

  const uploadDocumentHandler = async (isQuotation = false) => {
    setModal('');
    try {
      const accessToken = await getData('token');

      if (!accessToken) {
        showToast({
          title: 'Error',
          message: 'Authentication token not found',
          type: 'error',
        });
        return;
      }

      // Filter out undefined types and provide fallback
      const validTypes = [
        types.csv,
        types.pdf,
        types.doc,
        types.docx,
        types.xls,
        types.xlsx,
        types.ppt,
        types.pptx,
        types.txt,
        types.rtf,
        types.zip,
      ].filter(type => type !== undefined && type !== null);

      // Fallback to common MIME types if no valid types found
      const fallbackTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint',
        'text/plain',
        'text/csv',
        'application/zip',
        'application/x-zip-compressed',
      ];

      const pickerOptions = {
        copyTo: 'cachesDirectory',
      };

      // Use validTypes if available, otherwise use fallback
      if (validTypes.length > 0) {
        pickerOptions.type = validTypes;
      } else {
        pickerOptions.type = fallbackTypes;
      }

      const result = await pick(pickerOptions);

      if (result && result[0]) {
        setIsLoading('upload_document_pending');

        try {
          const originalUri = result[0].fileUri || result[0].uri;

          let fileUri = originalUri;
          let fileName = result[0].name;

          if (
            Platform.OS === 'android' &&
            originalUri.startsWith('content://')
          ) {
            fileUri = originalUri;
            fileName = result[0].name || 'document';
          } else {
            const filePath = originalUri.replace('file://', '');
            const decodedPath = decodeURIComponent(filePath);
            const existsDecoded = await RNFS.exists(decodedPath);
            if (!existsDecoded) {
              throw new Error('File does not exist at path: ' + filePath);
            }
            fileUri = existsDecoded ? decodedPath : filePath;
            fileName = result[0].name || fileName || 'document';
          }

          const file = {
            uri: fileUri,
            type: result[0].type,
            name: decodeURIComponent(fileName || 'document'),
          };

          const formData = new FormData();
          formData.append('file', file);
          formData.append('isQuotation', isQuotation);

          const response = await fetch(`${MAIN_URL}/job/upload/${jobId}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
              accesstoken: accessToken,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
          }

          const responseData = await response.json();

          if (responseData.success) {
            apiCall();
            showToast({
              title: 'Success',
              message: `${
                isQuotation ? 'Quotation' : 'Document'
              } uploaded successfully`,
              type: 'success',
            });
          } else {
            showToast({
              title: 'Error',
              message:
                responseData.message || 'Only PDF and IFC files are allowed',
              type: 'error',
            });
          }
        } catch (error) {
          console.error('Upload error:', error);
          showToast({
            title: 'Error',
            message: 'Failed to upload document',
            type: 'error',
          });
        } finally {
          setIsLoading('');
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);

      // Provide more specific error message
      let errorMessage = 'Failed to pick document';

      if (error.message) {
        if (error.message.includes('trim')) {
          errorMessage =
            'Document picker configuration error. Please try again.';
        } else if (error.message.includes('Permission')) {
          errorMessage = 'Permission denied. Please check storage permissions.';
        } else if (error.message.includes('cancelled')) {
          errorMessage = 'Document selection cancelled';
        } else {
          errorMessage = error.message;
        }
      }

      showToast({
        title: 'Error',
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const handleViewDocument = document => {
    if (
      document.contentType === 'application/pdf' ||
      document.fileName.toLowerCase().endsWith('.pdf')
    ) {
      if (!document.filePath || document.filePath.trim() === '') {
        showToast({
          title: 'Error',
          message: 'Invalid PDF file path',
          type: 'error',
        });
        return;
      }

      setCurrentDocument(document);
      setPdfModalVisible(true);
    } else {
      openExternalDocument(document);
    }
  };

  const PdfViewerModal = () => {
    if (!currentDocument) {
      return null;
    }

    const url = currentDocument.filePath;

    return (
      <Modal
        visible={pdfModalVisible}
        animationType="slide"
        onRequestClose={() => setPdfModalVisible(false)}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <SafeAreaView style={styles.pdfModalContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPdfModalVisible(false)}
            >
              <Icon
                name="close"
                size={24}
                color={AppTheme?.DefaultPalette()?.text?.primary}
              />
            </TouchableOpacity>
            <TextItem size={4} weight="semiBold" style={styles.pdfHeaderTitle}>
              {getDecodedFileName(currentDocument.fileName)}
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
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => {
                    setPdfModalVisible(false);
                    handleDownloadDocument(currentDocument);
                  }}
                >
                  <Icon name="download" size={20} color="#fff" />
                  <TextItem size={3} color="#fff" style={{ marginLeft: 8 }}>
                    Download PDF
                  </TextItem>
                </TouchableOpacity>
              </View>
            ) : (
              <WebView
                source={{ uri: url }}
                style={{ flex: 1 }}
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

  const renderDocumentItem = ({ item }) => {
    // Determine icon and color based on file type
    let iconName = 'file-outline';
    let iconColor = '#2196F3';
    let iconBgColor = hexToRgba('#2196F3', 0.1);

    if (
      item.contentType === 'application/pdf' ||
      item.fileName.toLowerCase().endsWith('.pdf')
    ) {
      iconName = 'file-pdf-box';
      iconColor = '#F44336';
      iconBgColor = hexToRgba('#F44336', 0.1);
    } else if (item.contentType.includes('image')) {
      iconName = 'file-image';
      iconColor = '#4CAF50';
      iconBgColor = hexToRgba('#4CAF50', 0.1);
    } else if (item.contentType.includes('word')) {
      iconName = 'file-word';
      iconColor = '#2196F3';
      iconBgColor = hexToRgba('#2196F3', 0.1);
    } else if (
      item.contentType.includes('excel') ||
      item.contentType.includes('spreadsheet')
    ) {
      iconName = 'file-excel';
      iconColor = '#4CAF50';
      iconBgColor = hexToRgba('#4CAF50', 0.1);
    }

    const statusColor = getStatusColor(
      item?.isQuotation ? 'quotation' : 'no-quotation',
    );

    return (
      <View style={[styles.card, { borderLeftColor: statusColor }]}>
        <View style={styles.leftBorder} />

        <View style={styles.cardMain}>
          <View style={styles.docHeader}>
            <View style={styles.fileInfoSection}>
              <View style={styles.iconAndName}>
                <View
                  style={[
                    styles.pdfIconContainer,
                    { backgroundColor: iconBgColor },
                  ]}
                >
                  <Icon name={iconName} size={24} color={iconColor} />
                </View>

                <View style={styles.fileNameContainer}>
                  <TextItem
                    size={3.8}
                    weight="medium"
                    numberOfLines={1}
                    style={styles.fileName}
                  >
                    {getDecodedFileName(item.fileName)}
                  </TextItem>
                  <View style={styles.fileMetaRow}>
                    <Icon name="file-outline" size={12} color="#888" />
                    <TextItem size={2.6} color="#888" style={styles.metaText}>
                      {item.contentType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </TextItem>

                    <View style={styles.metaSeparator} />

                    <Icon name="harddisk" size={12} color="#888" />
                    <TextItem size={2.6} color="#888" style={styles.metaText}>
                      {item.size}
                    </TextItem>
                  </View>
                </View>
              </View>

              {item.isQuotation && (
                <View style={styles.quotationBadge}>
                  <TextItem size={2.4} color="#fff">
                    Quotation
                  </TextItem>
                </View>
              )}
            </View>

            <View style={styles.dateContainer}>
              <Icon name="calendar" size={12} color="#888" />
              <TextItem size={2.6} color="#888" style={styles.dateText}>
                {moment(item.createdAt).format('MMM DD, YYYY')}
              </TextItem>
            </View>
          </View>

          <View style={styles.cardActions}>
            {item.fileName.toLowerCase().endsWith('.pdf') && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleViewDocument(item)}
              >
                <Icon
                  name="eye"
                  size={18}
                  color={AppTheme?.DefaultPalette()?.grey[700]}
                />
                <TextItem
                  size={2.4}
                  color={AppTheme?.DefaultPalette()?.grey[700]}
                  style={styles.actionText}
                >
                  View
                </TextItem>
              </TouchableOpacity>
            )}

            <View style={styles.actionDivider} />

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDownloadDocument(item)}
              disabled={downloadingDocId === item._id}
            >
              {downloadingDocId === item._id ? (
                <ActivityIndicator size="small" color="#32CD32" />
              ) : (
                <Icon name="download" size={18} color="#32CD32" />
              )}
              <TextItem size={2.4} color="#32CD32" style={styles.actionText}>
                Download
              </TextItem>
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setModal('delete');
                setSelectedDoc(item);
              }}
            >
              {deleteDocId === item._id ? (
                <ActivityIndicator
                  size="small"
                  color={AppTheme?.DefaultPalette()?.error?.main}
                />
              ) : (
                <Icon
                  name="delete"
                  size={18}
                  color={AppTheme?.DefaultPalette()?.error?.main}
                />
              )}
              <TextItem
                size={2.4}
                color={AppTheme?.DefaultPalette()?.error?.main}
                style={styles.actionText}
              >
                Delete
              </TextItem>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const EmptyDocuments = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="file-document-outline" size={60} color="#666" />
      </View>
      <TextItem size={4} color="#666" style={styles.emptyText}>
        No documents available
      </TextItem>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading === 'jobs_pending' && (
        <LoadingComponent top={AppTheme?.WP(-6)} />
      )}

      <View style={styles.buttonContainer}>
        {(role === jobData.paymentBy || isSalesman) && (
          <TouchableOpacity
            style={styles.uploadButton({
              flex: 0.48,
              color: AppTheme?.DefaultPalette()?.success?.main,
            })}
            onPress={() => {
              if (role === jobData.paymentBy && isCustomer) {
                uploadDocumentHandler(false);
              } else if (role === jobData.paymentBy && isSalesman) {
                setModal('upload_quotation');
              } else if (role !== jobData.paymentBy && isSalesman) {
                uploadDocumentHandler(false);
              }
            }}
          >
            {isLoading === 'upload_document_pending' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="upload" size={16} color="#fff" />
            )}
            <TextItem style={styles.buttonText} size={3.2} color="#fff">
              Upload
            </TextItem>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.downloadAllButton({ DownloadButtonFlex }),
            !jobData?.documents?.length && styles.disabledButton,
          ]}
          disabled={!jobData?.documents?.length || downloadingAll}
          onPress={handleDownloadAll}
        >
          {downloadingAll ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="download" size={16} color="#fff" />
          )}
          <TextItem style={styles.buttonText} size={3.2} color="#fff">
            Download All
          </TextItem>
        </TouchableOpacity>
      </View>

      {jobData?.documents?.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={jobData.documents}
          renderItem={renderDocumentItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isLoading === 'refreshing'}
              onRefresh={() => {
                setIsLoading('refreshing');
                apiCall();
              }}
            />
          }
        />
      ) : (
        <EmptyDocuments />
      )}

      {jobData?.paymentBy === role && jobData?.status === 'Pending Info' && (
        <UserActivityWrapper style={{ marginVertical: AppTheme?.WP(4) }}>
          <TouchableOpacity
            style={styles.uploadButton({
              flex: 1,
              color:
                !!isLoading || jobData.documents.length === 0
                  ? AppTheme?.DefaultPalette()?.grey[500]
                  : AppTheme?.DefaultPalette()?.success?.main,
            })}
            disabled={!!isLoading || jobData.documents.length === 0}
            onPress={() => {
              if (
                userMe?.stripeBilling?.payment_methods?.length === 0 &&
                isCustomer
              ) {
                setModal('add_payment_method');
              } else {
                handleSubmitForBidding();
              }
            }}
          >
            {isLoading === 'submit_for_bidding_pending' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="check-circle" size={AppTheme?.WP(4.5)} color="#fff" />
            )}
            <TextItem style={styles.buttonText} size={3.2} color="#fff">
              Submit for bidding
            </TextItem>
          </TouchableOpacity>
        </UserActivityWrapper>
      )}

      <PdfViewerModal />

      <DeleteDocumentModel
        title={'Delete Document'}
        visible={modal === 'delete'}
        description={`Are you sure you want to delete ${getDecodedFileName(
          selectedDoc?.fileName,
        )}?`}
        onCancel={() => setModal('')}
        onConfirm={() => {
          handleDeleteDocument(jobId, selectedDoc?._id);
          setModal('');
        }}
        isLoading={deleteDocId === selectedDoc?._id}
      />

      <QuotationModel
        title={'Upload Quotation'}
        visible={modal === 'upload_quotation'}
        onCancel={() => setModal('')}
        onConfirm={() => {
          uploadDocumentHandler(is_quotation === 'checked');
        }}
        isQuotation={is_quotation}
        setIsQuotation={() =>
          set_is_quotation(prev =>
            prev === 'checked' ? 'unchecked' : 'checked',
          )
        }
      />

      <PaymentModel
        title={'Add Payment Method'}
        onCancel={() => setModal('')}
        visible={modal === 'add_payment_method'}
        isLoading={isLoading === 'add_payment_method'}
        onConfirm={() => handleSubmitForBidding()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: AppTheme.WP(4),
    paddingTop: AppTheme.WP(4),
    paddingBottom: AppTheme.WP(6),
    marginTop: AppTheme?.WP(2),
  },
  title: {
    marginBottom: AppTheme.WP(4),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AppTheme.WP(6),
  },
  uploadButton: ({ flex, color }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: AppTheme.WP(3),
    paddingHorizontal: AppTheme.WP(4),
    borderRadius: AppTheme.WP(3),
    flex: flex,
    backgroundColor: color,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  }),
  downloadAllButton: ({ DownloadButtonFlex }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.WP(3),
    paddingHorizontal: AppTheme.WP(4),
    borderRadius: AppTheme.WP(3),
    flex: DownloadButtonFlex,
    backgroundColor: AppTheme?.DefaultPalette()?.warning?.main,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  }),
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    marginLeft: AppTheme.WP(2),
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: AppTheme.WP(10),
  },
  emptyIconContainer: {
    width: AppTheme.WP(25),
    height: AppTheme.WP(25),
    borderRadius: AppTheme.WP(12.5),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.WP(3),
  },
  emptyText: {
    marginTop: AppTheme.WP(2),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: AppTheme.WP(2.5),
    marginBottom: AppTheme?.WP(2),
    marginHorizontal: AppTheme?.WP(2),
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },

  leftBorder: {
    width: AppTheme.WP(1.5),
    backgroundColor: AppTheme?.DefaultPalette()?.success?.main,
  },
  cardMain: {
    flex: 1,
  },
  docHeader: {
    padding: AppTheme.WP(3),
    paddingBottom: AppTheme.WP(2),
  },
  fileInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconAndName: {
    flexDirection: 'row',
    flex: 1,
  },
  pdfIconContainer: {
    width: AppTheme.WP(9),
    height: AppTheme.WP(9),
    borderRadius: AppTheme.WP(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AppTheme.WP(2.5),
  },
  fileNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    marginBottom: AppTheme.WP(1),
  },
  fileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: AppTheme.WP(1),
  },
  metaSeparator: {
    width: AppTheme.WP(1),
    height: AppTheme.WP(1),
    borderRadius: AppTheme.WP(0.5),
    backgroundColor: '#CCCCCC',
    marginHorizontal: AppTheme.WP(2),
  },
  quotationBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: AppTheme.WP(2),
    paddingVertical: AppTheme.WP(0.5),
    borderRadius: AppTheme.WP(1),
    marginLeft: AppTheme.WP(2),
    alignSelf: 'flex-start',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: AppTheme.WP(1),
  },
  dateText: {
    marginLeft: AppTheme.WP(1),
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    justifyContent: 'space-between',
    height: AppTheme.WP(10),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: AppTheme.WP(1),
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    height: '100%',
  },
  listContainer: {
    paddingBottom: AppTheme.WP(10),
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
    padding: AppTheme.WP(4),
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.DefaultPalette()?.grey[200],
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: AppTheme.WP(1),
  },
  pdfHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    color: AppTheme.DefaultPalette()?.text?.title,
  },
  downloadIconButton: {
    padding: AppTheme.WP(1),
    width: AppTheme.WP(10),
    height: AppTheme.WP(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfContainer: {
    flex: 1,
    position: 'relative',
  },
  pdfStyle: {
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
    marginTop: AppTheme.WP(3),
  },
  pdfErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: AppTheme.WP(4),
  },
  errorTitle: {
    marginTop: AppTheme.WP(2),
    marginBottom: AppTheme.WP(1),
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: AppTheme.WP(4),
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: AppTheme.WP(4),
    paddingVertical: AppTheme.WP(2.5),
    borderRadius: AppTheme.WP(2),
  },
  debugOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 3,
    zIndex: 1000,
  },
});

export { Documents };
