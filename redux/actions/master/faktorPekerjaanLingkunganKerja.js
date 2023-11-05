import axios from "axios";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";

export const getAllFaktorPekerjaanLingkunganKerja = () => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);

  try {
    const response = await axios({
      url: "http://hsseonline-master-development-kf-asd-hsseonline-dev.apps.alpha.kalbe.co.id/api/MasterFaktorPekerjaanLingkunganKerja",
      method: "GET",
      headers: { ...header },
    });

    return response.data;
  } catch (error) {
    console.error(error.response, "ERROR getAllFaktorPekerjaanLingkunganKerja");
    return error.response;
  }
};
