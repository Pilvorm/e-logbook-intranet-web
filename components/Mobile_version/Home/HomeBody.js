import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { getPermissionComponentByRoles } from "helpers/getPermission";
const HomeBody = ({ modules }) => {
  console.log(modules);
  const router = useRouter();

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        flexWrap: "wrap",
        width: "90%",
        margin: "auto",
        marginTop: 50,
      }}
    >
      {modules.map((item, index) => {
        const permit = getPermissionComponentByRoles(item.roles);
        console.log(permit);
        if (permit) {
          return (
            <div
              key={index + 1}
              onClick={() => router.push(item.href)}
            >
              <div
                style={{
                  borderRadius: 10,
                  backgroundColor: "#46a583",
                  height: 80,
                  width: 80,
                  color: "white",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
                className="mx-2"
              >
                {item.icon}
              </div>
              <p
                style={{
                  paddingTop: 2,
                  fontSize: 12,
                  textAlign: "center",
                  maxWidth: 80,
                  color: "black",
                }}
                className="mx-2"
              >
                {item.title}
              </p>
            </div>
          );
        } else {
          return null;
        }
      })}
      <div></div>
    </div>
  );
};

export default HomeBody;
