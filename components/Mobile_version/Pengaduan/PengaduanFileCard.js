import Image from "next/image";

const PengaduanFileCard = ({ preview, index, name }) => {
  return (
    <div
      className="p-1"
      key={index}
      style={{
        borderStyle: "dashed",
        borderSpacing: 2,
        color: "#E2E5DE",
        width: "90%",
        margin: "auto",
      }}
    >
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <div
            style={{
              width: 24,
              height: 24,
              backgroundColor: "#46a583",
              borderRadius: 50,
              marginTop: 5,
            }}
          >
            <p
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: 700,
                paddingTop: 3,
              }}
            >
              {index + 1}
            </p>
          </div>
          <div className="ml-1 d-flex" style={{ gap: 20 }}>
            <Image alt={`image ${name}`} src={preview} width={41} height={36} />
            <h5
              style={{
                paddingTop: 10,
                fontWeight: 700,
                color: "black",
              }}
            >
              {name}
            </h5>
          </div>
        </div>
        {/* <div
          className="border cursor-pointer"
          style={{
            width: 36,
            height: 36,
            borderRadius: 4,
            borderColor: "#E9E9E9",
            textAlignLast: "center",
          }}
        >
          <Trash
            onClick={() => {
              arrPhotoDummy.splice(index, 1);
              forceUpdate();
            }}
            style={{ marginTop: 5 }}
            color="#f24f1f"
          />
        </div> */}
      </div>
    </div>
  );
};

export default PengaduanFileCard;
