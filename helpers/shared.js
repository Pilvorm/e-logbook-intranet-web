import axios from "axios";
import { API_LOGBOOK, API_FILE, API_FILES_URL, API_MASTER } from "constant";
import { getHeaders } from "./utils";
import { store } from "redux/store";

export const getFileHelper = (token, attachmentFileId) => {
  // const userToken = getTokenCookie(req);

  //   return axios({
  //     url: `${API_FILES_URL}/api/Files/${attachmentFileId}/download`,
  //     method: "get",
  //     headers: getHeaders(token),
  //   })
  //     .then((response) => response.data.blob)
  //     .catch((error) => console.log(error));
  return fetch(`${API_FILES_URL}/api/Files/${attachmentFileId}/download`, {
    method: "GET",
    headers: getHeaders(token),
  })
    .then((response) => response.blob())
    .then((data) => data)
    .catch((error) => console.log(error));
};

export const uploadSingleFiles = async (role, upn, name, email, data) => {
  const header = getHeaders(store.getState().authReducers.token);
  const cstmHeaders = {
    "CSTM-ROLE": role,
    "CSTM-UPN": upn,
    "CSTM-NAME": name,
    "CSTM-EMAIL": email,
  };

  try {
    const response = await axios({
      url: `${API_LOGBOOK}/UploadSign`,
      method: "POST",
      headers: {
        ...header,
        ...cstmHeaders,
      },
      data,
    });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const uploadMultipleFiles = async (data, moduleCode) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios({
      // url: API_FILE + "/upload/single?applicationCode=BSC&ModuleCode=PICAPA/SIRA",
      url: `${API_FILE}/api/Files/upload?applicationCode=HSSE&ModuleCode=${moduleCode}`,
      method: "POST",
      headers: { ...header },
      data,
    });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const getFiles = async (data, moduleCode) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios({
      // url: API_FILE + "/upload/single?applicationCode=BSC&ModuleCode=PICAPA/SIRA",
      url: `${API_FILE}/api/Files/upload?applicationCode=ESelection&ModuleCode=${moduleCode}`,
      method: "POST",
      headers: { ...header },
      data,
    });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const uploadFile = (data, moduleCode) => async (dispatch) => {
  const header = getHeaders(store.getState().authReducers.token);
  try {
    const response = await axios({
      // url: API_FILE + "/upload/single?applicationCode=BSC&ModuleCode=PICAPA/SIRA",
      url: `${API_FILE}/api/Files/upload?applicationCode=ESelection&ModuleCode=${moduleCode}`,
      method: "POST",
      headers: { ...header },
      data,
    });

    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchImage = async (imageId) => {
  try {
    const response = await fetch(`${API_FILE}/api/Files/${imageId}/download`);

    if (response.ok) {
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } else {
      console.error("Failed to fetch image");
      return null;
    }
  } catch (error) {
    console.error("Error occurred while fetching image:", error);
    return null;
  }
};

export const formatFilter = (filterData) => {
  const finalFilter = Object.entries(filterData)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .join("|");

  return finalFilter;
};

export const transformYupErrorsIntoObject = (errors) => {
  const validationErrors = {};

  errors.inner.forEach((error) => {
    if (error.path !== undefined) {
      validationErrors[error.path] = error.errors[0];
    }
  });

  return validationErrors;
};