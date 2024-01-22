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
import { useRouter } from "next/router";
import useMobileDetector from "components/useMobileDetector";
import HomeMobile from "components/Mobile_version/Home/Index";
import {
  getAuthUser,
  getModule,
  getModuleMobile,
  getRoleUser,
} from "helpers/auth";
import { useSelector } from "react-redux";
import {
  getUnconfirmedIntern,
  getMentorTask,
} from "redux/actions/master/intern";

const Home = ({ userRoles, query, roles, sessionData, myTask, currRole }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobileWidth = useMobileDetector();
  const [moduleMobile, setModuleMobile] = useState([]);

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
  console.log(session);
  console.log(roles);
  console.log("Test " + currRole);

  return (
    <>
      <div className="mt-3">
        <Dashboard sessionData={sessionData} currRole={currRole} myTask={myTask} />
        <div className="mt-1"></div>
      </div>
    </>
  );
};

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
          temp.push("INTERN");
        } else {
          const response = await getRoleUser(
            sessionData.user.UserPrincipalName.replace("@", "%40")
          );
          console.log("step 2", response);
          if (response.data != false) {
            response.data.map(async (item) => {
              return temp.push(item.roleCode); // multi roles
            });
          } else {
            return (temp = response.data[0].roleCode);
          }
        }
        store.dispatch(storeUserRoles(temp));
      }
    } catch (err) {}
    console.log(temp, "temp");

    let currRole = temp == "MENTOR" ? "MENTOR" : "HR";

    if (currRole == "HR") {
      await store.dispatch(
        getUnconfirmedIntern({
          "CSTM-COMPID": sessionData.user.CompCode,
          "CSTM-NAME": sessionData.user.Name,
          "CSTM-EMAIL": sessionData.user.Email,
          "CSTM-UPN": sessionData.user.UserPrincipalName,
          "X-PAGINATION": true,
          "X-PAGE": 1,
          "X-PAGESIZE": 50,
          "X-ORDERBY": "createdDate desc",
          "X-SEARCH": `*${""}*`,
        })
      );
    } else {
      await store.dispatch(
        getMentorTask({
          "CSTM-NAME": sessionData.user.Name,
        })
      );
    }

    const myTask = store.getState().masterInternReducers;

    return {
      props: {
        userRoles: sessionData,
        query: ctx.query,
        roles: temp,
        sessionData,
        myTask,
        currRole,
      },
    };
  }
);

export default Home;
