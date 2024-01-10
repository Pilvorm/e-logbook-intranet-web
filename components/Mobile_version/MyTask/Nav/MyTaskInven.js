import MobileListCard from "components/MobileListCard";
import moment from "moment";
import { useState } from "react";
import { Search } from "react-feather";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

const MyTaskInventory = ({ inventoryData }) => {
  const getRedirect = (inventory) => {
    if (inventory.status.includes("Waiting for revision")) {
      return `/hsse/mobile/inventory/${inventory.id}`;
    } else {
      return `/hsse/mobile/inventory/approval/${inventory.id}`;
    }
  };

  const [filteredData, setFilteredData] = useState(inventoryData);
  const [search, setSearch] = useState("");

  const searchHandler = () => {
    const matchingObjects = inventoryData.filter((obj) => {
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
      {filteredData.map((inventory, index) => {
        if (inventory) {
          return (
            <MobileListCard
              key={index}
              data={[
                {
                  label: "Nomor Dokumen",
                  value: inventory.nomorDokumen,
                },
                {
                  label: "Nomor Peralatan",
                  value: inventory.nomorPeralatan,
                },
                {
                  label: "Jenis Peralatan",
                  value: inventory.jenisPeralatan,
                },
                {
                  label: "Area",
                  value: inventory.area,
                },
                {
                  label: "Lokasi",
                  value: inventory.lokasi,
                },
                {
                  label: "Tgl Pengecekan",
                  value: moment(inventory.tglPengecekan).format("DD MMMM YYYY"),
                },
                {
                  label: "Status",
                  value: inventory.status,
                },
              ]}
              redirectTo={getRedirect(inventory)}
            />
          );
        }
      })}
    </div>
  );
};

export default MyTaskInventory;
