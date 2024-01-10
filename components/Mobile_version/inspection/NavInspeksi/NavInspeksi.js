import { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import ButuhInspeksi from "./ButuhInspeksi";
import RiwayatInspeksi from "./RiwayatInspeksi";

const NavInspeksi = ({ listInspeksi, sessionData, listButuhInspeksi }) => {
  const [active, setActive] = useState(1);
  return (
    <>
      <Nav tabs className="mt-2 mx-2">
        <NavItem>
          <NavLink
            active={active === 1}
            onClick={() => {
              setActive(1);
            }}
          >
            Riwayat
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === 2}
            onClick={() => {
              setActive(2);
            }}
          >
            Butuh Inspeksi
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId={1}>
          <RiwayatInspeksi listInspeksi={listInspeksi} sessionData={sessionData}/>
        </TabPane>
        <TabPane tabId={2}>
          <ButuhInspeksi listButuhInspeksi={listButuhInspeksi} />
        </TabPane>
      </TabContent>
    </>
  );
};

export default NavInspeksi;
