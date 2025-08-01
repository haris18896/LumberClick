import React, {Fragment} from 'react';

// ** Third Party Components
import PropTypes from 'prop-types';

// ** Custom Components
import {
  LinearButtonView,
  LinearButtonTitle,
  LinearButtonWrapper,
  LinearButtonContainer,
  LinearButtonDescription,
} from '../../styles/components';

// ** Store && Actions
import {useSelector} from 'react-redux';

const LinearButton = props => {
  // ** theme
  const {theme} = useSelector(state => state.settings);

  const {title, disabled, description, selected, onPress, size, styles, badge} =
    props;

  // ** Constants
  const linearGRDarkLight = ['#C66213', '#BE2B20'];
  const linearGRDisabledLight = ['#D0D0D0', '#B0B0B0'];

  const linearGR =
    theme === 'Light'
      ? linearGRDarkLight
      : theme === 'Dark'
      ? linearGRDarkLight
      : ['#444292', '#201E61']; // Default or other theme

  const linearGRDisabled =
    theme === 'Light'
      ? linearGRDisabledLight
      : theme === 'Dark'
      ? linearGRDisabledLight
      : ['#6C6AB3', '#484582']; // Default or other theme

  return (
    <Fragment>
      <LinearButtonWrapper
        width={size?.width}
        selected={selected}
        height={size?.height}
        colors={disabled ? linearGRDisabled : linearGR}
        style={styles.mainContainer}>
        <LinearButtonContainer disabled={disabled} onPress={onPress}>
          <LinearButtonView
            pl={styles?.container?.pl}
            pr={styles?.container?.pr}
            pt={styles?.container?.pt}
            pb={styles?.container?.pb}>
            {title && (
              <LinearButtonTitle fontSize={styles?.container?.titleFontSize}>
                {title}
              </LinearButtonTitle>
            )}
            {description && (
              <LinearButtonDescription
                fontSize={styles?.container?.descriptionFontSize}>
                {description}
              </LinearButtonDescription>
            )}
          </LinearButtonView>
        </LinearButtonContainer>
      </LinearButtonWrapper>
    </Fragment>
  );
};

LinearButton.propTypes = {
  size: PropTypes.object,
  styles: PropTypes.object,
  description: PropTypes.string,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
export {LinearButton};
