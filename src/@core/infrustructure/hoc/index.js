// ACL Utilities and Hooks

import {useAuth} from '../context/AuthContext';
import {ACL_ACTIONS, ACL_SUBJECTS} from '../../../utils/constants';

// Hook for easier ACL usage in components
export const useACL = () => {
  const {can, cannot, canAll, canAny, acl, role} = useAuth();

  return {
    can,
    cannot,
    canAll,
    canAny,
    acl,
    role,
    // Convenience methods for common checks
    canViewDashboard: () => can(ACL_ACTIONS.VIEW_DASHBOARD),
    canViewJobs: () => can(ACL_ACTIONS.VIEW_JOBS),
    canCreateJob: () => can(ACL_ACTIONS.CREATE_JOB),
    canEditJob: () => can(ACL_ACTIONS.EDIT_JOB),
    canDeleteJob: () => can(ACL_ACTIONS.DELETE_JOB),
    canBidOnJob: () => can(ACL_ACTIONS.BID_ON_JOB),
    canViewProfile: () => can(ACL_ACTIONS.VIEW_PROFILE),
    canViewNotifications: () => can(ACL_ACTIONS.VIEW_NOTIFICATIONS),
    canViewChatHub: () => can(ACL_ACTIONS.VIEW_CHAT_HUB),
    canViewChat: () => can(ACL_ACTIONS.VIEW_CHAT),
  };
};

// Component wrapper for conditional rendering based on permissions
export const Can = ({action, subject = null, children, fallback = null}) => {
  const {can} = useAuth();

  if (can(action, subject)) {
    return children;
  }

  return fallback;
};

// Component wrapper for conditional rendering when user cannot perform action
export const Cannot = ({action, subject = null, children, fallback = null}) => {
  const {cannot} = useAuth();

  if (cannot(action, subject)) {
    return children;
  }

  return fallback;
};

export {default as withPermission} from './acl';
