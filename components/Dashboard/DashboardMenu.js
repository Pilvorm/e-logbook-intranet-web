import DashboardAccident from "./DashboardAccident";
import DashboardChart from "./DashboardChart";
import DashboardComplaint from "./DashboardComplaint";
import DashboardNearmiss from "./DashboardNearmiss";
import DashboardVictim from "./DashboardVictim";
import { Paper } from "@mui/material";
import CarouselComponent from "components/Carousel";
import Image from "next/image";

const DashboardMenu = () => {
  const DummyInspectionAparJune = () => {
    return (
      <div>
        <h3 className="text-left pl-2">
          Jumlah Inspeksi Peralatan APAR bulan June 2023
        </h3>
        <div className="d-flex justify-content-between mt-2 pl-2 pr-2">
          <div className="d-flex">
            <div>
              <Image
                src="/icons/home_icons/chart_ic.png"
                width={69}
                height={69}
              />
            </div>
            <div className="ml-1 text-left">
              <p className="text-bold">230</p>
              <p>Total</p>
            </div>
          </div>
          <div className="d-flex">
            <div>
              <Image
                src="/icons/home_icons/people_ic.png"
                width={69}
                height={69}
              />
            </div>
            <div className="ml-1 text-left">
              <p className="text-bold">230</p>
              <p>Belum diinspeksi</p>
            </div>
          </div>
          <div className="d-flex">
            <div>
              <Image
                src="/icons/home_icons/box_ic.png"
                width={69}
                height={69}
              />
            </div>
            <div className="ml-1 text-left">
              <p className="text-bold">230</p>
              <p>Inspeksi OK</p>
            </div>
          </div>
          <div className="d-flex">
            <div>
              <Image
                src="/icons/home_icons/dollar_ic.png"
                width={69}
                height={69}
              />
            </div>
            <div className="ml-1 text-left">
              <p className="text-bold">230</p>
              <p>Inspeksi NOK</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const DummyInspectionAparJuly = () => {
    return (
      <div>
        <h3 className="text-left pl-2">
          Jumlah Inspeksi Peralatan APAR bulan July 2023
        </h3>
        <div className="d-flex justify-content-between mt-2 pl-2 pr-2">
          <div className="d-flex">
            <Image
              src="/icons/home_icons/chart_ic.png"
              width={48}
              height={48}
            />
            <div className="ml-1 text-left">
              <p className="text-bold">230</p>
              <p>Total</p>
            </div>
          </div>
          <div className="d-flex">
            <Image
              src="/icons/home_icons/people_ic.png"
              width={48}
              height={48}
            />
            <div className="ml-1 text-left">
              <p className="text-bold">230</p>
              <p>Belum diinspeksi</p>
            </div>
          </div>
          <div className="d-flex">
            <Image src="/icons/home_icons/box_ic.png" width={48} height={48} />
            <div className="ml-1 text-left">
              <p className="text-bold">230</p>
              <p>Inspeksi OK</p>
            </div>
          </div>
          <div className="d-flex">
            <Image
              src="/icons/home_icons/dollar_ic.png"
              width={48}
              height={48}
            />
            <div className="ml-1 text-left">
              <p className="text-bold">230</p>
              <p>Inspeksi NOK</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const child = [<DummyInspectionAparJune />, <DummyInspectionAparJuly />];
  return (
    <>
      <Paper elevation={8}>
        <div>
          <CarouselComponent child={child} />
        </div>
      </Paper>
      <div className="mt-3">
        <DashboardChart />
      </div>
      <div className="mt-3">
        <DashboardComplaint />
        <div className="mt-2"></div>
      </div>
      <div className="mt-3">
        <DashboardAccident />
      </div>
      <div className="mt-3">
        <DashboardNearmiss />
      </div>
      <div className="mt-3">
        <DashboardVictim />
      </div>
    </>
  );
};

export default DashboardMenu;
