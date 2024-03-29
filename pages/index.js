import React from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { authenticate, storeUserRoles } from "redux/actions/auth";
import { wrapper } from "redux/store";
import { connect, useDispatch } from "react-redux";
import { API_URL } from "constant";
import axios from "axios";
import { getHeaders } from "helpers/utils";
import VerticalLayout from "src/layouts/VerticalLayout";
import { Carousel } from "react-responsive-carousel";
import Head from "next/head";

const InitialPage = ({ userRoles }) => {
  console.log(userRoles, 'userRoles');
  // const { data: session, status } = useSession();
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   signIn();
  // }, [session]);

  return (
    <>
      {/* <Head>
        <meta
          http-equiv="Content-Security-Policy"
          content={`${process.env.NEXT_PUBLIC_API_MY_TASK} localhost:3000 ws://localhost:3000/ blob: http://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.js https://m-one.kalbe.co.id:8243/t/ ${process.env.NEXT_PUBLIC_API_MANUFACTURE_URL} ${process.env.NEXT_PUBLIC_API_UOM_URL} ${process.env.NEXT_PUBLIC_API_COMMENT_URL} ${process.env.NEXT_PUBLIC_API_ASSESSMENT_TASK} ${process.env.NEXT_PUBLIC_API_PROGRESS_APPROVAL_URL} ${process.env.NEXT_PUBLIC_API_REQUEST_FORECAST} ${process.env.NEXT_PUBLIC_API_MONITORING_CONTRACT} ${process.env.NEXT_PUBLIC_API_SUPPLIER_MANAGEMENT_URL} ${process.env.NEXT_PUBLIC_API_REGISTER_SUPPLIER} ${process.env.NEXT_PUBLIC_API_REQUEST_FORCAST} ${process.env.NEXT_PUBLIC_API_MASTER_COUNTRY} ${process.env.NEXT_PUBLIC_API_CONTRACT_APPROVAL} ${process.env.NEXT_PUBLIC_API_SUGGESTION_PROJECT} ${process.env.NEXT_PUBLIC_API_BID_COMPARISON} ${process.env.NEXT_PUBLIC_API_DATA_MASTER} ${process.env.NEXT_PUBLIC_API_REQUEST_BUDGET} ${process.env.NEXT_PUBLIC_API_BID_RESPONSE} ${process.env.NEXT_PUBLIC_API_REQUEST_BID} ${process.env.NEXT_PUBLIC_API_COMMENTS_DEV} ${process.env.NEXT_PUBLIC_API_STAGING_FC} ${process.env.NEXT_PUBLIC_API_STAGING_SC} ${process.env.NEXT_PUBLIC_API_STAGING_URL} ${process.env.NEXT_PUBLIC_API_USER_PROFILE} ${process.env.NEXT_PUBLIC_API_MASTER_TARGET_LT_SOURCING_URL} ${process.env.NEXT_PUBLIC_API_FILES_URL} ${process.env.NEXT_PUBLIC_API_FILES_STAGING_URL} ${process.env.NEXT_PUBLIC_API_MASTER_CLUSTERING_DOCUMENT_URL} ${process.env.NEXT_PUBLIC_API_MASTER_SITE_PRINT_OUT_URL} ${process.env.NEXT_PUBLIC_API_URL} ${process.env.NEXT_PUBLIC_API_AUTH_URL} fonts.googleapis.com fonts.gstatic.com; style-src 'self' fonts.googleapis.com 'unsafe-inline'; style-src-elem 'unsafe-inline' fonts.googleapis.com 'self'; font-src 'self' data: fonts.gstatic.com; img-src * blob: data:; frame-src youtube.com https://www.youtube.com;`}
        />
      </Head> */}

      <div>
        <VerticalLayout newUser={true}>
          
        </VerticalLayout>
      </div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const sessionData = await getSession(ctx);

    if (sessionData && sessionData.user) {
      store.dispatch(authenticate(sessionData.user.token));

      return {
        props: {
          sessionData: sessionData,
        },
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    }

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    return {
      props: {
        userRoles: sessionData
      },
    };
  }
);

export default connect((state) => state)(InitialPage);
