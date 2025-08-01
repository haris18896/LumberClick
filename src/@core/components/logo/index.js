import React from 'react';

// ** Utils
import {theme as AppTheme} from '../../infrustructure/theme';

// ** Custom Components
import {LogoContainer} from '../../../styles/infrustucture/index';

// ** SVGs
import Logo from '../../../assets/svgs/Logo.svg';

const LogoComponent = props => {
  const {
    margin,
    padding,
    alignItems,
    justifyContent,
    height = 10,
    width = 10,
  } = props;

  return (
    <LogoContainer
      alignItems={alignItems}
      padding={padding}
      mt={margin?.top}
      mb={margin?.bottom}
      justifyContent={justifyContent}>
      <Logo height={AppTheme?.WP(height)} width={AppTheme?.WP(width)} />
    </LogoContainer>
  );
};
export {LogoComponent};
