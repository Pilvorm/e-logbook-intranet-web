import { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import MyTaskPengaduan from "./MyTaskPengaduan";

const NavMyTask = ({ pengaduanData }) => {
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
            Pengaduan
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId={1}>
          <MyTaskPengaduan pengaduanData={pengaduanData}/>
        </TabPane>
      </TabContent>
    </>
  );
};

export default NavMyTask;
