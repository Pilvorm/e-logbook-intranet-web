import moment from "moment";

const Apar = ({ style, data }) => {
  return (
    <>
      <div className="d-flex justify-content-between" style={style}>
        <p className="mr-5 text-left">Media</p>
        <strong className="ml-5 text-right">{data[0].media}</strong>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p className="mr-5 text-left">Merk</p>
        <strong className="ml-5 text-right">{data[0].merk}</strong>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p className="mr-5 text-left">Kapasitas</p>
        <strong className="ml-5 text-right">{data[0].kapasitas}</strong>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p className="mr-5 text-left">Berat</p>
        <strong className="ml-5 text-right">{data[0].berat}</strong>
      </div>
      <div className="d-flex justify-content-between" style={style}>
        <p className="mr-5 text-left">tanggalEdTabung</p>
        <strong className="ml-5 text-right">
          {moment(data[0].tanggalEdTabung).format("D MMMM Y")}
        </strong>
      </div>
    </>
  );
};

export default Apar;
