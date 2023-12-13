import axios from "axios";
import { API_MASTER } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";
import { GET_ALL_MASTER_ALLOWANCE, EDIT_MASTER_ALLOWANCE } from "redux/types";

export const getAllAllowance = () => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + "/Education",
      method: "GET",
      headers: { ...header },
    });

    dispatch({ type: GET_ALL_MASTER_ALLOWANCE, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const editAllowance = (id, data) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: API_MASTER + `/Education/${id}`,
      method: "PUT",
      headers: { ...header },
      data
    });

    dispatch({ type: EDIT_MASTER_ALLOWANCE, payload: response.data });
    return response;
  } catch (error) {
    return error.response;
  }
};
