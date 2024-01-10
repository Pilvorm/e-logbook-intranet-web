import MobileListCard from "components/MobileListCard";
import { useRouter } from "next/router";
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
import moment from "moment";
import InspectionCard from "../InspectionCard";

const ButuhInspeksi = ({ listButuhInspeksi }) => {
  const router = useRouter();

  console.log(listButuhInspeksi);

  return (
    <div className="m-1">
      {listButuhInspeksi.map((inspeksi) => {
        return (
          <MobileListCard
            data={[
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
            ]}
            redirectTo={{
              pathname: `/hsse/mobile/inspeksi/detail`,
              query: {
                nomorPeralatan: inspeksi.nomorPeralatan,
              },
            }}
          />
        );
      })}
    </div>
  );
};

export default ButuhInspeksi;
