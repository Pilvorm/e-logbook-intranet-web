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
            Logbook
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
