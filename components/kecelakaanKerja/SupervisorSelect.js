import { Label } from "reactstrap";
import debounce from "lodash/debounce";
import AsyncSelect from "react-select/async";
import { useCallback, useState } from "react";
import { getAsyncOptionsUser } from "helpers/master/masterRole";
import { Search } from "react-feather";
import UserOptionItem from "components/UserOptionItem";

const DropdownIndicator = (props) => {
  return (
    <Search
      set="light"
      // color="blueviolet"
      style={{ padding: "4px", marginRight: "2px" }}
    />
  );
};

export default function SupervisorSelect({
  defaultOptions = [],
  formik,
  formikFieldName,
}) {
  const loadOptionsUser = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsUser(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  return (
    <>
      <Label style={{ fontSize: "12px" }} className="font-weight-bold">
        Supervisor / penanggung jawab kegiatan korban
      </Label>
      <AsyncSelect
        id="nameSearch"
        className="dropdownModal"
        isSearchable
        defaultOptions={defaultOptions}
        loadOptions={loadOptionsUser}
        components={{ DropdownIndicator }}
        value={formik.values[formikFieldName] || null}
        formatOptionLabel={(data) => (
          <UserOptionItem
            key={data?.id}
            profilePicture={
              data.profilePicturePath || "/images/avatars/avatar-blank.png"
            }
            name={`${data?.name} (${data?.userPrincipalName})`}
            subtitle={data?.compName}
          />
        )}
        onChange={(e) => {
          console.log(e);
          formik.setFieldValue(formikFieldName, e.name);
        }}
        placeholder={
          formik.values[formikFieldName] || "Search by name or email"
        }
      />
    </>
  );
}
