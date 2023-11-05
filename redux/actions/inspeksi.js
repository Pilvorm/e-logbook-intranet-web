import axios from "axios";
import { API_GLOBAL_INSPECTION } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import { GET_ALL_INSPEKSI, GET_ALL_INSPEKSI_BY_ID } from "redux/types";

export const getAllInspection = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: `${API_GLOBAL_INSPECTION}/api/HsseOnlineInspeksi`,
      method: "GET",
      headers: { ...header, ...param },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getMyTaskInspection = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: `${API_GLOBAL_INSPECTION}/api/HsseOnlineInspeksi/GetMyTask`,
      method: "GET",
      headers: { ...header, ...param },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};



export const getInspeksiId = (id, params) => async (dispatch) => {
  console.log(id, "ID");
  try {
    const header = getHeaders(store.getState().authReducers.token);
    const response = await axios({
      url: `${API_GLOBAL_INSPECTION}/api/HsseOnlineInspeksi/GetInventoryById/${id}`,
      method: "GET",
      headers: { ...header, ...params },
    });

    dispatch({ type: GET_ALL_INSPEKSI_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getDetailInspeksiById = (id, params) => async (dispatch) => {
  try {
    const header = getHeaders(store.getState().authReducers.token);
    const response = await axios({
      url: `${API_GLOBAL_INSPECTION}/api/HsseOnlineInspeksi/${id}`,
      method: "GET",
      headers: { ...header, ...params },
    });

    dispatch({ type: GET_ALL_INSPEKSI_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getInspeksiCapa = (nomorPeralatan, params) => async (dispatch) => {
  try {
    const header = getHeaders(store.getState().authReducers.token);
    const response = await axios({
      url: `${API_GLOBAL_INSPECTION}/api/HsseOnlineInspeksi/GetInputCAPA/${encodeURIComponent(
        nomorPeralatan
      )}`,
      method: "GET",
      headers: { ...header, ...params },
    });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const saveInspeksi = () => async (dispatch) => {
  try {
    const header = getHeaders(store.getState().authReducers.token);
    const response = await axios({
      url: `${API_GLOBAL_INSPECTION}/api/HsseOnlineInspeksi`,
      method: "POST",
      headers: { ...header },
      data,
    });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const submitInpeksi =
  (compId, role, upn, name, email, data) => async (dispatch) => {
    try {
      const header = getHeaders(store.getState().authReducers.token);
      const cstmHeaders = {
        "CSTM-COMPID": compId,
        "CSTM-ROLE": role,
        "CSTM-UPN": upn,
        "CSTM-NAME": name,
        "CSTM-EMAIL": email,
      };
      const response = await axios({
        url: `${API_GLOBAL_INSPECTION}/api/HsseOnlineInspeksi/Submit`,
        method: "POST",
        headers: { ...header, ...cstmHeaders },
        data,
      });

      return response;
    } catch (error) {
      return error.response;
    }
  };

export const submitCAPAInspeksi =
  (compId, role, upn, name, email, data) => async (dispatch) => {
    try {
      const header = getHeaders(store.getState().authReducers.token);
      const cstmHeaders = {
        "CSTM-COMPID": compId,
        "CSTM-ROLE": role,
        "CSTM-UPN": upn,
        "CSTM-NAME": name,
        "CSTM-EMAIL": email,
      };

      const response = await axios({
        url: `${API_GLOBAL_INSPECTION}/api/HsseOnlineInspeksi/SubmitCAPA`,
        method: "PUT",
        headers: { ...cstmHeaders, ...header },
        data,
      });

      return response;
    } catch (error) {
      return error.response;
    }
  };
