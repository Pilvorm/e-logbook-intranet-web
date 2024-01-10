import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { API_USER_URL } from "constant";
import { getHeaders } from "helpers/utils";
import { storeUserRoles } from "redux/actions/auth";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Dashboard from "components/Dashboard/Dashboard";
import DashboardChart from "components/Dashboard/DashboardChart";
import DashboardComplaint from "components/Dashboard/DashboardComplaint";
import { useRouter } from "next/router";
import useMobileDetector from "components/useMobileDetector";
import HomeMobile from "components/Mobile_version/Home/Index";
import DashboardAccident from "components/Dashboard/DashboardAccident";
import DashboardNearmiss from "components/Dashboard/DashboardNearmiss";
import DashboardVictim from "components/Dashboard/DashboardVictim";
import {
  getAuthUser,
  getModule,
  getModuleMobile,
  getRoleUser,
} from "helpers/auth";
import { useSelector } from "react-redux";

const Home = ({ userRoles, query, roles }) => {
  console.log(roles);
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobileWidth = useMobileDetector();
  const [moduleMobile, setModuleMobile] = useState([]);

  useEffect(async () => {
    if (isMobileWidth) {
      const res = await getModuleMobile();
      console.log(res, "<<<<<");
      setModuleMobile(res.data);
    }
  }, [isMobileWidth]);

  useEffect(() => {
    if (query.url) {
      router.push({
        pathname: query.url,
      });
    }
  }, [query]);

  useEffect(() => {
    dispatch(storeUserRoles(roles));
  }, [dispatch]);

  const { data: session } = useSession();

  return (
    <>
      {isMobileWidth ? (
        <HomeMobile user={userRoles?.user} moduleMobile={moduleMobile} />
      ) : (
        <>
          <div className="mt-3">
            <Dashboard />
            <div className="mt-1"></div>
          </div>
        </>
      )}
    </>
  );
};

// EXAMPLE USING PAGE PERMISSION
// Home.auth = {
//   roles: ["Admin Master Table Sourcing", "asdasd"],
// };

Home.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    let temp = [];
    try {
      if (sessionData) {
        if (sessionData.user.guest) {
          temp.push("HSSE-USR");
        } else {
          const roles = JSON.parse(sessionData.user.Roles).map((role) => {
            temp.push(role.RoleCode);
          });
        }
      }
    } catch (err) {}

    return {
      props: {
        userRoles: sessionData,
        query: ctx.query,
        roles: temp,
      },
    };
  }
);

export default Home;
