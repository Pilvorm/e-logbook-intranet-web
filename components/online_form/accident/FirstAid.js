import React from "react";
import {
    Input,
    CustomInput,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Button
} from 'reactstrap';
import {
    Calendar,
    Search,
    Plus
} from 'react-feather';
import DatePicker from "react-datepicker";
import { Paper } from "@mui/material";
import ListLampiran from "components/online_form/accident/ListLampiran";
import Checkbox from '@mui/material/Checkbox';

const FirstAid = ({
    unsafeCondition,
    unsafeReason,
    workFactor,
    personalFactor
}) => {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <div className="mt-2" style={{ width: "90%" }}>
      <div>
        <h6>Pertolongan pertama yang diberikan dan kapan?</h6>
        <Input
          style={{ minHeight: 100 }}
          type="textarea"
          name="text"
          id="exampleText"
          rows="3"
          placeholder="Textarea"
        />
      </div>
      <div className="mt-2">
        <h6>Perawatan lanjutan (Nama RS / Klinik)</h6>
        <Input
          style={{ minHeight: 100 }}
          type="textarea"
          name="text"
          id="exampleText"
          rows="3"
          placeholder="Textarea"
        />
      </div>
      <div className="mt-2">
        <h6>Apakah dapat kembali bekerja langsung?</h6>
        <div
          className="d-flex justify-content-between px-1"
          style={{ width: "20%" }}
        >
          <CustomInput
            type="radio"
            id="exampleCustomRadio"
            name="customRadio"
            inline
            label="Ya"
          />
          <CustomInput
            type="radio"
            id="exampleCustomRadio2"
            name="customRadio"
            inline
            label="Tidak"
          />
        </div>
      </div>
      <div className="mt-2">
        <h6>Tanggal bekerja kembali dengan normal</h6>
        <div
          className="d-flex justify-content-between"
          style={{ width: "40%" }}
        >
          <div className="form-control d-flex justify-content-between align-items-center pl-0">
            <DatePicker
              placeholderText="Placeholder"
              dateFormat="dd MMM yyyy"
              showMonthDropdown
              showYearDropdown
              selected={new Date()}
              dropdownMode="select"
              className="form-control w-100 border-left-0 border-right-0"
            />
            <div className="mx-50"></div>
            <Calendar size={18} />
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h6>Kerusakan properti lingkungan</h6>
        <Input
          style={{ minHeight: 100 }}
          type="textarea"
          name="text"
          id="exampleText"
          rows="3"
          placeholder="Textarea"
        />
      </div>
      <div className="mt-2">
        <h6>Biaya perbaikan dan penanggulangan (Real dan Estimasi)</h6>
        <Input
          style={{ minHeight: 100 }}
          type="textarea"
          name="text"
          id="exampleText"
          rows="3"
          placeholder="Textarea"
        />
      </div>
      <div className="mt-2">
        <h6>Supervisor / Penanggung jawab kegiatan korban</h6>
        <div
          className="d-flex justify-content-between"
          style={{ width: "40%" }}
        >
          <InputGroup className="input-group-merge">
            <Input
              className="search-table2 w-50"
              type="text"
              name="search"
              id="search-master-user"
              placeholder="Search"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  dispatch(setSearch(e.target.value));
                }
              }}
              disabled
            />
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <Search
                  onClick={() => dispatch(setSearch(tempSearchQuery))}
                  size={14}
                />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="mt-2">
        <h6>Nama - nama saksi (jika ada)</h6>
        <Input
          style={{ minHeight: 100 }}
          type="textarea"
          name="text"
          id="exampleText"
          rows="3"
          placeholder="Textarea"
        />
      </div>
      <div className="mt-2" style={{ width: "85%" }}>
        <Paper elevation="6">
          <div className="p-2">
            <div className="w-100">
              <Button.Ripple
                color="primary"
                onClick={() => router.push(`${router.pathname}/formcreate-new`)}
                className="cursor-pointer"
              >
                <Plus size={18} />
                <span className="align-middle ml-1 d-sm-inline-block d-none">
                  Lampiran
                </span>
              </Button.Ripple>
            </div>
            <div className="mt-2">
              <ListLampiran dummyData={[{ no: 1 }]} />
            </div>
          </div>
        </Paper>
      </div>
      <div className="mt-2 d-flex">
        <div style={{ minWidth: "55%" }}>
          <h6>Kondisi tidak aman penyebab kecelakaan</h6>
          <div>
            {unsafeCondition.map((item, index) => {
              return (
                <div>
                  <div key={index} className="d-flex">
                    <Checkbox
                      {...label}
                      onChange={(e) => {
                        console.log(e.target);
                        item.isChecked = !item.isChecked;
                        forceUpdate();
                      }}
                      color="success"
                    />
                    <p style={{ paddingTop: 12 }}>{item.name}</p>
                  </div>
                  {item.isChecked && item.name === "Lainnya" && (
                    <div className="px-1" style={{ width: "90%" }}>
                      <Input
                        placeholder="lainnya"
                        // value={"lainnya"}
                        // onChange={(e) => setLainnya(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h6>Tindakan tidak aman penyebab kecelakaan</h6>
          <div>
            {unsafeReason.map((item, index) => {
              return (
                <div key={index}>
                  <div className="d-flex">
                    <Checkbox
                      {...label}
                      onChange={(e) => {
                        console.log(e.target);
                        item.isChecked = !item.isChecked;
                        forceUpdate();
                      }}
                      color="success"
                    />
                    <p style={{ paddingTop: 12 }}>{item.name}</p>
                  </div>
                  {item.isChecked && item.name === "Lainnya" && (
                    <div className="px-1" style={{ width: "90%" }}>
                      <Input
                        placeholder="lainnya"
                        // value={"lainnya"}
                        // onChange={(e) => setLainnya(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-2 d-flex">
        <div style={{ minWidth: "55%" }}>
          <div>
            <h6>Mengapa terdapat kondisi / perilaku tidak aman?</h6>
            <div>
              <Input
                style={{ minHeight: 100, width: "90%" }}
                type="textarea"
                name="text"
                id="exampleText"
                rows="3"
                placeholder="Textarea"
              />
            </div>
          </div>
          <div className="mt-1">
            <h6>Faktor Personal / Manusia</h6>
            <div>
              {personalFactor.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="d-flex">
                      <Checkbox
                        {...label}
                        onChange={(e) => {
                          item.isChecked = !item.isChecked;
                          forceUpdate();
                        }}
                        color="success"
                      />
                      <p style={{ paddingTop: 12 }}>{item.name}</p>
                    </div>
                    {item.isChecked && item.name === "Lainnya" && (
                      <div className="px-1" style={{ width: "90%" }}>
                        <Input
                          placeholder="lainnya"
                          // value={"lainnya"}
                          // onChange={(e) => setLainnya(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <h6>Faktor Pekerjaan / Lingkungan Kerja</h6>
          <div>
            {workFactor.map((item, index) => {
              return (
                <div key={index}>
                  <div className="d-flex">
                    <Checkbox
                      {...label}
                      onChange={(e) => {
                        item.isChecked = !item.isChecked;
                        forceUpdate();
                      }}
                      color="success"
                    />
                    <p style={{ paddingTop: 12 }}>{item.name}</p>
                  </div>
                  {item.isChecked && item.name === "Lainnya" && (
                    <div className="px-1">
                      <Input
                        placeholder="lainnya"
                        // value={"lainnya"}
                        // onChange={(e) => setLainnya(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2">
            <h6>Apakah pernah terjadi insiden serupa sebelum kejadian ini?</h6>
            <div
              className="d-flex justify-content-between px-1"
              style={{ width: "20%" }}
            >
              <CustomInput
                type="radio"
                id="insiden1"
                name="insiden"
                inline
                label="Ya"
              />
              <CustomInput
                type="radio"
                id="insiden2"
                name="insiden"
                inline
                label="Tidak"
              />
            </div>
          </div>
          <div className="mt-2">
            <h6>
              Rekomendasi tindakan koreksi dan pencegahan? Analisa Risiko?
            </h6>
            <div
              className="d-flex justify-content-between px-1"
              style={{ width: "20%" }}
            >
              <CustomInput
                type="radio"
                id="analisaRisiko1"
                name="analisaRisiko"
                inline
                label="Ya"
              />
              <CustomInput
                type="radio"
                id="analisaRisiko2"
                name="analisaRisiko"
                inline
                label="Tidak"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstAid;
