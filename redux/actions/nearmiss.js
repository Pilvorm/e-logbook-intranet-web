import axios from "axios";
import {
  API_NEARMISS,
  INVENTORY_URL,
  NEXT_PUBLIC_GLOBAL_LOGGER_API,
} from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import { CREATE_NEARMISS, GET_ALL_NEARMISS, SAVE_NEARMISS } from "redux/types";
import { GET_ALL_NEARMISS_BY_ID } from "redux/types";

export const getAllNearmiss = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  //console.log(API_MASTER_AREA + "/api/MasterArea");
  console.log(param);
  try {
    const response = await axios.get(API_NEARMISS, {
      headers: {
        ...header,
        ...param,
      },
    });
    console.log(response);

    dispatch({ type: GET_ALL_NEARMISS, payload: response.data });
    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
  }
};

export const getAllNearmissById = (id, param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.get(API_NEARMISS + `/${id}`, {
      headers: {
        ...header,
        ...param,
      },
    });
    dispatch({ type: GET_ALL_NEARMISS_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
  }
};

export const saveNearmiss =
  (compId, role, upn, name, email, data) => async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);
    const cstmHeaders = {
      "CSTM-COMPID": compId,
      "CSTM-ROLE": role,
      "CSTM-UPN": upn,
      "CSTM-NAME": name,
      "CSTM-EMAIL": email,
    };

    console.log("hello");
    const response = await axios({
      url: `${API_NEARMISS}/SaveAsDraft`,
      method: "POST",
      headers: { ...header, ...cstmHeaders },

      data,
    });

    return response;
  };

export const submitNearmiss =
  (compId, role, upn, name, email, newData) => async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);
    const cstmHeaders = {
      "CSTM-COMPID": compId,
      "CSTM-ROLE": role,
      "CSTM-UPN": upn,
      "CSTM-NAME": name,
      "CSTM-EMAIL": email,
    };

    const response = await axios({
      url: `${API_NEARMISS}/submit`,
      method: "POST",
      headers: {
        ...header,
        ...cstmHeaders,
      },
      data: newData,
    });
    return response;
  };

export const updateNearmiss =
  (id, data, compId, role, upn, name, email, newData) => async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);
    const cstmHeaders = {
      "CSTM-COMPID": compId,
      "CSTM-ROLE": role,
      "CSTM-UPN": upn,
      "CSTM-NAME": name,
      "CSTM-EMAIL": email,
    };
    const response = await axios({
      url: `${API_NEARMISS}/${id}`,
      method: "PUT",
      headers: { ...header, ...cstmHeaders },
      data,
    });

    return response;
  };

export const approvalLog = (docNo) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios({
      url: `${NEXT_PUBLIC_GLOBAL_LOGGER_API}/api/log/approval`,
      params: {
        SystemCode: "hsseonline",
        ModuleCode: "inv",
        DocumentNumber: docNo,
      },
      method: "get",
      headers: {
        ...header,
      },
    });

    console.log(response, "RESPONSE APPROVAL LOG");
    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
    return error;
  }
};

export const reviseNearmiss =
  (compId, role, upn, name, email, id, note) => async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);
    const cstmHeaders = {
      "CSTM-COMPID": compId,
      "CSTM-ROLE": role,
      "CSTM-UPN": upn,
      "CSTM-NAME": name,
      "CSTM-EMAIL": email,
    };

    try {
      const response = await axios({
        url: `${API_NEARMISS}/Revise/${id}`,
        method: "PUT",
        headers: {
          ...header,
          ...cstmHeaders,
        },
        data: {
          alasan: note,
        },
      });
      //console.log(response);

      return response;
    } catch (error) {
      console.log(error.response);
      console.error(error.response);
      return error;
    }
  };

export const rejectNearmiss =
  (compId, role, upn, name, email, id, note) => async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);
    const cstmHeaders = {
      "CSTM-COMPID": compId,
      "CSTM-ROLE": role,
      "CSTM-UPN": upn,
      "CSTM-NAME": name,
      "CSTM-EMAIL": email,
    };

    try {
      const response = await axios({
        url: `${API_NEARMISS}/Reject/${id}`,
        method: "PUT",
        headers: {
          ...header,
          ...cstmHeaders,
        },
        data: {
          alasan: note,
        },
      });
      //console.log(response);

      return response;
    } catch (error) {
      console.log(error.response);
      console.error(error.response);
      return error;
    }
  };

export const approveNearmiss =
  (compId, role, upn, name, email, id) => async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);
    const cstmHeaders = {
      "CSTM-COMPID": compId,
      "CSTM-ROLE": role,
      "CSTM-UPN": upn,
      "CSTM-NAME": name,
      "CSTM-EMAIL": email,
    };

    try {
      const response = await axios({
        url: `${API_NEARMISS}/Approve/${id}`,
        method: "PUT",
        headers: {
          ...header,
          ...cstmHeaders,
        },
      });

      return response;
    } catch (error) {
      console.log(error.response);
      console.error(error.response);
      return error;
    }
  };
