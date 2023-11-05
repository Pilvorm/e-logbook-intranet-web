import axios from "axios";
import { NEXT_PUBLIC_SERVER_API_PENGADUAN } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
export const getListPengaduan = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.get(
      `${NEXT_PUBLIC_SERVER_API_PENGADUAN}/api/HsseOnlinePengaduan/daftarpengaduan`,
      {
        headers: {
          ...header,
          ...param,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
    return error;
  }
};

export const getMyTaskPengaduan = (param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.get(
      `${NEXT_PUBLIC_SERVER_API_PENGADUAN}/api/HsseOnlinePengaduan/GetMyTask`,
      {
        headers: {
          ...header,
          ...param,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
    return error;
  }
};

export const getPengaduanById = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.get(
      `${NEXT_PUBLIC_SERVER_API_PENGADUAN}/api/HsseOnlinePengaduan/${id}`,
      {
        headers: {
          ...header,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
    return error;
  }
};



export const submitPengaduan =
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
        url: `${NEXT_PUBLIC_SERVER_API_PENGADUAN}/api/HsseOnlinePengaduan/submit`,
        method: "POST",
        headers: { ...header, ...cstmHeaders },
        data,
      });

      return response;
    } catch (error) {
      return error.response;
    }
  };

export const submitPengaduanCAPA =
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
        url: `${NEXT_PUBLIC_SERVER_API_PENGADUAN}/api/HsseOnlinePengaduan/submitcapa`,
        method: "POST",
        headers: { ...header, ...cstmHeaders },
        data,
      });

      return response;
    } catch (error) {
      return error.response;
    }
  };