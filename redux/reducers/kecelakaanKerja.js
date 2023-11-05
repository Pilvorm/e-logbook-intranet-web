import {
  GET_ALL_KECELAKAAN_KERJA,
  GET_ALL_KECELAKAAN_KERJA_BY_ID,
  DELETE_KECELAKAAN_KERJA,
  EDIT_KECELAKAAN_KERJA,
  CREATE_KECELAKAAN_KERJA
} from "redux/types";

const initialState = {
  data: [],
  currentPage: 0,
  totalPage: 0,
  pageSize: 0,
};

export default function kecelakaanKerjaReducers(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_KECELAKAAN_KERJA:
      return {
        ...state,
        data: action.payload.data,
        currentPage: action.payload.currentPage,
        totalPage: action.payload.totalPage,
        pageSize: action.payload.pageSize,
        totalData: action.payload.totalData,
      };

    case GET_ALL_KECELAKAAN_KERJA_BY_ID:
      return action.payload;

      case CREATE_KECELAKAAN_KERJA:
        return action.payload;   

    case DELETE_KECELAKAAN_KERJA:
      return action.payload;  
    
      case EDIT_KECELAKAAN_KERJA:
        return action.payload;    

    default:
      return state;
  }
}
