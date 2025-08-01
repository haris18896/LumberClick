import {CommonActions} from '@react-navigation/native';

// Replace 'YourNavigator' with the actual name of your navigator
// and 'LoginScreen' with the name of your login screen component.
let navigatorRef;

export function setTopLevelNavigator(ref) {
  navigatorRef = ref;
}

export const navigateTo = (page, params) => {
  if (navigatorRef) {
    navigatorRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: page, params}],
      }),
    );
  }
};
