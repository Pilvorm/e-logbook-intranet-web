import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { getSession, useSession } from "next-auth/react";
import { wrapper } from "redux/store";
import { Paper } from "@mui/material";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import Inventory from "components/my_task/Inventory";
import { useRouter } from "next/router";
import Accident from "components/my_task/Accident";
import Nearmiss from "components/my_task/Nearmiss";
import P3k from "components/my_task/P3k";

const Mytask = ({ pageNumber }) => {
  const handlePagination = () => {};
  const router = useRouter();
  const [active, setActive] = useState("1");
  const [isExportLoading, setIsExportLoading] = useState(false);
  const toggle = (key) => setActive(key);
  return (
    <div>
      <h2 className="py-2">My Task</h2>
      <Paper elevation={6}>
        <div className="px-2 py-2 mb-2">
          <Nav tabs>
            <NavItem>
              <NavLink
                active={active === "1"}
                onClick={() => {
                  toggle("1");
                }}
                className={`${active === "1" ? "text-dark" : "text-muted"}`}
              >
                Inventory
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                active={active === "2"}
                onClick={() => {
                  toggle("2");
                }}
                className={`${active === "2" ? "text-dark" : "text-muted"}`}
              >
                Kecelakaan Kerja
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === "3"}
                onClick={() => {
                  toggle("3");
                }}
                className={`${active === "3" ? "text-dark" : "text-muted"}`}
              >
                Nearmiss / Unsafe Action/ Unsafe Condition
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === "4"}
                onClick={() => {
                  toggle("4");
                }}
                className={`${active === "4" ? "text-dark" : "text-muted"}`}
              >
                P3K
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent className="ml-1 py-50" activeTab={active}>
            <TabPane tabId="1">
              <Inventory pageNumber={pageNumber} />
            </TabPane>
            <TabPane tabId="2">
              <Accident pageNumber={pageNumber} />
            </TabPane>
            <TabPane tabId="3">
              <Nearmiss pageNumber={pageNumber} />
            </TabPane>
            <TabPane tabId="4">
              <P3k pageNumber={pageNumber} />
            </TabPane>
          </TabContent>
        </div>
      </Paper>
    </div>
  );
};

Mytask.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    console.log(ctx.resolvedUrl);
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        pageNumber: 3,
        userRoles: sessionData
      },
    };
  }
);

export default Mytask;
