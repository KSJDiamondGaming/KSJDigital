import {
  getPortalUserById,
  getPortalUsers,
  getPortalUsersByWebsite,
} from './portalManager';

export const portalUsers = getPortalUsers();

export {
  getPortalUserById,
  getPortalUsersByWebsite,
};
