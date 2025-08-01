import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// ** Utils
import {theme as AppTheme} from '../theme';
import {hasPermission} from '../../auth/acl';
import {LogoComponent} from '../../components/logo';
import {Empty, HeadingDetails} from '../../components';
import {LayoutModel} from '../../layout/LayoutModel';

const withPermission = (WrappedComponent, requiredPermission) => {
  return class extends React.Component {
    render() {
      const {role} = this.props; // Assuming the role is passed as a prop

      if (hasPermission(role, requiredPermission)) {
        return <WrappedComponent {...this.props} />;
      } else {
        return (
          <View style={styles.MainContainer}>
            <LogoComponent
              height={22}
              width={22}
              margin={{top: 2, bottom: 2}}
            />

            <HeadingDetails
              heading={'LUMBER CLICK'}
              description={''}
              details={{
                heading: {
                  size: '6.5',
                  weight: 'bold',
                  family: 'PoppinsBold',
                  color: 'white',
                },
                customStyles: {
                  heading: {
                    marginBottom: AppTheme?.WP(2),
                  },
                },
              }}
            />

            <LayoutModel MT={7}>
              <View style={styles.lottieWrapper}>
                <Empty title={'You are not authorized to view this page'} />
              </View>
            </LayoutModel>
          </View>
        );
      }
    }
  };
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: AppTheme?.WP(14),
    backgroundColor: AppTheme?.DefaultPalette()?.success?.main,
  },
  lottieWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default withPermission;
