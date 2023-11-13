import axios from "axios";
import { API_GLOBAL_SBU_URL } from "constant";
import { getHeaders, removeCookie, setCookie } from "helpers/utils";
import { AUTHENTICATE, DEAUTHENTICATE, STORE_USER_ROLES, CURRENT_USER_SITE } from "redux/types";
import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";

export const authenticate = (token) => (dispatch) => {
  setCookie("token", token);
  dispatch({ type: AUTHENTICATE, payload: token });
};

export const reauthenticate = (token) => (dispatch) => {
  dispatch({ type: AUTHENTICATE, payload: token });
};

export const deauthenticate = () => (dispatch) => {
  removeCookie("token");
  dispatch({ type: DEAUTHENTICATE });
};

export const getSBUAll = (name) => async (dispatch) => {
  try {
    const response = await axios({
      url: `${API_GLOBAL_SBU_URL}/api/BU/BuAndOrgGroupPharma`,
      headers: getHeaders(),
      method: "get",
    });
    // console.log(response, "ASLDKASLDK");
    const sanitized = sortBy(
      uniqBy(response.data, (el) => {
        return el.idmCompCode;
      }).filter((el) => el.idmCompCode),
      (el) => {
        return el.idmCompName;
      }
    );
    return sanitized;
  } catch (error) {
    console.log(error, "ERROR");
    return error.response;
  }
};

export const storeUserRoles = (roles) => (dispatch) => {
  console.log(roles, "role <<<");
  if (typeof window !== "undefined") {
    localStorage.setItem("userRoles", JSON.stringify(roles));
  }
  dispatch({ type: STORE_USER_ROLES, payload: roles });
};

export const getCurrentUserSite = (roles) => (dispatch) => {
  let currentUserSite;
  if (typeof window !== "undefined") {
    currentUserSite = localStorage.getItem("currentUserSite");
  }
  dispatch({ type: CURRENT_USER_SITE, payload: currentUserSite });
};