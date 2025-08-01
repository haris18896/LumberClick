import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

// ** Third Party Packages
import { BarHeader, JobDetailsCardHeader } from '../../components';

// ** Utils
import { theme as AppTheme } from '../../@core/infrustructure/theme';

function TopBar({ state, navigation, descriptors, title, url_3d, setUrl_3d }) {
  return (
    <SafeAreaView style={styles.safeView}>
      <BarHeader
        close={url_3d}
        title={title}
        onBack={() => {
          if (url_3d) {
            setUrl_3d('');
          } else {
            navigation.goBack();
          }
        }}
        user={{
          bg: AppTheme?.DefaultPalette()?.grey[100],
          marginBottom: 0,
          marginTop: 0,
          width: 11,
          height: 11,
        }}
      />
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View style={styles.buttonLabelView(isFocused)}>
                <Text numberOfLines={1} style={styles.buttonLabel(isFocused)}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    position: 'relative',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
    paddingTop: AppTheme?.WP(2),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  buttonLabelView: isFocused => ({
    paddingVertical: AppTheme?.WP(2),
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: AppTheme?.WP(0.5),
    borderBottomColor: isFocused
      ? AppTheme?.colors?.primary?.main || '#4CAF50'
      : 'transparent',
  }),
  buttonLabel: isFocused => ({
    color: isFocused
      ? AppTheme?.colors?.primary?.main || '#4CAF50'
      : AppTheme?.colors?.text?.primary || '#666',
    fontSize: AppTheme?.WP(2.8),
    fontFamily: AppTheme?.fonts?.PoppinsMedium || 'System',
    fontWeight: isFocused ? '600' : '400',
    textAlign: 'center',
  }),
});

export default TopBar;
