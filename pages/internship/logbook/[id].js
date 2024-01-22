import { HTTP_CODE, SYSTEM_ADMIN, SUPER_USER } from "constant";

import BreadCrumbs from "components/custom/BreadcrumbCustom";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Edit, ExternalLink, Download } from "react-feather";
import { Button, Card, Col, CustomInput, Label, Row, Table } from "reactstrap";
import { connect, useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import { wrapper } from "redux/store";

import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
  deleteAlertNotification,
  reviseWithValidation,
} from "components/notification";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { InternDetailCard } from "components/Card/InternDetailCard";
import { CustomBadge } from "components/Badge/CustomBadge";

import { getMasterInternById } from "redux/actions/master/intern";
import {
  GenerateLogbookPDF,
  approveLogbook,
  getLogbookData,
} from "redux/actions/logbook";
import { getPermissionComponentByRoles } from "helpers/getPermission";

import moment from "moment";
import { reviseLogbook } from "redux/actions/logbook";

const LogbookRow = ({
  jsDate,
  index,
  dataLogbook,
  internData,
  logbookDays,
  holidayDates,
}) => {
  const [editPopup, setEditPopup] = useState(false);
  const toggleEditPopup = () => setEditPopup(!editPopup);

  const currentDate = new Date();
  const isWeekend = moment(jsDate).day() == 6 || moment(jsDate).day() == 0;
  var holidayIndex = holidayDates
    .map((date) => {
      return date.holiday_date;
    })
    .indexOf(jsDate.format("YYYY-MM-D"));
  const isHoliday = holidayIndex > -1;
  const holidayName = holidayDates[holidayIndex]?.holiday_name ?? "";
  const blockEntry = isWeekend || isHoliday ? true : false;
  const currEntry = logbookDays[index];
  const ogIdx = currEntry.originalIndex ?? "";

  return (
    <tr key={jsDate}>
      <td>{index + 1}.</td>
      <td style={{ color: blockEntry && "#CAC7D1" }}>
        {jsDate.format("ddd, DD MMM YYYY")}
      </td>
      <td
        className="text-left"
        style={{ width: "40%", color: blockEntry && "#CAC7D1" }}
      >
        {isHoliday
          ? holidayName
          : isWeekend
          ? "OFF"
          : `${currEntry?.activity ?? "-"}`}
      </td>
      <td style={{ width: "2%" }}>
        {blockEntry ? "" : `${currEntry?.workType ?? "-"}`}
      </td>
      <td
        style={{
          width: "15%",
          color: dataLogbook?.status.includes("Approved")
            ? "#46A583"
            : "#FF5B5C",
        }}
      >
        {blockEntry || !currEntry?.activity
          ? ""
          : dataLogbook?.status.includes("Approved")
          ? "Approved"
          : dataLogbook?.status.includes("revision")
          ? `Waiting for Revision`
          : `Waiting for Approval`}
      </td>
      <td>{""}</td>
    </tr>
  );
};

const InternshipAttendance = (props) => {
  const { token, sessionData, query, internData, dataLogbook, holidayDates } =
    props;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, [dispatch]);

  const currentDate = new Date();
  // const startDate = moment("2023-02-20T12:00:00Z");
  // const endDate = moment("2024-02-16T12:00:00Z");
  const startDate = moment(internData.startDate);
  const endDate = moment(internData.endDate);

  console.log(internData);

  // Set Period Function
  const setPeriod = (start, end) => {
    const period = [];
    for (
      var m = moment(start);
      m.diff(end, "months") <= 0;
      m.add(1, "months")
    ) {
      period.push(m.format("YYYY-MM-DD"));
    }
    return period;
  };

  const [internshipPeriod, setInternshipPeriod] = useState(
    setPeriod(startDate, endDate)
  );
  const [monthQuery, setMonthQuery] = useState(
    query.month ??
      (moment(currentDate) >= startDate && moment(currentDate) <= endDate
        ? moment(currentDate).format("MMMM YYYY")
        : moment(startDate).format("MMMM YYYY"))
  );

  // Handle Chosen Month Days
  const setDays = (month) => {
    var daysInMonth = moment(month, "MMMM YYYY").daysInMonth();
    var arrDays = [];

    while (daysInMonth) {
      var current = moment(`${month} ${daysInMonth}`, "MMMM YYYY DD");
      // if (!(moment(current).day() == 6 || moment(current).day() == 0)) {
      arrDays.unshift(current);
      // }
      daysInMonth--;
    }
    return arrDays;
  };

  const [monthDays, setMonthDays] = useState(setDays(monthQuery));
  const [daysInMonth, setDaysInMonth] = useState(
    moment(monthQuery, "MMMM YYYY").daysInMonth()
  );

  const initLogbookDays = () => {
    let count = daysInMonth;
    let arr = [];
    while (count) {
      arr.unshift({});
      count--;
    }
    return arr;
  };

  const [logbookDays, setLogbookDays] = useState(initLogbookDays()); //array with 31 empty objects

  const fillLogbookDays = () => {
    if (dataLogbook) {
      let index = 0;
      let temp = initLogbookDays();
      let logbookDaysLength = dataLogbook.data[0]?.logbookDays.length;
      for (var i = 0; i < logbookDaysLength; i++) {
        index =
          moment(dataLogbook.data[0]?.logbookDays[i].date).format("D") - 1;
        temp[index] = {
          ...dataLogbook.data[0]?.logbookDays[i],
          originalIndex: i,
        };
      }
      setLogbookDays(temp);
    }
  };

  useEffect(() => {
    fillLogbookDays();
  }, []);

  const handleMonthChange = (value) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...query,
        month: value,
      },
    });
  };

  const onReviseHandler = async (note) => {
    let role = "";
    const upn = sessionData?.user?.UserPrincipalName;
    const name = sessionData?.user?.Name;
    const email = sessionData?.user?.Email;
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
    } catch (e) {
      console.error(e);
      role = "";
    }

    const id = dataLogbook.data[0]?.id;

    dispatch(reviseLogbook(role, upn, name, email, id, note))
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          successAlertNotification(
            "Success",
            "Revision request sent successfully"
          );
          router.push({
            pathname: router.pathname,
            query: {
              ...query,
              id: query.id,
              month: query.month,
            },
          });
        } else {
          const { title, message } = formatAxiosErrorMessage(
            res,
            "Something went wrong, please try again later."
          );
          errorAlertNotification(title, message);
        }
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onApproveHandler = async () => {
    let role = "";
    const upn = sessionData?.user?.UserPrincipalName;
    const name = sessionData?.user?.Name;
    const email = sessionData?.user?.Email;
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
    } catch (e) {
      console.error(e);
      role = "";
    }

    const id = dataLogbook.data[0]?.id;

    dispatch(approveLogbook(role, upn, name, email, id))
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          successAlertNotification("Success", "Logbook approved succesfully");
          router.push({
            pathname: router.pathname,
            query: {
              ...query,
              id: query.id,
              month: query.month,
            },
          });
        } else {
          const { title, message } = formatAxiosErrorMessage(
            res,
            "Something went wrong, please try again later."
          );
          errorAlertNotification(title, message);
        }
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDownload = async (dataLogbook) => {
    const name = internData.name;
    const month = monthQuery;
    await dispatch(GenerateLogbookPDF(name, month, dataLogbook));
  };

  return (
    <div>
      <BreadCrumbs
        breadCrumbParent="Internship"
        breadCrumbParent2="Logbook"
        breadCrumbActive="Daniel Emerald"
      />
      <div className="d-flex align-items-center my-3">
        <Button.Ripple
          outline
          color="danger"
          className="btn-next"
          onClick={() => router.push("/internship")}
        >
          <ArrowLeft size={18} />
          <span className="ml-50 align-middle d-sm-inline-block d-none">
            Back
          </span>
        </Button.Ripple>

        <h2 className={`ml-2 pl-2 border-left-dark`}>Intern Logbook</h2>
      </div>

      <Card className="p-2 d-flex">
        <div className="flex-col align-items-center ">
          <div className="">
            <InternDetailCard
              nama={`${internData.name}`}
              department={`${internData.dept}`}
              school={`${internData.schoolName}`}
              faculty={`${internData.faculty}`}
              month={`${monthQuery}`}
              status={`${dataLogbook.data[0]?.status ?? "Waiting for entry"}`}
              workingDays="14 WFH / 8 WFO"
              pay="Rp 1.920.000"
            />
          </div>
        </div>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
        <div className="d-flex align-items-center mr-2">
          <Label for="rows-per-page" className="font-weight-bold">
            Month
          </Label>
          <CustomInput
            className="form-control ml-1 pr-5"
            type="select"
            id="rows-per-page"
            value={monthQuery}
            onChange={(e) => handleMonthChange(e.target.value)}
          >
            {internshipPeriod.map((month, index, obj) => (
              <option key={month} value={moment(month).format("MMMM YYYY")}>
                {index === 0 || moment(month).format(`MMMM`) === "January"
                  ? moment(month).format(`MMMM YYYY`)
                  : moment(month).format(`MMMM`)}
              </option>
            ))}
          </CustomInput>
        </div>

        <div className="d-flex align-items-center">
          <Button.Ripple
            id="saveBtn"
            color="warning"
            onClick={() => {
              handleDownload(dataLogbook.data[0]);
            }}
          >
            <Download size={18} />
            <span className="align-middle ml-1 d-sm-inline-block d-none">
              Export to PDF
            </span>
          </Button.Ripple>

          {getPermissionComponentByRoles(["MENTOR"]) && (
            <>
              {(dataLogbook.data[0]?.status.includes("Approved") ||
                dataLogbook.data[0]?.status.includes("approval")) && (
                <Button.Ripple
                  id="reviseBtn"
                  color="warning"
                  className="ml-1"
                  onClick={() => {
                    confirmAlertNotification(
                      "Confirmation",
                      `Are you sure to request a revision?`,
                      () => {
                        reviseWithValidation(
                          "Revise",
                          "Revise",
                          onReviseHandler
                        );
                      },
                      () => {}
                    );
                  }}
                >
                  <Edit size={18} />
                  <span className="align-middle ml-1 d-sm-inline-block d-none">
                    Revise
                  </span>
                </Button.Ripple>
              )}
              {dataLogbook.data[0]?.status.includes("approval") && (
                <Button.Ripple
                  id="approveBtn"
                  className="ml-1"
                  color="primary"
                  onClick={() => {
                    confirmAlertNotification(
                      "Confirmation",
                      `Are you sure to approve this logbook?`,
                      () => onApproveHandler(),
                      () => {}
                    );
                  }}
                >
                  <Check size={18} />
                  <span className="align-middle ml-1 d-sm-inline-block d-none">
                    Approve All
                  </span>
                </Button.Ripple>
              )}
            </>
          )}
        </div>
      </div>
      <Table responsive className="border">
        <thead className="text-center">
          <tr>
            <th>No.</th>
            <th>Date</th>
            <th>Activity</th>
            <th>WFH/WFO</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center text-break">
          {monthDays &&
            monthDays.map((date, index) => (
              <LogbookRow
                jsDate={date}
                index={index}
                dataLogbook={dataLogbook.data[0]}
                logbookDays={logbookDays}
                holidayDates={holidayDates}
              />
            ))}
        </tbody>
      </Table>
      <Row className="mt-1 mb-3">
        <Col
          className="d-flex align-items-center justify-content-start"
          md="9"
          sm="12"
        ></Col>
        <Col
          className="d-flex align-items-center justify-content-end"
          md="3"
          sm="12"
        ></Col>
      </Row>
    </div>
  );
};

InternshipAttendance.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query } = ctx;
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    const token = sessionData.user.token;

    store.dispatch(reauthenticate(token));

    const response = await store.dispatch(getMasterInternById(query.id));
    const internData = response.data;

    if (response.status !== 200) {
      return {
        redirect: {
          destination: "/internship",
          permanent: false,
        },
      };
    }

    const currentDate = new Date();
    const startDate = moment(internData.startDate);
    const endDate = moment(internData.endDate);

    const monthFilter = query.month
      ? query.month?.split(" ")[0]
      : moment(currentDate) >= startDate && moment(currentDate) <= endDate
      ? moment(currentDate).format("MMMM")
      : moment(startDate).format("MMMM");

    const yearFilter = query.month
      ? query.month?.split(" ")[1]
      : moment(currentDate) >= startDate && moment(currentDate) <= endDate
      ? moment(currentDate).format("YYYY")
      : moment(startDate).format("YYYY");

    await store.dispatch(
      getLogbookData({
        "CSTM-UPN": internData.userPrincipalName,
        "X-PAGINATION": true,
        "X-FILTER": `upn=${internData.userPrincipalName}|month=${monthFilter}|year=${yearFilter}`,
      })
    );

    const dataLogbook = store.getState().logbookReducers;

    const currentMonth = query.month
      ? moment().month(query.month?.split(" ")[0]).format("M")
      : moment(currentDate) >= startDate && moment(currentDate) <= endDate
      ? moment(currentDate).format("M")
      : moment(startDate).format("M");
    const currentYear = query.month
      ? query.month?.split(" ")[1]
      : moment(currentDate) >= startDate && moment(currentDate) <= endDate
      ? moment(currentDate).format("YYYY")
      : moment(startDate).format("YYYY");

    const res = await fetch(
      `https://api-harilibur.vercel.app/api?month=${currentMonth}&year=${currentYear}`
    );
    const holidayDates = await res.json().then((data) => {
      return data.filter((date) => {
        return date.is_national_holiday;
      });
    });

    return {
      props: {
        token,
        sessionData,
        query,
        internData: internData,
        dataLogbook: dataLogbook,
        holidayDates,
      },
    };
  }
);

export default connect((state) => state)(InternshipAttendance);
