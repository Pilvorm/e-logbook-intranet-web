import MobileListCard from "components/MobileListCard";
import { getSession } from "next-auth/react";
import { getMyTaskPengaduan } from "redux/actions/pengaduan";
import { wrapper } from "redux/store";
import moment from "moment";
const MyTaskPengaduan = ({ pengaduanData }) => {
  console.log(pengaduanData, "PENGADUANNNNNNN");
  return (
    <div className="mx-2">
      {pengaduanData.map((pengaduan) => {
        if (pengaduan) {
          return (
            <MobileListCard
              data={[
                {
                  label: "Nomor Pengaduan",
                  value: pengaduan.nomorPengaduan,
                },
                {
                  label: "Nomor Peralatan",
                  value: pengaduan.nomorPeralatan,
                },
                {
                  label: "Jenis Peralatan",
                  value: pengaduan.jenisPeralatan,
                },
                {
                  label: "Area",
                  value: pengaduan.area,
                },
                {
                  label: "Lokasi",
                  value: pengaduan.lokasi,
                },
                {
                  label: "Tgl Pengecekan",
                  value: moment(pengaduan.tglPengecekan).format("DD MMMM YYYY"),
                },
                {
                  label: "Status",
                  value: pengaduan.status,
                },
              ]}
              redirectTo={`/hsse/mobile/pengaduan/capa/${pengaduan.id}`}
            />
          );
        }
      })}
    </div>
  );
};

export default MyTaskPengaduan;
