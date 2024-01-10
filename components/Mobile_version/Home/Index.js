import React from "react";
import HomeHeader from "./HomeHeader";
import HomeBody from "./HomeBody";
import BottomNavigator from "./BottomNavigator";
import { useRouter } from "next/router";
import { Progress } from "reactstrap";

import { navigationData } from "./MobileNavigation";

const HomeMobile = ({ user }) => {
  const router = useRouter();
  return (
    <div>
      <HomeHeader user={user} />
      <HomeBody modules={navigationData} />
      <div
        style={{
          width: "90%",
          margin: "auto",
        }}
        className="mt-2"
      >
        <p style={{ fontSize: 14, fontWeight: "400", color: "#6E6B7B" }}>
          Inspeksi May 2023: 45/100
        </p>
        <Progress className="progress-bar-success" value={45} />
      </div>
      <BottomNavigator router={router} />
    </div>
  );
};

export default HomeMobile;
