import { Card, Paper } from "@mui/material";
import CarouselComponent from "components/Carousel";
import Image from "next/image";

const DashboardMenu = () => {

  const child = [<>Test</>];
  return (
    <>

        <div className="shadow">
          <CarouselComponent child={child} />
        </div>

    </>
  );
};

export default DashboardMenu;
