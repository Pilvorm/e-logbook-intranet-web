import { Paper } from "@mui/material";
import React from "react";
import { Home, FileText, Calendar, User } from "react-feather";

const BottomNavigator = ({ router }) => {
  return (
    <>
      <div className="pt-5"></div>
      <div
        className=""
        style={{
          position: "fixed",
          bottom: 0,
          backgroundColor: "white",
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Paper elevation={8} style={{ minHeight: 55 }}>
          <div
            className="d-flex justify-content-between m-auto items-center"
            style={{ width: "70%" }}
          >
            <Home
              style={{ marginTop: 10 }}
              width={35}
              height={35}
              color={router.pathname === "/home" ? "green" : "black"}
            />
            <FileText style={{ marginTop: 10 }} width={35} height={35} />
            <Calendar style={{ marginTop: 10 }} width={35} height={35} />
            <User style={{ marginTop: 10 }} width={35} height={35} />
          </div>
        </Paper>
      </div>
    </>
  );
};

export default BottomNavigator;
