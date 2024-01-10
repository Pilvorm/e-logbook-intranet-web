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

const RiwayatInspeksi = ({ listInspeksi, sessionData }) => {
  const [dataState, setDataState] = useState(listInspeksi?.data || []);
  const [page, setPage] = useState(listInspeksi?.currentPage + 1 || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(listInspeksi?.hasNext || false);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200 &&
        !isLoading
      ) {
        fetchMoreData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  const hitAPI = async (idx) => {
    const response = await dispatch(
      getAllInspection({
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0],
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": idx || page,
        "X-ORDERBY": "createdDate desc",
        "X-SEARCH": `*${search}*`,
      })
    );

    console.log(response);
    return response;
  };

  const fetchMoreData = async () => {
    if (!hasNext || isLoading) return;

    setIsLoading(true);
    try {
      const response = await hitAPI();

      const newData = dataState.concat(response?.data.data);

      setDataState(newData);
      // if (response?.hasNext) {
      setHasNext(response?.data.hasNext);
      setPage(response?.data.currentPage + 1);
      // }else{
      //   setHasNext(false);
      // }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const searchHandler = async () => {
    setIsLoading(true);
    try {
      const response = await hitAPI(1);

      const newData = response?.data.data;
      setDataState(newData);
      setHasNext(response?.data.hasNext);
      setPage(response?.data.currentPage + 1);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="m-1 mx-2">
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
            // value={tempSearchQuery || searchQuery}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText>
              <Search
                onClick={() => {
                  setPage(1);
                  searchHandler();
                }}
                size={14}
              />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </>
      {dataState &&
        dataState.map((item) => {
          return <InspectionCard item={item} />;
        })}
      {isLoading && (
        <div>
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default RiwayatInspeksi;
