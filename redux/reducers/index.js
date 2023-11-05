import { combineReducers } from "redux";
import masterAreaReducers from "redux/reducers/master/area";
import masterLokasiReducers from "redux/reducers/master/lokasi";
import authReducers from "redux/reducers/auth";
import masterUserReducers from "./master/user";
import masterRoleReducers from "./master/roles";
import kecelakaanKerjaReducers from "./kecelakaanKerja";
import masterInventoryReducers from "./inventory";
import masterNearmissReducers from "./nearmiss";
import inspeksiReducer from "./inspeksi";
import userProfileReducer from "./userProfile";

export default combineReducers({
  authReducers,
  masterAreaReducers,
  masterLokasiReducers,
  masterUserReducers,
  masterRoleReducers,
  kecelakaanKerjaReducers,
  masterInventoryReducers,
  masterNearmissReducers,
  inspeksiReducer,
  userProfileReducer,
});
