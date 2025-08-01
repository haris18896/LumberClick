import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme as AppTheme} from '../../infrustructure/theme';
import {TextItem} from '../../../styles/typography';
import {hexToRgba} from '../../../utils/utils';

const DropDown = ({title, data, value, setValue, placeholder}) => {
  const [open, setOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const selectorRef = React.useRef();

  // Calculate position for modal dropdown
  const handleLayout = () => {
    if (selectorRef.current) {
      selectorRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownTop(py + height);
        setDropdownLeft(px);
        setDropdownWidth(width);
      });
    }
  };

  React.useEffect(() => {
    if (open) {
      setTimeout(handleLayout, 0);
    }
  }, [open]);

  return (
    <View style={styles.modelSelectorContainer}>
      <View style={styles.dropdownAndLabelContainer}>
        {title && (
          <TextItem size={3.5} weight="medium" style={styles.dropdownLabel}>
            {title}
          </TextItem>
        )}

        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            ref={selectorRef}
            activeOpacity={0.7}
            style={styles.dropdownSelector}
            onPress={() => setOpen(!open)}
            onLayout={handleLayout}>
            <TextItem
              size={3.5}
              weight="medium"
              style={styles.selectedModelText}>
              {value ? value?.label : placeholder}
            </TextItem>
            <Icon
              name={open ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={AppTheme?.DefaultPalette()?.text?.secondary}
            />
          </TouchableOpacity>

          {open && (
            <Modal
              transparent
              animationType="fade"
              visible={open}
              onRequestClose={() => setOpen(false)}>
              <TouchableWithoutFeedback onPress={() => setOpen(false)}>
                <View style={styles.modalOverlay}>
                  <View
                    style={[
                      styles.dropdownOptionsWrapper,
                      {
                        position: 'absolute',
                        top: dropdownTop,
                        left: dropdownLeft,
                        width: dropdownWidth || '90%',
                        maxWidth: Dimensions.get('window').width - 32,
                        zIndex: 99999,
                      },
                    ]}>
                    <View style={styles.dropdownOptions}>
                      <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        style={styles.dropdownScroll}>
                        {data.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.dropdownOption,
                              value?.value === option.value &&
                                styles.selectedOption,
                            ]}
                            onPress={() => {
                              setValue(option);
                              setOpen(false);
                            }}>
                            <TextItem
                              size={3.5}
                              weight={
                                value?.value === option.value
                                  ? 'medium'
                                  : 'regular'
                              }
                              color={
                                value?.value === option.value
                                  ? AppTheme?.DefaultPalette()?.primary?.main
                                  : AppTheme?.DefaultPalette()?.text?.primary
                              }>
                              {option.label}
                            </TextItem>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </View>
      </View>
    </View>
  );
};

DropDown.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.object,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

const styles = StyleSheet.create({
  modelSelectorContainer: {
    marginVertical: AppTheme?.WP(2),
    zIndex: 900000000,
    width: '100%',
  },
  dropdownAndLabelContainer: {
    marginBottom: AppTheme?.WP(3),
    zIndex: 900000000,
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
    shadowOffset: {width: 0, height: 4},
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
});

export {DropDown};
