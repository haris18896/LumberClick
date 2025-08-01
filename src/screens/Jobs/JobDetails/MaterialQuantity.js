/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';

// ** Third Party Packages
import RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Utils
import {
  hexToRgba,
  showToast,
  isObjEmpty,
  downloadFile,
  downloadAndDisplay,
} from '../../../utils/utils';
import { MAIN_URL } from '../../../utils/constants';
import { getData } from '../../../utils/constants';
import { theme as AppTheme } from '../../../@core/infrustructure/theme';

// ** Custom Components
import { TextItem } from '../../../styles/typography';
import { DropDown, Empty } from '../../../@core/components';
import Pdf from 'react-native-pdf';

const MaterialQuantity = ({ jobId }) => {
  const { materialCount, _3DModel_and_Revision } = useSelector(
    state => state.jobDetails,
  );

  const Download_All = `${MAIN_URL}/home/downloadAllMaterialList?jobId=${jobId}`;
  const Download_By_Floor = `${MAIN_URL}/home/downloadFloorMaterialList?jobId=${jobId}`;

  // states
  const [pdfError, setPdfError] = useState(false);
  const [isPdfExportLoading, setIsPdfExportLoading] = useState(false);
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [currentPdfPath, setCurrentPdfPath] = useState(null);
  const [currentPdfName, setCurrentPdfName] = useState('');
  const [selectedModel, setSelectedModel] = useState({
    label: 'All Model',
    value: 'All Model',
  });

  // dropdown options
  const modelOptions = useMemo(() => {
    const allModelOption = { label: 'All Model', value: 'All Model' };
    if (!_3DModel_and_Revision || _3DModel_and_Revision.length === 0) {
      return [];
    }

    return [allModelOption, ..._3DModel_and_Revision];
  }, [_3DModel_and_Revision]);

  const maxValue = useMemo(() => {
    if (!materialCount) {
      return 100;
    }
    const values = Object.entries(materialCount)
      .filter(([key]) => key !== 'customData')
      .map(([_, value]) => value);
    return Math.max(...values, 100);
  }, [materialCount]);

  const renderMaterialItem = (key, value) => {
    if (key === 'customData') {
      return null;
    }

    const percentage = (value / maxValue) * 100;
    const iconName = getIconForMaterial(key);
    const { color, backgroundColor } = getColorsForMaterial(key);

    return (
      <View key={key} style={styles.materialCard}>
        <View style={styles.materialHeader}>
          <View style={[styles.materialIconContainer, { backgroundColor }]}>
            <Icon name={iconName} size={24} color={color} />
          </View>
          <View style={styles.materialTitleContainer}>
            <TextItem size={4.5} weight="semiBold" style={styles.materialTitle}>
              {key}
            </TextItem>
            <TextItem
              size={3.5}
              color={AppTheme?.DefaultPalette()?.text?.secondary}
            >
              Total {getMaterialNameTotal(key)}
            </TextItem>
          </View>
          <View style={styles.valueContainer}>
            <TextItem size={2.5} style={styles.percentageValue}>
              {Math.round(percentage)}%
            </TextItem>
            <TextItem size={5} weight="bold" color={color}>
              {value}
            </TextItem>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${percentage}%`, backgroundColor: color },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderExportButtons = () => {
    return (
      <View style={styles.exportButtonsContainer}>
        <TouchableOpacity
          style={[styles.exportButton, styles.viewButton]}
          onPress={handleViewPDF}
          disabled={isPdfExportLoading || isCsvLoading}
        >
          {isPdfLoading ? (
            <ActivityIndicator
              color={AppTheme?.DefaultPalette()?.primary?.main}
            />
          ) : (
            <Icon
              name="eye"
              size={18}
              color={AppTheme?.DefaultPalette()?.primary?.main}
            />
          )}
          <TextItem size={3} weight="medium" style={styles.exportButtonText}>
            View PDF
          </TextItem>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.exportButton, styles.pdfButton]}
          onPress={handleExportPDF}
          disabled={isPdfExportLoading || isCsvLoading}
        >
          {isPdfExportLoading ? (
            <ActivityIndicator
              color={AppTheme?.DefaultPalette()?.error?.main}
            />
          ) : (
            <Icon
              name="file-pdf-box"
              size={18}
              color={AppTheme?.DefaultPalette()?.error?.main}
            />
          )}
          <TextItem size={3} weight="medium" style={styles.exportButtonText}>
            Export PDF
          </TextItem>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, styles.csvButton]}
          onPress={handleExportCSV}
          disabled={isPdfExportLoading || isCsvLoading}
        >
          {isCsvLoading ? (
            <ActivityIndicator
              color={AppTheme?.DefaultPalette()?.success?.main}
            />
          ) : (
            <Icon
              name="file-excel"
              size={18}
              color={AppTheme?.DefaultPalette()?.success?.main}
            />
          )}
          <TextItem size={3} weight="medium" style={styles.exportButtonText}>
            Export CSV
          </TextItem>
        </TouchableOpacity>
      </View>
    );
  };

  const getIconForMaterial = key => {
    const icons = {
      LUMBER: 'tree',
      'LUMBER/ENG': 'ruler',
      Sheathing: 'shield',
      Hardware: 'tools',
    };

    return icons[key] || 'cube';
  };

  const getMaterialNameTotal = key => {
    const materialNameTotal = {
      LUMBER: 'BF',
      'LUMBER/ENG': 'LF',
      Sheathing: 'SF',
      Hardware: 'Pieces',
    };

    return materialNameTotal[key] || key;
  };

  const getColorsForMaterial = key => {
    const colorSchemes = {
      LUMBER: {
        color: AppTheme?.DefaultPalette()?.primary?.main,
        backgroundColor: hexToRgba(
          AppTheme?.DefaultPalette()?.primary?.main,
          0.15,
        ),
      },
      'LUMBER/ENG': {
        color: AppTheme?.DefaultPalette()?.success?.main,
        backgroundColor: hexToRgba(
          AppTheme?.DefaultPalette()?.success?.main,
          0.15,
        ),
      },
      Sheathing: {
        color: AppTheme?.DefaultPalette()?.warning?.main,
        backgroundColor: hexToRgba(
          AppTheme?.DefaultPalette()?.warning?.main,
          0.15,
        ),
      },
      Hardware: {
        color: AppTheme?.DefaultPalette()?.error?.main,
        backgroundColor: hexToRgba(
          AppTheme?.DefaultPalette()?.error?.main,
          0.15,
        ),
      },
    };

    return (
      colorSchemes[key] || {
        color: AppTheme?.DefaultPalette()?.primary?.main,
        backgroundColor: `${AppTheme?.DefaultPalette()?.primary?.main}20`,
      }
    );
  };

  const handleExportPDF = async () => {
    setIsPdfExportLoading(true);

    const downloadUrl =
      selectedModel.label === 'All Model'
        ? `${Download_All}&type=pdf`
        : `${Download_By_Floor}&type=pdf&floor=${selectedModel.label}`;

    const fileName =
      selectedModel.label === 'All Model'
        ? 'materials_all'
        : `materials_${selectedModel.label.toLowerCase().replace(/\s+/g, '_')}`;

    try {
      const result = await downloadFile(downloadUrl, fileName);
      if (result.exists) {
        showToast({
          type: 'info',
          title: `${decodeURIComponent(fileName)}.pdf`,
          message: 'File already exists',
        });
      } else {
        showToast({
          type: 'success',
          title: `${decodeURIComponent(fileName)}.pdf`,
          message: 'PDF file downloaded successfully',
        });
      }
    } catch (e) {
      console.error('Error downloading PDF:', e);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to download PDF file',
      });
    }
    setIsPdfExportLoading(false);
  };

  const handleExportCSV = async () => {
    setIsCsvLoading(true);

    const downloadUrl =
      selectedModel.label === 'All Model'
        ? `${Download_All}&type=csv`
        : `${Download_By_Floor}&type=csv&floor=${selectedModel.label}`;

    const fileName =
      selectedModel.label === 'All Model'
        ? 'materials_all_csv'
        : `materials_csv${selectedModel.label
            .toLowerCase()
            .replace(/\s+/g, '_')}`;

    try {
      const result = await downloadFile(downloadUrl, fileName, 'xlsx');
      if (result.exists) {
        showToast({
          type: 'info',
          title: `${decodeURIComponent(fileName)}.csv`,
          message: 'File already exists',
        });
      } else {
        showToast({
          type: 'success',
          title: `${decodeURIComponent(fileName)}.csv`,
          message: 'CSV file downloaded successfully',
        });
      }
    } catch (e) {
      console.error('Error downloading CSV:', e);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to download CSV file',
      });
    }
    setIsCsvLoading(false);
  };

  const handleViewPDF = async () => {
    setIsPdfLoading(true);

    try {
      const pdfUrl =
        selectedModel.label === 'All Model'
          ? `${Download_All}&type=pdf`
          : `${Download_By_Floor}&type=pdf&floor=${selectedModel.label}`;

      const fileName =
        selectedModel.label === 'All Model'
          ? 'materials_all.pdf'
          : `materials_${selectedModel.label
              .toLowerCase()
              .replace(/\s+/g, '_')}.pdf`;

      console.log('check fileName : ', fileName, 'url : ', pdfUrl);

      // Get authentication token
      const accessToken = await getData('token');

      if (!accessToken) {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Authentication token not found',
        });
        setIsPdfLoading(false);
        return;
      }

      // Check if file already exists
      const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const fileExists = await RNFS.exists(localPath);

      let finalPath = localPath;

      if (!fileExists) {
        // Download the PDF with authentication headers using RNFS
        const downloadResult = await RNFS.downloadFile({
          fromUrl: pdfUrl,
          toFile: localPath,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accessToken: accessToken,
          },
        }).promise;

        if (downloadResult.statusCode !== 200) {
          throw new Error(
            `Failed to download PDF: ${downloadResult.statusCode}`,
          );
        }

        console.log('PDF downloaded successfully to:', localPath);
      } else {
        console.log('PDF already exists locally:', localPath);
      }

      // Set the local file path for the PDF viewer
      const displayPath = await downloadAndDisplay(`file://${finalPath}`);
      setCurrentPdfPath(displayPath);
      setCurrentPdfName(fileName.replace('.pdf', ''));
      setPdfModalVisible(true);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load PDF file',
      });
    } finally {
      setIsPdfLoading(false);
    }
  };

  const PdfViewerModal = () => {
    if (!currentPdfPath) {
      return null;
    }

    const source = {
      uri: currentPdfPath,
      cache: true,
    };

    return (
      <Modal
        visible={pdfModalVisible}
        animationType="slide"
        onRequestClose={() => setPdfModalVisible(false)}
        presentationStyle="fullScreen"
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
              {currentPdfName}
            </TextItem>
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
              <Pdf
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
                  setPdfError(false);
                }}
                onError={error => {
                  console.log('PDF Error:', error);
                  setPdfError(true);
                }}
                onPressLink={uri => {
                  console.log(`Link pressed: ${uri}`);
                }}
                enablePaging={true}
                enableAnnotationRendering={true}
                style={styles.pdfStyle}
                trustAllCerts={false}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: AppTheme?.WP(50) }}
    >
      <View style={styles.container}>
        <TextItem size={4.5} weight="semiBold" style={styles.heading}>
          Material Quantity
        </TextItem>

        <TextItem size={3.5} weight="medium" style={styles.subHeading}>
          Total materials in the model
        </TextItem>

        {isObjEmpty(materialCount) ? (
          <Empty title="No materials found" />
        ) : (
          <View style={styles.materialsContainer}>
            {Object.entries(materialCount)
              .filter(([key]) => key !== 'customData')
              .map(([key, value]) => renderMaterialItem(key, value))}
          </View>
        )}
      </View>

      <View style={styles.container}>
        <TextItem size={4.5} weight="semiBold" style={styles.heading}>
          IFC File Details
        </TextItem>

        {_3DModel_and_Revision?.length > 0 ? (
          <>
            <DropDown
              title="Select Model"
              data={modelOptions}
              value={selectedModel}
              setValue={setSelectedModel}
            />

            {renderExportButtons()}
          </>
        ) : (
          <Empty title="No 3D Model found" />
        )}
      </View>
      <PdfViewerModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: AppTheme?.WP(4),
    padding: AppTheme?.WP(4),
    backgroundColor: '#fff',
    borderRadius: AppTheme?.WP(4),
    marginHorizontal: AppTheme?.WP(2),
    marginBottom: AppTheme?.WP(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heading: {
    color: AppTheme?.DefaultPalette()?.text?.title,
    marginBottom: AppTheme?.WP(1),
  },
  subHeading: {
    color: AppTheme?.DefaultPalette()?.grey[600],
    marginBottom: AppTheme?.WP(3),
  },
  materialsContainer: {
    gap: AppTheme?.WP(3),
  },
  materialCard: {
    backgroundColor: '#fff',
    borderRadius: AppTheme?.WP(3),
    padding: AppTheme?.WP(3),
    marginBottom: AppTheme?.WP(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme?.WP(3),
  },
  materialIconContainer: {
    width: AppTheme?.WP(10),
    height: AppTheme?.WP(10),
    borderRadius: AppTheme?.WP(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme?.WP(3),
  },
  materialTitleContainer: {
    flex: 1,
  },
  materialTitle: {
    color: AppTheme?.DefaultPalette()?.text?.title,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  percentageValue: {
    color: AppTheme?.DefaultPalette()?.text?.secondary,
    marginTop: AppTheme?.WP(0.5),
  },
  progressBarContainer: {
    marginTop: AppTheme?.WP(1),
  },
  progressBarBackground: {
    height: AppTheme?.WP(1.5),
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: AppTheme?.WP(2),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: AppTheme?.WP(2),
  },
  // Dropdown styles
  modelSelectorContainer: {
    marginTop: AppTheme?.WP(2),
    marginBottom: AppTheme?.WP(4),
    zIndex: 100,
  },
  dropdownAndLabelContainer: {
    marginBottom: AppTheme?.WP(3),
    zIndex: 100,
  },
  dropdownLabel: {
    marginBottom: AppTheme?.WP(2),
    color: AppTheme?.DefaultPalette()?.text?.secondary,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 100,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AppTheme?.WP(3),
    paddingVertical: AppTheme?.WP(3),
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.05),
    borderRadius: AppTheme?.WP(2),
    borderWidth: 1,
    borderColor: hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.1),
    zIndex: 101,
  },
  selectedModelText: {
    color: AppTheme?.DefaultPalette()?.text?.primary,
  },
  dropdownOptionsWrapper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: AppTheme?.WP(2),
    marginTop: AppTheme?.WP(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 15,
    zIndex: 999,
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderRadius: AppTheme?.WP(2),
    borderWidth: 1,
    borderColor: hexToRgba(AppTheme?.DefaultPalette()?.grey[400], 0.2),
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: AppTheme?.WP(50),
  },
  dropdownOption: {
    paddingHorizontal: AppTheme?.WP(3),
    paddingVertical: AppTheme?.WP(2.5),
    borderBottomWidth: 1,
    borderBottomColor: hexToRgba(AppTheme?.DefaultPalette()?.grey[400], 0.2),
  },
  selectedOption: {
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.05),
  },
  // Export buttons
  exportButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme?.WP(3),
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme?.WP(2),
    borderRadius: AppTheme?.WP(4),
    borderWidth: 1,
  },
  pdfButton: {
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 0.05),
    borderColor: hexToRgba(AppTheme?.DefaultPalette()?.error?.main, 0.2),
  },
  viewButton: {
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.05),
    borderColor: hexToRgba(AppTheme?.DefaultPalette()?.primary?.main, 0.2),
  },
  csvButton: {
    backgroundColor: hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.05),
    borderColor: hexToRgba(AppTheme?.DefaultPalette()?.success?.main, 0.2),
  },
  exportButtonText: {
    marginLeft: AppTheme?.WP(1),
  },
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
    padding: AppTheme?.WP(1),
  },
  pdfHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    color: AppTheme.DefaultPalette()?.text?.title,
  },
  pdfContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export { MaterialQuantity };
