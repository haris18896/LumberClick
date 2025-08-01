import {useContext} from 'react';
import {AuthContext} from '../infrustructure/context/AuthContext';
import {hasPermission} from '../auth/acl';

const usePermission = requiredPermission => {
  const {role} = useContext(AuthContext);
  return hasPermission(role, requiredPermission);
};

export default usePermission;
