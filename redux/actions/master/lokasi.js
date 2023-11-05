import axios from "axios";
import { API_MASTER_LOKASI } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import {
  GET_ALL_MASTER_LOKASI,
  GET_MASTER_LOKASI_BY_ID,
  EDIT_MASTER_LOKASI,
} from "redux/types";

export const getAllMasterLokasi =
  (pageNumber, pageSize, searchQuery, filter = "") =>
  async (dispatch) => {
    const header = getHeaders(store.getState().authReducers.token);

    const headers = {
      ...header,
      "X-PAGINATION": true,
      "X-PAGE": pageNumber,
      "X-PAGESIZE": pageSize,
      "X-SEARCH": `*${searchQuery}*`,
      "X-FILTER": filter,
      "X-ORDERBY": "ID desc",
    };

    try {
      const response = await axios.get(
        API_MASTER_LOKASI + "/api/MasterLokasi",
        { headers }
      );

      dispatch({ type: GET_ALL_MASTER_LOKASI, payload: response.data });
    } catch (error) {
      console.error(error);
    }
  };

export const getMasterLokasiById = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.get(
      API_MASTER_LOKASI + "/api/MasterLokasi/" + id,
      {
        headers: { ...header },
      }
    );

    dispatch({ type: GET_MASTER_LOKASI_BY_ID, payload: response.data });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const createMasterLokasi = (data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios.post(
      API_MASTER_LOKASI + "/api/MasterLokasi",
      data,
      {
        headers: { ...header },
      }
    );
    return response;
    // dispatch({ type: CREATE_MASTER_LOKASI, payload: response.data })
  } catch (error) {
    throw error;
  }
};

export const deleteMasterLokasi = (id) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios.delete(
      API_MASTER_LOKASI + "/api/MasterLokasi/" + id,
      {
        headers: { ...header },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const editMasterLokasi = (id, data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios({
      url: API_MASTER_LOKASI + "/api/MasterLokasi/" + id,
      method: "PUT",
      headers: { ...header },
      data,
    });
    dispatch({ type: EDIT_MASTER_LOKASI, payload: response.data });

    return response;
  } catch (error) {
    return error.response;
  }
};
