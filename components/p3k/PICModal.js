import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner, // Added Spinner component for loading
} from "reactstrap";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { useCallback } from "react";
import { Search } from "react-feather";

import {
  errorAlertNotification,
  successAlertNotification,
} from "components/notification";
import { searchUser } from "helpers/master/masterRole";
import UserOptionPIC from "components/UserOptionsPIC";
import DatePickrWihoutFormik from "components/CustomInputs/DatePickrWihoutFormik";

const DropdownIndicator = (props) => {
  return (
    <Search
      set="light"
      primaryColor="blueviolet"
      style={{ padding: "4px", marginRight: "2px" }}
    />
  );
};

function PICModal({ show, onHide, onAddPIC }) {
  const [loading, setLoading] = useState(false);

  // Handling user profile search
  const [selectedName, setSelectedName] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [recommend, setReccomend] = useState("");

  const getAsyncOptionsName = (inputText) => {
    return searchUser(inputText).then((resp) => {
      return resp.data.items.map((singleData) => ({
        ...singleData,
        value: singleData.nik,
        label: singleData.name,
      }));
    });
  };

  const loadOptionsName = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsName(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const handleSubmit = async () => {
    try {
      onAddPIC(
        recommend,
        dueDate,
        selectedName?.userPrincipalName,
        selectedName?.name,
        selectedName?.deptName,
        selectedName?.email
      );
    } catch (error) {
      errorAlertNotification("Error", error || "Something went wrong");
      console.error("Submit upload failed:", error);
    }

    setSelectedName("");
    onHide();
  };

  console.log(selectedName);
  console.log(recommend);

  return (
    <Modal isOpen={show} toggle={onHide}>
      <ModalHeader toggle={onHide}>Recommendation Action</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <AsyncSelect
              id="nameSearch"
              className="dropdownModal"
              isSearchable
              loadOptions={loadOptionsName}
              components={{ DropdownIndicator }}
              getOptionValue={(option) => option.value}
              value={selectedName?.name}
              formatOptionLabel={(data) => (
                <UserOptionPIC
                  key={data?.id}
                  profilePicture={
                    data.profilePicturePath ||
                    "/images/avatars/avatar-blank.png"
                  }
                  name={`${data?.name}`}
                  subtitle={data?.compName}
                  subtitle2={data?.deptName}
                />
              )}
              onChange={(e) => {
                setSelectedName(e);
              }}
              placeholder={selectedName?.name || "Search by name or email"}
            />
          </FormGroup>

          <FormGroup>
            <Label for="perusahaan">Perusahaan</Label>
            <Input
              type="text"
              id="perusahaan"
              value={selectedName?.compName}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label for="departemen">Departemen</Label>
            <Input
              type="textarea"
              id="departemen"
              value={selectedName?.deptName}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label for="departemen">Due Date</Label>

            <DatePickrWihoutFormik
              name="dueDate"
              id="dueDate"
              backgroundWhite={true}
              onChange={(input) => setDueDate(input)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="departemen">Rekomendasi</Label>
            <Input
              type="text"
              id="rekomendasi"
              onChange={(e) => setReccomend(e.target.value)}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        {loading ? (
          <Spinner size="sm" color="light" />
        ) : (
          <>
            <Button color="primary" onClick={handleSubmit}>
              Add
            </Button>
            <Button color="secondary" onClick={onHide}>
              Close
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

export default PICModal;
