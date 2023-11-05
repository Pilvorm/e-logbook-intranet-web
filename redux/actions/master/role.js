import axios from "axios";
import { API_MASTER_USER, API_ROLES } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import { GET_ALL_ROLES, RE_GET_ROLES } from "redux/types";

export const getAllRoles = () => async (dispatch) => {
  try {
    const header = getHeaders(store.getState().authReducers.token);

    const response = await axios({
      url: API_ROLES,
      method: "POST",
      headers: {
        ...header,
      },
      data: {
        searchKey: "HSSE",
      },
    });

    dispatch({ type: GET_ALL_ROLES, payload: response.data });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const reGetRoles = (data) => (dispatch) => {
  dispatch({ type: RE_GET_ROLES, payload: data });
};

export const getRolesByUPN = (upn) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: `${USER_ROLE_URL}/api/UserRoles/GetRolesByUPN?UPN=${upn}`,
      headers: header,
      method: "get",
    });

    return response.data;
  } catch (error) {
    return error.response;
  }
};