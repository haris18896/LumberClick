const roles = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
  SALESMAN: 'salesman',
};

const permissions = {
  CAN_VIEW_DASHBOARD_PAGE: 'can_view_dashboard_page',
  CAN_VIEW_PROFILE_PAGE: 'can_view_profile_page',
  CAN_VIEW_CHAT_HUB_PAGE: 'can_view_chat_hub_page',
  CAN_VIEW_CHAT_PAGE: 'can_view_chat_page',
  CAN_VIEW_NOTIFICATION_PAGE: 'can_view_notification_page',
  CAN_VIEW_JOBS_PAGE: 'can_view_jobs_page',
  CAN_VIEW_JOB_BIDDING_PAGE: 'can_view_job_bidding_page',

  // ** COMPONENTS
  CAN_EDIT_PROFILE: 'can_edit_profile',
  CAN_ADD_STRIPE_CARD: 'can_add_stripe_card',
  CAN_VIEW_BID_BUTTON: 'can_view_bid_button',
  CAN_CHAT_WITH_JOB: 'can_chat_with_job',
  CAN_BID: 'can_bid',
  CAN_VIEW_MESSAGES: 'can_view_messages',
  CAN_VIEW_NOTIFICATIONS: 'can_view_notifications',
  CAN_ADD_JOB: 'can_add_job',
};

const rolePermissions = {
  [roles.CUSTOMER]: [
    permissions.CAN_VIEW_DASHBOARD_PAGE,
    permissions.CAN_VIEW_PROFILE_PAGE,
    permissions.CAN_VIEW_CHAT_HUB_PAGE,
    permissions.CAN_VIEW_CHAT_PAGE,
    permissions.CAN_VIEW_NOTIFICATION_PAGE,
    permissions.CAN_VIEW_JOBS_PAGE,
    permissions.CAN_VIEW_JOB_BIDDING_PAGE,

    permissions.CAN_BID,
    permissions.CAN_EDIT_PROFILE,
    permissions.CAN_ADD_STRIPE_CARD,
    permissions.CAN_VIEW_BID_BUTTON,
    permissions.CAN_CHAT_WITH_JOB,
    permissions.CAN_VIEW_MESSAGES,
    permissions.CAN_VIEW_NOTIFICATIONS,
  ],
  [roles.SUPPLIER]: [
    permissions.CAN_VIEW_DASHBOARD_PAGE,
    permissions.CAN_VIEW_JOBS_PAGE,
    permissions.CAN_VIEW_PROFILE_PAGE,
    permissions.CAN_VIEW_CHAT_HUB_PAGE,
    permissions.CAN_VIEW_CHAT_PAGE,
    permissions.CAN_VIEW_NOTIFICATION_PAGE,
    permissions.CAN_VIEW_JOB_BIDDING_PAGE,

    permissions.CAN_BID,
    permissions.CAN_EDIT_PROFILE,
    permissions.CAN_ADD_STRIPE_CARD,
    permissions.CAN_VIEW_BID_BUTTON,
    permissions.CAN_CHAT_WITH_JOB,
    permissions.CAN_VIEW_MESSAGES,
    permissions.CAN_VIEW_NOTIFICATIONS,
  ],
  [roles.SALESMAN]: [
    permissions.CAN_VIEW_DASHBOARD_PAGE,
    permissions.CAN_VIEW_JOBS_PAGE,
    permissions.CAN_VIEW_PROFILE_PAGE,
    permissions.CAN_VIEW_CHAT_HUB_PAGE,
    permissions.CAN_VIEW_CHAT_PAGE,
    permissions.CAN_VIEW_NOTIFICATION_PAGE,
    permissions.CAN_VIEW_JOB_BIDDING_PAGE,

    permissions.CAN_BID,
    permissions.CAN_EDIT_PROFILE,
    permissions.CAN_ADD_STRIPE_CARD,
    permissions.CAN_VIEW_BID_BUTTON,
    permissions.CAN_CHAT_WITH_JOB,
    permissions.CAN_VIEW_MESSAGES,
    permissions.CAN_VIEW_NOTIFICATIONS,
    permissions.CAN_ADD_JOB,
  ],
};

const hasPermission = (role, permission) => {
  // eslint-disable-next-line no-shadow
  const permissions = rolePermissions[role];
  return permissions ? permissions.includes(permission) : false;
};

const getAllowedRoutes = (role, routes) => {
  return routes.filter(route => hasPermission(role, route.permission));
};

const ProtectedComponent = ({role, requiredPermission, children}) => {
  if (hasPermission(role, requiredPermission)) {
    return children;
  } else {
    return null;
  }
};

export {
  roles,
  permissions,
  rolePermissions,
  hasPermission,
  getAllowedRoutes,
  ProtectedComponent,
};
