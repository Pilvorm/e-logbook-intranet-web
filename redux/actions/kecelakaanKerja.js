import axios from "axios";
import { API_KECELAKAAN_KERJA, NEXT_PUBLIC_GLOBAL_LOGGER_API } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import {
  CREATE_KECELAKAAN_KERJA,
  EDIT_KECELAKAAN_KERJA,
  GET_ALL_KECELAKAAN_KERJA,
  GET_ALL_KECELAKAAN_KERJA_BY_ID,
} from "redux/types";

export const getAllKecelakaanKerja = (param) => async (dispatch) => {
  try {
    const header = getHeaders(store.getState().authReducers.token);

    const response = await axios({
      url: API_KECELAKAAN_KERJA,
      method: "GET",
      headers: { ...header, ...param },
    });

    dispatch({ type: GET_ALL_KECELAKAAN_KERJA, payload: response.data });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllKecelakaanKerjaById = (id, param) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    console.log("dada");

    const response = await axios({
      url: API_KECELAKAAN_KERJA + `/${id}`,
      method: "GET",
      headers: { ...header, ...param },
    });

    dispatch({ type: GET_ALL_KECELAKAAN_KERJA_BY_ID, payload: response.data });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const saveKecelakaanKerja = (data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  const response = await axios({
    url: API_KECELAKAAN_KERJA,
    method: "POST",
    headers: { ...header },
    data,
  });

  return response;
};

export const deleteKecelakaanKerja = (data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  // const cstmHeaders = {
  //   "CSTM-COMPID": compId,
  //   "CSTM-ROLE": role,
  //   "CSTM-UPN": upn,
  //   "CSTM-NAME": name,
  //   "CSTM-EMAIL": email,
  // };

  try {
    const response = await axios({
      url: `${API_KECELAKAAN_KERJA}/${data}`,
      method: "DELETE",
      headers: { ...header },
      data,
    });

    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
    return error;
  }
};

export const submitKecelakaanKerja =
  (compId, role, upn, name, email, newData) => async (dispatch) => {
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
        url: `${API_KECELAKAAN_KERJA}/submit`,
        method: "POST",
        headers: {
          ...header,
          ...cstmHeaders,
        },
        data: newData,
      });
      //console.log(response);

      dispatch({ type: CREATE_KECELAKAAN_KERJA, payload: response.data });
      return response;
    } catch (error) {
      console.log(error.response);
      console.error(error.response);
      return error;
    }
  };
//contoh template approvallog punya ka rey
// export const ApprovalLog = (docNo) => async (dispatch) => {
//   const header = getHeaders(store.getState().authReducers.token);
//   try {
//     const response = await axios({
//       url: `${NEXT_PUBLIC_GLOBAL_LOGGER_API}/api/log/approval`,
//       params: {
//         SystemCode: "hsseonline",
//         ModuleCode: "inv",
//         DocumentNumber: docNo,
//       },
//       method: "get",
//       headers: {
//         ...header,
//       },
//     });

//     console.log(response, "RESPONSE APPROVAL LOG");
//     return response;
//   } catch (error) {
//     console.log(error.response);
//     console.error(error.response);
//     return error;
//   }
// };

export const reviseKecelakaanKerja =
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
        url: `${API_KECELAKAAN_KERJA}/Revise/${id}`,
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

export const rejectKecelakaanKerja =
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
        url: `${API_KECELAKAAN_KERJA}/Reject/${id}`,
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

export const approveKecelakaanKerja =
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
        url: `${API_KECELAKAAN_KERJA}/Approve/${id}`,
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

export const updateKecelakaanKerja = (id, data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  const response = await axios({
    url: `${API_KECELAKAAN_KERJA}/${id}`,
    method: "PUT",
    headers: { ...header },
    data,
  });

  return response;
};
