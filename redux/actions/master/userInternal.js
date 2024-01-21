import axios from "axios";
import { API_MASTER, API_LOGBOOK } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import {
  CREATE_MASTER_USER_INTERNAL,
  DELETE_MASTER_USER_INTERNAL,
  EDIT_MASTER_USER_INTERNAL,
  GET_ALL_MASTER_USER_INTERNAL,
  GET_MASTER_USER_INTERNAL_BY_ID,
} from "redux/types";

export const getAllMasterUserInternal = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + "/UserInternal/GetUserInternal",
      method: "GET",
      headers: { ...header, ...param },
    });

    dispatch({ type: GET_ALL_MASTER_USER_INTERNAL, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getMasterUserInternalById = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserInternal/${id}`,
      method: "GET",
      headers: { ...header },
    });

    dispatch({ type: GET_MASTER_USER_INTERNAL_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const createMasterUserInternal = (data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + "/UserInternal",
      method: "POST",
      headers: header,
      data,
    });

    dispatch({ type: CREATE_MASTER_USER_INTERNAL, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateMasterUserInternal = (id, data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserInternal/${id}`,
      method: "PUT",
      headers: { ...header },
      data,
    });
    dispatch({ type: EDIT_MASTER_USER_INTERNAL, payload: response.data });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const deleteMasterUserInternal = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserInternal/${id}`,
      method: "DELETE",
      headers: header,
    });

    dispatch({ type: DELETE_MASTER_USER_INTERNAL, payload: response.data });
    return response;
  } catch (error) {
    console.error(error);
    return error.response;
  }
};

export const fetchUserRolesFunction = (upn) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: `${API_MASTER}/Role/GetRoleByUpn?Upn=${upn}`,
      headers: header,
      method: "GET",
    });

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getMentorTask = (name) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  const cstmHeaders = {
    "CSTM-NAME": name,
  };
  try {
    const response = await axios({
      url: `${API_LOGBOOK}/GetMentorTask`,
      headers: {
        ...header,
        ...cstmHeaders,
      },
      method: "GET",
    });

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getAutographName = (upn) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  const cstmHeaders = {
    "CSTM-UPN": upn,
  };
  try {
    const response = await axios({
      url: `${API_LOGBOOK}/GetSignFileName`,
      headers: {
        ...header,
        ...cstmHeaders,
      },
      method: "GET",
    });

    return response.data;
  } catch (error) {
    return error.response;
  }
};