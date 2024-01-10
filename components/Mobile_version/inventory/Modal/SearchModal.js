import { LoadingIndicator } from "components/shared";
import { getAllInventory } from "helpers/inventory";
import { errorNotification } from "helpers/utils";
import { useEffect, useState } from "react";
import { Search } from "react-feather";
import { useDispatch } from "react-redux";
import {
  Button,
  CustomInput,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";
import { reauthenticate } from "redux/actions/auth";

const SearchModal = ({
  openModal,
  openModalHandler,
  sessionData,
  submitHandler,
}) => {
  const [dataState, setDataState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reauthenticate(sessionData.user.token));
    getListInventory();
  }, []);

  const getListInventory = async () => {
    setLoading(true);
    const response = await getAllInventory(sessionData.user.token, {
      "CSTM-COMPID": sessionData.user.CompCode,
      "CSTM-NAME": sessionData.user.Name,
      "CSTM-EMAIL": sessionData.user.Email,
      "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0].RoleCode,
      "CSTM-UPN": sessionData.user.UserPrincipalName,
      "X-PAGINATION": true,
      "X-PAGE": 1,
      "X-PAGESIZE": 10,
      "X-ORDERBY": "createdDate desc",
      "X-SEARCH": `*${searchQuery || ""}*`,
      "X-FILTER": "status=Approved",
    });

    if (response.status >= 200 && response.status < 300) {
      setDataState(response.data.data);
    } else {
      errorNotification("Error", "Error Occured!");
      setDataState([]);
    }
    setLoading(false);
  };

  return (
    <Modal
      isOpen={openModal}
      backdrop={"static"}
      size="md"
      centered={true}
      toggle={() => openModalHandler()}
    >
      <ModalHeader
        className="modalHeaderTextRejectPopUp bg-primary"
        style={{ backgroundColor: "#3B85F8" }}
        toggle={() => openModalHandler()}
      >
        Nomor Peralatan
      </ModalHeader>
      <ModalBody>
        <>
          <InputGroup className="input-group-merge">
            <Input
              className="search-table2 w-50"
              type="text"
              name="search"
              id="search-master-user"
              placeholder="Search"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                }
              }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <Search
                  onClick={() => {
                    getListInventory();
                  }}
                  size={14}
                />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </>
        <Table responsive className="mt-1">
          <thead className="text-center">
            <tr>
              <th>No. Peralatan</th>
              <th>Jenis Peralatan</th>
              <th>Lokasi</th>
              <th>Area</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Spinner className="d-flex justify-content-center" />
            ) : (
              dataState.map((data) => {
                return (
                  <tr>
                    <td
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        submitHandler(data.id);
                      }}
                    >
                      {data.nomorPeralatan}
                    </td>
                    <td>{data.jenisPeralatan}</td>
                    <td>{data.lokasi}</td>
                    <td>{data.area}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" outline onClick={() => openModalHandler()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SearchModal;
