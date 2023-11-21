// HTTP CODE
export const HTTP_CODE = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
};

export const SITE_DATA = [
  {
    id: 1,
    value: 'PT ABC',
    name: 'PT ABC',
    label: 'PT ABC'
  },
  {
    id: 2,
    value: 'PT DEF',
    name: 'PT DEF',
    label: 'PT DEF'
  },
  {
    id: 3,
    value: 'PT XYZ',
    name: 'PT XYZ',
    label: 'PT XYZ'
  }
]

export const DEPARTMENT_DATA = [
  {
    id: 1,
    value: 'Corporate IT',
    name: 'Corporate IT',
    label: 'Corporate IT'
  },
  {
    id: 2,
    value: 'Corporate Digital',
    name: 'Corporate Digital',
    label: 'Corporate Digital'
  },
  {
    id: 3,
    value: 'Corporate Analyst',
    name: 'Corporate Analys',
    label: 'Corporate Analys'
  }
]

export const SUPER_USER = "HSSE-SU";
export const SYSTEM_ADMIN = "HSSE-SYSADMIN";

export const AUTH_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_SERVICE_NAME_AUTH_URL
    : process.env.NEXT_PUBLIC_API_AUTH_URL;

export const USER_ROLE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_USER_ROLE
    : process.env.NEXT_PUBLIC_API_USER_ROLE;

export const AUTHORIZATION_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_AUTHORIZATION
    : process.env.NEXT_PUBLIC_API_AUTHORIZATION;

export const MODULE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_MODULE
    : process.env.NEXT_PUBLIC_API_MODULE;

export const API_GLOBAL_SBU_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_CLIENT_API_GLOBAL_SBU
    : process.env.NEXT_PUBLIC_CLIENT_API_GLOBAL_SBU;

export const API_GLOBAL_COMPANY_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_CLIENT_API_GLOBAL_COMPANY
    : process.env.NEXT_PUBLIC_SERVER_API_GLOBAL_COMPANY;

export const API_MASTER =
  "http://hsseonline-master-development-kf-asd-hsseonline-dev.apps.alpha.kalbe.co.id";

export const API_USER_PROFILE =
  "http://kf-asd-userprofile-development-kf-asd-apiglobal-dev.apps.alpha.kalbe.co.id/api/UserProfile";

export const API_MASTER_AREA =
  "http://hsseonline-master-development-kf-asd-hsseonline-dev.apps.alpha.kalbe.co.id";

export const API_MASTER_LOKASI =
  "http://hsseonline-master-development-kf-asd-hsseonline-dev.apps.alpha.kalbe.co.id";

export const API_KECELAKAAN_KERJA =
  "http://hsseonline-kecelakaankerja-development-kf-asd-hsseonline-dev.apps.alpha.kalbe.co.id/api/HsseOnlineKecelakaanKerja";

export const API_INVENTORY =
  "http://hsseonline-inventory-development-kf-asd-hsseonline-dev.apps.alpha.kalbe.co.id/api/Inventory";

export const API_NEARMISS =
  "http://hsseonline-nearmiss-development-kf-asd-hsseonline-dev.apps.alpha.kalbe.co.id/api/HsseOnlineNearmiss";

export const API_ROLES =
  // "http://kf-asd-role-development-kf-asd-apiglobal-dev.apps.alpha.kalbe.co.id/api/Role/GetBySearchKey";
  USER_ROLE_URL + "/api/Role/GetBySearchKey";

export const API_USER_ROLES = USER_ROLE_URL + "/api/UserRoles";
// http://kf-asd-role-development-kf-asd-apiglobal-dev.apps.alpha.kalbe.co.id/api/UserRoles

export const API_FILE =
  "http://file-development-kf-asd-apiglobal-dev.apps.alpha.kalbe.co.id";

export const NEXT_PUBLIC_GLOBAL_LOGGER_API =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_GLOBAL_LOGGER_API
    : process.env.NEXT_PUBLIC_GLOBAL_LOGGER_API;

export const NEXT_PUBLIC_SERVER_API_PENGADUAN =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_SERVER_API_PENGADUAN
    : process.env.NEXT_PUBLIC_SERVER_API_PENGADUAN;
