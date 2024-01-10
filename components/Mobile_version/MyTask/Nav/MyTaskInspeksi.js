import MobileListCard from "components/MobileListCard";

import { wrapper } from "redux/store";
import moment from "moment";
import { useRouter } from "next/router";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { Search } from "react-feather";
import { useState } from "react";
const MyTaskInspeksi = ({ inspeksiData }) => {
  const router = useRouter();

  const [filteredData, setFilteredData] = useState(inspeksiData);
  const [search, setSearch] = useState("");

  const searchHandler = () => {
    const matchingObjects = inspeksiData.filter((obj) => {
      // Check if the search term is found in any property's value
      if (search === "") {
        return true;
      }

      for (const value of Object.values(obj)) {
        if (value?.toString().toLowerCase().includes(search.toLowerCase())) {
          return true;
        }
      }
      return false;
    });

    setFilteredData(matchingObjects);
  };

  return (
    <div className="mx-2">
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
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText>
              <Search
                onClick={() => {
                  // setPage(1);
                  searchHandler();
                }}
                size={14}
              />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </>
      {filteredData.map((inspeksi) => {
        if (inspeksi) {
          return (
            <MobileListCard
              data={[
                {
                  label: "Nomor Inspeksi",
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
              redirectTo={{
                pathname: "/hsse/mobile/inspeksi/capa",
                query: {
                  nomorPeralatan: inspeksi?.nomorPeralatan,
                  fromPath: router.pathname,
                },
              }}
            />
          );
        }
      })}
    </div>
  );
};

export default MyTaskInspeksi;
