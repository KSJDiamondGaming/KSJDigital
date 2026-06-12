import {
  getPortalWebsiteById,
  getPortalWebsites,
  getPortalWebsitesByUser,
} from './portalManager';

export const portalWebsites = getPortalWebsites();

export {
  getPortalWebsiteById,
  getPortalWebsitesByUser,
};
