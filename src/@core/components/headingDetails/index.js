import React from 'react';

// ** Third Party Packages
import PropTypes from 'prop-types';

// ** Custom Components
import {TextItem} from '../../../styles/typography';
import {HeadingDetailsWrapper} from '../../../styles/components/heading';

const HeadingDetails = props => {
  const {heading, width, customStyles, description, justifyContent, details} =
    props;
  return (
    <HeadingDetailsWrapper
      width={width}
      style={customStyles}
      justifyContent={justifyContent}>
      <TextItem
        size={details?.heading?.size}
        color={details?.heading?.color}
        weight={details?.heading?.weight}
        family={details?.heading?.family}
        style={details?.customStyles?.heading}>
        {heading}
      </TextItem>
      <TextItem
        size={details?.description?.size}
        color={details?.description?.color}
        weight={details?.description?.weight}
        family={details?.description?.family}
        style={details?.customStyles?.description}>
        {description}
      </TextItem>
    </HeadingDetailsWrapper>
  );
};

HeadingDetails.prototype = {
  heading: PropTypes?.string,
  description: PropTypes?.string,
  justifyContent: PropTypes?.string,
  details: PropTypes?.object,
  customStyles: PropTypes?.object,
};

export {HeadingDetails};
