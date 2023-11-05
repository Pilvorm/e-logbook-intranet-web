import React, { useState } from "react";
import { Pagination } from "components/shared";
import {
  Table,
  InputGroup,
  InputGroupAddon,
  Label,
  InputGroupText,
  Input,
  CustomInput,
} from "reactstrap";
import { Search } from "react-feather";
import { useDispatch } from "react-redux";
const Nearmiss = ({
  router,
  pageSize,
  searchQuery,
  pageSizeOptions,
  handlePageSize,
  handleSearchQuery,
  setSearchQuery,
  pageNumber,
  handlePagination,
  isAlertModal,
  setIsAlertModal,
  alertStatus,
  alertMessage,
  isExportLoading,
}) => {
  const dispatch = useDispatch();

  const CreateTableRow = ({ data, router, token }) => {
    return (
      <tr>
        <td className="cursor-pointer" >
            <p style={{color: '#3e11ff'}}>0001/APR/DF</p>
        </td>
        <td>SAKA</td>
        <td>APAR</td>
        <td>Lobby Bawah</td>
        <td>Dry Chemicall</td>
        <td>Draft</td>
        <td>7</td>
        <td>8</td>
      </tr>
    );
  };
  return (
    <div className="mb-3 border">
      <div className="d-flex justify-content-between align-items-center mb-2 p-2">
        <div className="d-flex align-items-center mr-2">
          <Label for="rows-per-page">Show</Label>
          <CustomInput
            className="form-control ml-50 pr-3"
            type="select"
            id="rows-per-page"
            value={"tempPageSize"}
            // onChange={(e) => handlePageSize(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </CustomInput>
        </div>

        <div className="d-flex align-items-center">
          <InputGroup className="input-group-merge">
            <Input
              className="search-table2 w-50"
              type="text"
              name="search"
              id="search-master-user"
              placeholder="Search"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  dispatch(setSearch(e.target.value));
                }
              }}
              // value={tempSearchQuery || searchQuery}
              onChange={(e) => {
                setTempSearchQuery(e.target.value);
                forceUpdate();
              }}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <Search
                  onClick={() => dispatch(setSearch(tempSearchQuery))}
                  size={14}
                />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="overflow-auto stylized-scrollbar p-2">
        <Table responsive className="border">
          <thead>
            <tr>
              <th className="w-5 text-left">No. Dokumen</th>
              <th className="text-left">Site</th>
              <th className="text-left">Kategori</th>
              <th className="text-left">Nama yang terlibat kejadian</th>
              <th className="text-left">Tanggal & Waktu Kejadian</th>
              <th className="text-left">lokasi kejadian</th>
              <th className="text-left">potensi bahaya</th>
              <th className="text-left">investigasi nearmiss</th>
              <th className="text-left">CREATOR</th>
              <th className="text-left">Status</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {[{ no: 1, site: "a", category: "b" }, {}].map((data) => (
              <CreateTableRow
                key={data?.id}
                {...{ data, router, token: "a" }}
              />
            ))}
          </tbody>
        </Table>
      </div>
      <div className="p-2">
        <Pagination totalPage={"1"} {...{ pageNumber, handlePagination }} />
      </div>
    </div>
  );
};

export default Nearmiss;
