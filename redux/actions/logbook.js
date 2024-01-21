import axios from "axios";
import { API_MASTER, API_LOGBOOK } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import {
  GET_LOGBOOK_DATA,
  CREATE_LOGBOOK_DATA,
  EDIT_LOGBOOK_DATA,
} from "redux/types";

import FileSaver from "file-saver";

export const getLogbookData = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_LOGBOOK + "/GetLogbookData",
      method: "GET",
      headers: { ...header, ...param },
    });

    dispatch({ type: GET_LOGBOOK_DATA, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const reviseLogbook =
  (role, upn, name, email, id, note) => async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);
    const cstmHeaders = {
      "CSTM-ROLE": role,
      "CSTM-UPN": upn,
      "CSTM-NAME": name,
      "CSTM-EMAIL": email,
    };

    try {
      const response = await axios({
        url: `${API_LOGBOOK}/Revise/${id}`,
        method: "PUT",
        headers: {
          ...header,
          ...cstmHeaders,
        },
        data: {
          alasan: note,
        },
      });

      return response;
    } catch (error) {
      console.log(error.response);
      console.error(error.response);
      return error;
    }
  };

export const approveLogbook =
  (role, upn, name, email, id) => async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);
    const cstmHeaders = {
      "CSTM-ROLE": role,
      "CSTM-UPN": upn,
      "CSTM-NAME": name,
      "CSTM-EMAIL": email,
    };

    try {
      const response = await axios({
        url: `${API_LOGBOOK}/Approve/${id}`,
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

export const GenerateLogbookPDF = (name, month, data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios({
      url: `${API_LOGBOOK}/GeneratePDF`,
      method: "POST",
      data,
      responseType: "blob",
    });

    if (response) {
      FileSaver.saveAs(response.data, `Logbook ${name} ${month}`);
      return response.data;
    }
  } catch (error) {
    return error.response;
  }
};
