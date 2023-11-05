import axios from "axios";
import { API_MASTER_AREA } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import {
  GET_ALL_MASTER_AREA,
  GET_MASTER_AREA_BY_ID,
  EDIT_MASTER_AREA,
} from "redux/types";

export const getAllMasterArea =
  (pageNumber, pageSize, searchQuery, filter = "") =>
  async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);

    const headers = {
      ...header,
      "X-PAGINATION": true,
      "X-PAGE": pageNumber,
      "X-PAGESIZE": pageSize,
      "X-SEARCH": `*${searchQuery}*`,
      "X-ORDERBY": "ID desc",
    };

    try {
      const response = await axios.get(API_MASTER_AREA + "/api/MasterArea", {
        headers: {
          ...header,
          "X-PAGINATION": true,
          "X-PAGE": pageNumber,
          "X-PAGESIZE": pageSize,
          "X-SEARCH": `*${searchQuery}*`,
          "X-FILTER": filter,
          "X-ORDERBY": "ID desc",
        },
      });
      console.log(response);

      dispatch({ type: GET_ALL_MASTER_AREA, payload: response.data });
    } catch (error) {
      console.log(error.response);
      console.error(error.response);
    }
  };

export const getMasterAreaById = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.get(
      API_MASTER_AREA + "/api/MasterArea/" + id,
      {
        headers: { ...header },
      }
    );

    dispatch({ type: GET_MASTER_AREA_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const createMasterArea = (data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios.post(
      API_MASTER_AREA + "/api/MasterArea",
      data,
      {
        headers: { ...header },
      }
    );
    return response;
    // dispatch({ type: CREATE_MASTER_AREA, payload: response.data })
  } catch (error) {
    throw error;
  }
};

export const deleteMasterArea = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.delete(
      API_MASTER_AREA + "/api/MasterArea/" + id,
      {
        headers: { ...header },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const editMasterArea = (id, data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios({
      url: API_MASTER_AREA + "/api/MasterArea/" + id,
      method: "PUT",
      headers: { ...header },
      data,
    });
    dispatch({ type: EDIT_MASTER_AREA, payload: response.data });

    return response;
  } catch (error) {
    return error.response;
  }
};
