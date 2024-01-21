import axios from "axios";
import {
  API_MASTER,
  API_MASTER_USER,
  USER_ROLE_URL,
  API_USER_ROLES,
  API_GLOBAL_SBU_URL,
  API_LOGBOOK,
} from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import {
  CREATE_MASTER_INTERN,
  DELETE_MASTER_INTERN,
  EDIT_MASTER_INTERN,
  GET_ALL_MASTER_INTERN,
  GET_MASTER_INTERN_BY_ID,
  GET_UNCONFIRMED_INTERN,
  GET_MENTOR_TASK,
} from "redux/types";

export const getAllMasterIntern = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + "/UserExternal/GetUserExternal",
      method: "GET",
      headers: { ...header, ...param },
    });

    dispatch({ type: GET_ALL_MASTER_INTERN, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getUnconfirmedIntern = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + "/UserExternal/GetUnconfirmedIntern",
      method: "GET",
      headers: { ...header, ...param },
    });

    dispatch({ type: GET_MASTER_INTERN_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getMasterInternById = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserExternal/${id}`,
      method: "GET",
      headers: { ...header },
    });

    dispatch({ type: GET_MASTER_INTERN_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateMasterIntern = (id, data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserExternal/${id}`,
      method: "PUT",
      headers: { ...header },
      data,
    });
    dispatch({ type: EDIT_MASTER_INTERN, payload: response.data });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const deleteMasterIntern = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserExternal/${id}`,
      method: "DELETE",
      headers: header,
    });

    dispatch({ type: DELETE_MASTER_INTERN, payload: response.data });
    return response;
  } catch (error) {
    console.error(error);
    return error.response;
  }
};

export const confirmMasterIntern = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/UserExternal/ConfirmUser/${id}`,
      method: "PUT",
      headers: {
        ...header,
      },
    });

    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
    return error;
  }
};

export const getMentorTask = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_LOGBOOK + "/GetMentorTask",
      method: "GET",
      headers: { ...header, ...param },
    });

    dispatch({ type: GET_MASTER_INTERN_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};
