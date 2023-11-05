import { useEffect, useState } from "react";
import { Search } from "react-feather";
import { useDispatch } from "react-redux";
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
} from "reactstrap";
import { getAllInspection } from "redux/actions/inspeksi";

import InspectionCard from "../InspectionCard";

const ButuhInspeksi = ({ listButuhInspeksi }) => {

  return (
    <div className="m-1">
      {listButuhInspeksi.map((inspeksi) => {
        return (
          <MobileListCard
            data={[
              {
                label: "Nomor inspeksi",
                value: inspeksi.nomorInspeksi,
              },
              {
                label: "Nomor Peralatan",
                value: inspeksi.nomorPeralatan,
              },
              {
                label: "Jenis Peralatan",
                value: inspeksi.jenisPeralatan,
              },
              {
                label: "Area",
                value: inspeksi.area,
              },
              {
                label: "Lokasi",
                value: inspeksi.lokasi,
              },
              {
                label: "Tgl Pengecekan",
                value: moment(inspeksi.tglPengecekan).format("DD MMMM YYYY"),
              },
              {
                label: "Status",
                value: inspeksi.status,
              },
            ]}
            redirectTo={`/hsse/mobile/pengaduan/capa/${pengaduan.id}`}
          />
        );
      })}
    </div>
  );
};

export default ButuhInspeksi;
