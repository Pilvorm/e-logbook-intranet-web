import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { useRouter } from "next/router";
import useMobileDetector from "components/useMobileDetector";
import HomeMobile from "components/Mobile_version/Home/Index";
import dynamic from "next/dynamic";
import HeaderHomeMobile from "components/Header-home-mobile/HeaderHomeMobile";

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

const QrCode = ({ userRoles }) => {
  const router = useRouter();

  const isMobileWidth = useMobileDetector();
  console.log(isMobileWidth, "isMobileWidth");
  const [isMobileDevice, setIsMobileDevice] = useState(isMobileWidth);

  useEffect(() => {
    if (isMobileWidth) {
      setIsMobileDevice(true);
    } else {
      router.push("/home");
    }
  }, [isMobileWidth]);

  const getDetailActivity = (text) => {
    router.push({
      pathname: "/hsse/mobile/qr-code/validate",
      query: {
        nomorPeralatan: text,
      },
    });
  };

  return (
    <>
      <HeaderHomeMobile title="HSSE ONLINE" onBack={() => router.back()} />
      {isMobileWidth ? (
        <div className="mt-5 m-auto" style={{ width: "90%" }}>
          <BarcodeScanner
            height={750}
            onUpdate={(err, result) => {
              if (result) getDetailActivity(result.text);
              // setTimeout(() => {
              //   router.push("/hsse/mobile/qr-code/validate")
              // }, 1000)
            }}
            stopStream={true}
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

QrCode.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
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
      props: { userRoles: sessionData },
    };
  }
);

export default QrCode;
