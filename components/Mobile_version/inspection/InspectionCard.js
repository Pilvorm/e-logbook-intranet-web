import { useRouter } from "next/router";
import { Card } from "reactstrap";
import moment from "moment";
const InspectionCard = ({ item }) => {
  const style = { borderBottom: "2px solid #ebe9f2", marginTop: 5 }; //Harus dipindahkan ke file module.css
  const router = useRouter();
  return (
    <Card
      onClick={() => {
        router.push(`${router.pathname}/${item.id}`);
      }}
      key={1}
      className="p-1 mt-1 border"
    >
      <div className="d-flex justify-content-between" style={style}>
        <p className="text-primary">Nomor Inspeksi</p>
        <p className="mr-2 text-primary">{item.nomorInspeksi}</p>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p>Nomor Peralatan</p>
        <p className="mr-2">{item.nomorPeralatan}</p>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p>Jenis Peralatan</p>
        <p className="mr-2">{item.jenisPeralatan}</p>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p>Area</p>
        <p className="mr-2">{item.area}</p>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p>Lokasi</p>
        <p className="mr-2">{item.lokasi}</p>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p>Tgl Pengecekan</p>
        <p className="mr-2">
          {moment(item.tglPengecekan).format("DD MMMM YYYY")}
        </p>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p className="mr-5">Status</p>
        <p className=" ml-5 mr-2 text-right">{item.status}</p>
      </div>
    </Card>
  );
};

export default InspectionCard;
