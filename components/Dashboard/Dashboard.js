import React, { useState } from "react";
import CarouselComponent from "components/Carousel";
import Image from "next/image";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import DashboardMenu from "./DashboardMenu";
import MyTaskMenu from "./MyTask/MyTaskMenu";

const Dashboard = (props) => {
  const { myTask } = props;
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
            My Task
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === 2}
            onClick={() => {
              setActive(2);
            }}
          >
            Dashboard
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId={1}>
          <MyTaskMenu
            myTask={myTask}
          />
        </TabPane>
        <TabPane tabId={2}>
          <DashboardMenu />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Dashboard;
