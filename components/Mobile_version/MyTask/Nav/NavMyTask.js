import { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import MyTaskPengaduan from "./MyTaskPengaduan";
import MyTaskInspeksi from "./MyTaskInspeksi";
import MyTaskInventory from "./MyTaskInven";

const NavMyTask = ({ pengaduanData, inspeksiData, inventoryData }) => {
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
            Inspeksi
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === 2}
            onClick={() => {
              setActive(2);
            }}
          >
            Pengaduan
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === 3}
            onClick={() => {
              setActive(3);
            }}
          >
            Inventory
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId={1}>
          <MyTaskInspeksi inspeksiData={inspeksiData} />
        </TabPane>
        <TabPane tabId={2}>
          <MyTaskPengaduan pengaduanData={pengaduanData} />
        </TabPane>
        <TabPane tabId={3}>
          <MyTaskInventory inventoryData={inventoryData} />
        </TabPane>
      </TabContent>
    </>
  );
};

export default NavMyTask;
