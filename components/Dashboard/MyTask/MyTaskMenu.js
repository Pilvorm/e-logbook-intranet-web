import { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

const MyTaskMenu = () => {
  const [active, setActive] = useState(1);
  return (
    <div>
      <Nav tabs className="mt-2 mx-2">
        <NavItem>
          <NavLink
            active={active === 1}
            onClick={() => {
              setActive(1);
            }}
          >
            Kecelakaan Kerja
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === 2}
            onClick={() => {
              setActive(2);
            }}
          >
            Nearmiss
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === 3}
            onClick={() => {
              setActive(3);
            }}
          >
            P3K
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId={1}></TabPane>
        <TabPane tabId={2}></TabPane>
      </TabContent>
    </div>
  );
};

export default MyTaskMenu;
