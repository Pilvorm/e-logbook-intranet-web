import React, { useState } from "react";
import CarouselComponent from "components/Carousel";
import Image from "next/image";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  Row,
  Col,
  Button,
  Table,
} from "reactstrap";
import DashboardMenu from "./DashboardMenu";
import MyTaskMenu from "./MyTask/MyTaskMenu";
import { CustomBadge } from "components/Badge/CustomBadge";

const Dashboard = (props) => {
  const { sessionData, currRole, myTask } = props;
  const [active, setActive] = useState(1);

  return (
    <div>
      <Row>
        <Col md="12">
          <Card tag={Col} className="shadow p-2 d-flex" style={{ gap: "4px" }}>
            <h4 className="fontweight-normal">Hello,</h4>
            <h3>{sessionData.user.Name}</h3>
            <span style={{ color: "#B9B9C3" }}>
              {sessionData.user.Status == "Unconfirmed" ? (
                <CustomBadge type="danger" content="UNCONFIRMED" />
              ) : (
                <CustomBadge type="success" content={`${currRole}`} />
              )}{" "}
              — {sessionData.user.UserPrincipalName}
            </span>
          </Card>
        </Col>
      </Row>
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
        {/* <NavItem>
          <NavLink
            active={active === 2}
            onClick={() => {
              setActive(2);
            }}
          >
            Dashboard
          </NavLink>
        </NavItem> */}
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId={1}>
          <MyTaskMenu
            sessionData={sessionData}
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
