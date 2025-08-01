/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';

// ** Utils
import {showToast} from '../../../utils/utils';
import {theme as AppTheme} from '../../../@core/infrustructure/theme';

// ** Third Party Packages
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import checkVersion from 'react-native-store-version';

// ** Custom Components
import {ModalView} from '../Models/ModalView';
import {ButtonAction} from '../../../components';
import {ModelText} from '../../../styles/typography';
import {ColumCenter, SpaceBetweenWrapper} from '../../../styles/infrustucture';
import {ModalContainer, UserActivityWrapper} from '../../../styles/screens';

const UpdateButton = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const store = Platform.OS === 'ios' ? 'App' : 'Play';
  const appStoreUrl =
    'https://apps.apple.com/app/salus-health-mobile/id6477792479';
  const playStoreUrl =
    'https://play.google.com/store/apps/details?id=com.salus.health&hl=en';

  const checkForAppUpdates = async () => {
    const currentAppVersion = DeviceInfo.getVersion();

    try {
      const check = await checkVersion({
        version: currentAppVersion,
        iosStoreURL: appStoreUrl,
        androidStoreURL: playStoreUrl,
        country: 'us',
      });

      if (check.result === 'new') {
        setUpdateAvailable(true);
      }
    } catch (e) {
      showToast({
        title: 'Error Version',
        message: `Invalid URL for the ${store} store; unable to verify the app version.`,
        type: 'error',
      });
    }
  };

  useEffect(() => {
    checkForAppUpdates().then(() => {});
  }, []);

  return (
    <ModalView
      title={'App Update'}
      open={updateAvailable}
      toggleModal={() => setUpdateAvailable(false)}>
      <ModalContainer>
        <ColumCenter>
          <ModelText style={{textAlign: 'center'}}>
            A recent app update is now available in the store. Please update
            your app to access the latest features and enhancements.
          </ModelText>
        </ColumCenter>

        <SpaceBetweenWrapper
          style={{width: '100%', marginTop: AppTheme?.WP(4)}}>
          <UserActivityWrapper width={'49%'}>
            <ButtonAction
              left={false}
              title={'Cancel'}
              titleWeight={'bold'}
              labelColor={AppTheme.DefaultPalette()?.grey[700]}
              loadingColor={AppTheme.DefaultPalette().common.white}
              onPress={() => setUpdateAvailable(false)}
            />
          </UserActivityWrapper>
          <UserActivityWrapper width={'49%'}>
            <ButtonAction
              left={false}
              title={'Update'}
              titleWeight={'bold'}
              color={AppTheme.DefaultPalette().success.main}
              labelColor={AppTheme.DefaultPalette().common.white}
              loadingColor={AppTheme.DefaultPalette().common.white}
              onPress={() => {
                const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
                Linking.openURL(url).then(() => {});
              }}
            />
          </UserActivityWrapper>
        </SpaceBetweenWrapper>
      </ModalContainer>
    </ModalView>
  );
};

UpdateButton.propTypes = {
  styles: PropTypes.object,
  height: PropTypes.number,
};

export {UpdateButton};
