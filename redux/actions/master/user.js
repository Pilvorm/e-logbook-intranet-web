import axios from "axios";
import {
  API_MASTER,
  API_MASTER_USER,
  USER_ROLE_URL,
  API_USER_ROLES,
  API_GLOBAL_SBU_URL,
} from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import {
  CREATE_MASTER_USER,
  DELETE_MASTER_USER,
  EDIT_MASTER_USER,
  GET_ALL_MASTER_USER,
  GET_MASTER_USER_BY_ID
} from "redux/types";

export const getAllMasterUserInternal = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + "/UserInternal/GetUserInternal",
      method: "GET",
      headers: { ...header, ...param },
    });

    dispatch({ type: GET_ALL_MASTER_USER, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getMasterUserById = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserInternal/${id}`,
      method: "GET",
      headers: { ...header },
    });

    dispatch({ type: GET_MASTER_USER_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const createMasterUser = (data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + "/UserInternal",
      method: "POST",
      headers: header,
      data,
    });

    dispatch({ type: CREATE_MASTER_USER, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateMasterUser = (id, data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserInternal/${id}`,
      method: "PUT",
      headers: { ...header },
      data,
    });
    dispatch({ type: EDIT_MASTER_USER, payload: response.data });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const deleteMasterUser = (nik, upn) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: `${API_USER_ROLES}/DeleteRoleWithApprovalChanges/${nik}/${upn}/HSSEONLINE`,
      method: "DELETE",
      // params: {
      //   nik: `${nik}`,
      //   upn: `${upn}`,
      // },
      headers: header,
    });

    dispatch({ type: DELETE_MASTER_USER, payload: response.data });
    return response;
  } catch (error) {
    console.error(error);
    return error.response;
  }
};

export const getAllSBU = (name) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios({
      url: `${API_GLOBAL_SBU_URL}/api/BU/BuAndOrgGroupPharma`,
      headers: header,
      method: "GET",
    });

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getSbuAsyncSelect = (name) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: `${API_GLOBAL_SBU_URL}/api/BU/BuAndOrgGroupPharma`,
      headers: header,
      method: "GET",
    });

    // Map the value inside the try block
    const updatedData = response.data.map((item) => ({
      ...item,
      label: item.name,
      value: item.name,
    }));

    return updatedData;

    // return response.data;
  } catch (error) {
    return error.response;
  }
};
