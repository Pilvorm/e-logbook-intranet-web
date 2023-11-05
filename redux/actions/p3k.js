import axios from "axios";
import {
  API_INVENTORY,
  INVENTORY_URL,
  NEXT_PUBLIC_GLOBAL_LOGGER_API,
} from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import { GET_ALL_INVENTORY } from "redux/types";
import { GET_ALL_INVENTORY_BY_ID } from "redux/types";

// export const getAllInventory = (param) => async (dispatch) => {
//   const header = getHeaders(store.getState().authReducers.token);
//   //console.log(API_MASTER_AREA + "/api/MasterArea");

//   try {
// const response = await axios.get(`${API_P3K}/api/P3K`, {
//   headers: {
//     ...header,
//     ...param,
//   },
// });

//     dispatch({ type: GET_ALL_INVENTORY, payload: response.data });
//     return response;
//   } catch (error) {
//     console.log(error.response);
//     console.error(error.response);
//   }
// };

// export const getAllInventoryByID = (id, param) => async (dispatch) => {
//   const header = getHeaders(store.getState().authReducers.token);
//   //console.log(API_MASTER_AREA + "/api/MasterArea");

//   try {
//     const response = await axios.get(API_INVENTORY + `/${id}`, {
//       headers: {
//         ...header,
//         ...param,
//       },
//     });
//     //console.log(response);

//     console.log(response, "res get By Id");

//     dispatch({ type: GET_ALL_INVENTORY_BY_ID, payload: response.data });
//     return response;
//   } catch (error) {
//     console.log(error.response);
//     console.error(error.response);
//   }
// };

export const saveDraftP3K = (newData) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.get(`${API_P3K}/api/P3K`, {
      headers: {
        ...header,
      },
      method: "POST",
    });

    return response;
  } catch (error) {
    console.log(error.response);
    console.error(error.response);
    return error;
  }
};

export const EditData =
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
        url: `${INVENTORY_URL}/Inventory/${newData.id}`,
        method: "PUT",
        headers: {
          ...header,
          ...cstmHeaders,
        },
        data: newData,
      });
      //console.log(response);

      return response;
    } catch (error) {
      console.log(error.response);
      console.error(error.response);
      return error;
    }
  };

export const ReviseData =
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
        url: `${INVENTORY_URL}/Inventory/Revise/${id}`,
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

export const RejectData =
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
        url: `${INVENTORY_URL}/Inventory/Reject/${id}`,
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

export const ApproveData =
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
        url: `${INVENTORY_URL}/Inventory/Approve/${id}`,
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

export const DeleteData =
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
        url: `${INVENTORY_URL}/Inventory/${id}`,
        method: "DELETE",
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

export const ApprovalLog = (docNo) => async (dispatch) => {
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
