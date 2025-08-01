import React from 'react';
import {StyleSheet} from 'react-native';

// ** Utils
import {theme as AppTheme} from '../../@core/infrustructure/theme';

// ** Third party components
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Custom Components
import {
  JobCountContainer,
  JobCountWrapper,
  JobDetailContainer,
  JobOverviewHeader,
  JobOverViewWrapper,
  JobSpeedometerWrapper,
} from '../../styles/components/JobOverViewCard';
import {Divider} from '../../styles/infrustucture';
import {TextItem} from '../../styles/typography';

const JobOverViewCard = props => {
  // ** Props
  const {jobPercentage, completed, inProgress, title} = props;

  return (
    <JobOverViewWrapper>
      <JobOverviewHeader>
        <TextItem size={5}>{title}</TextItem>
        <Icon
          name={'help-circle-outline'}
          color={AppTheme?.DefaultPalette()?.grey[700]}
          size={AppTheme?.WP(6)}
        />
      </JobOverviewHeader>

      <JobSpeedometerWrapper>
        <AnimatedCircularProgress
          padding={10}
          rotation={-140}
          fill={jobPercentage}
          lineCap={'round'}
          arcSweepAngle={280}
          size={AppTheme?.WP(45)}
          width={AppTheme?.WP(2.5)}
          tintColor={AppTheme?.DefaultPalette()?.primary?.light}
          backgroundColor={AppTheme?.DefaultPalette()?.borders?.inputBorder}
          // onAnimationComplete={() => console.log('onAnimationComplete')}
          children={() => (
            <TextItem size={10}>
              {jobPercentage ? `${jobPercentage}%` : 0}
            </TextItem>
          )}
        />
      </JobSpeedometerWrapper>

      <JobDetailContainer>
        <Divider
          style={{width: '100%'}}
          bg={AppTheme?.DefaultPalette()?.grey[300]}
        />
        <JobCountWrapper>
          <JobCountContainer borderRight={true}>
            <TextItem
              style={{marginTop: AppTheme?.WP(2)}}
              color={AppTheme?.DefaultPalette()?.grey[400]}
              size={4}>
              Completed
            </TextItem>
            <TextItem color={AppTheme?.DefaultPalette()?.text?.title} size={4}>
              {completed}
            </TextItem>
          </JobCountContainer>

          <JobCountContainer>
            <TextItem
              style={{marginTop: AppTheme?.WP(2)}}
              color={AppTheme?.DefaultPalette()?.grey[400]}
              size={4}>
              In Progress
            </TextItem>
            <TextItem color={AppTheme?.DefaultPalette()?.text?.title} size={4}>
              {inProgress}
            </TextItem>
          </JobCountContainer>
        </JobCountWrapper>
      </JobDetailContainer>
    </JobOverViewWrapper>
  );
};

export {JobOverViewCard};
