import HeaderHomeMobile from "components/Header-home-mobile/HeaderHomeMobile";
import useMobileDetector from "components/useMobileDetector";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import { wrapper } from "redux/store";
import NavMyTask from "components/Mobile_version/MyTask/Nav/NavMyTask";
import { getMyTaskPengaduan } from "redux/actions/pengaduan";

const MyTask = ({ sessionData, token, pengaduanData }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isMobileWidth = useMobileDetector();

  useEffect(() => {
    if (isMobileWidth) {
    } else {
      router.push("/home");
    }
  }, [isMobileWidth]);

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  return (
    <>
      <HeaderHomeMobile title="MY TASK" onBack={() => router.back()} />
      <NavMyTask pengaduanData={pengaduanData}/>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const sessionData = await getSession(ctx);
    const { query } = ctx;
    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    const token = sessionData.user.token;

    store.dispatch(reauthenticate(token));

    const apiPengaduan = await store.dispatch(
      getMyTaskPengaduan({
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0],
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": query.pageNumber || 1,
        "X-ORDERBY": "ID desc",
      })
    );

    console.log(apiPengaduan.data, "RESPONSEEEE");

    return {
      props: {
        sessionData,
        query: ctx.query,
        token: sessionData.user.token,
        pengaduanData: apiPengaduan.data,
      },
    };
  }
);

export default MyTask;
