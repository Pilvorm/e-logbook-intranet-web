import { API_MASTER } from "constant";
import { getHeaders } from "helpers/utils";
import { store } from "redux/store";

export const searchUserInternal = (searchQuery) => {
  const header = getHeaders();

  return fetch(`${API_MASTER}/UserInternal/GetUserInternal`, {
    headers: {
      ...header,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.filter((school) => {
        return school.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAsyncOptionsUserInternal = (inputText) => {
  return searchSchool(inputText).then((resp) => {
    return resp.map((school) => ({
      ...school,
      value: school.schoolName,
      label: school.schoolName,
    }));
  });
};

export const searchMentor = (searchQuery) => {
  const header = getHeaders();

  return fetch(`${API_MASTER}/UserInternal/GetUserInternal`, {
    headers: {
      ...header,
      "X-PAGINATION": true,
      "X-PAGE": 1,
      "X-PAGESIZE": 10,
      "X-ORDERBY": "createdDate desc",
      "X-SEARCH": `*${searchQuery || ""}*`,
      "X-FILTER": `userRoles=mentor`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};