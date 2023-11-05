import React, { useState } from "react";
import { ExportIndicator, ListHeader, Pagination } from "components/shared";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { wrapper } from "redux/store";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Spinner,
  Table
} from "reactstrap";
import {
  Check,
  Save,
  Play,
  Edit,
  XSquare,
  ArrowLeft,
  Printer,
  Eye,
  Download,
  ExternalLink,
} from "react-feather";
import { Paper } from "@mui/material";
import ModalFilter from "components/inspection/ModalFilter";
import DetaiDataInventory from "components/inspection/DetailDataInventory";

const DetailInventory = ({}) => {
  const [pageNumber, setPageNumber] = useState("1");
  const [pageSize, setPageSize] = useState("1");
  const [searchQuery, setSearchQuery] = useState("1");
  const [active, setActive] = useState("1");
  const [values, setValues] = useState(null);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const pageSizeOptions = [5, 10, 25, 50];
  const toggle = (key) => setActive(key);

  const handlePageSize = () => {};
  const handleSearchQuery = () => {};

  const dummyData = {
    nomorPeralatan: "0001/TOA/DF",
    site: "PT Dankos Farma",
    type: "TOA",
    periodCheck: 12,
  };

  const router = useRouter();
  return (
    <div className="min-vh-100">
      <ModalFilter
        isOpen={visibleFilter}
        toggle={(bool) => setVisibleFilter(bool)}
      />
      <ListHeader
        breadCrumbParent="Inspection"
        breadCrumbParent2="Inventory"
        breadCrumbActive="Detail"
        pageTitle="Detail Inventory"
        {...{
          router,
          pageSize,
          searchQuery,
          pageSizeOptions,
          handlePageSize,
          handleSearchQuery,
          setSearchQuery,
        }}
      ></ListHeader>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
            className={`${active === "1" ? "text-dark" : "text-muted"}`}
          >
            Data
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2");
            }}
            className={`${active === "2" ? "text-dark" : "text-muted"}`}
          >
            Approval Log
          </NavLink>
        </NavItem>
      </Nav>
      <Paper elevation={6}>
        <div className="px-2 py-2 mb-2">
          <TabContent className="ml-1 py-50" activeTab={active}>
            <TabPane tabId="1">
              <div>
                <div className="d-flex justify-content-between w-100 flex-wrap">
                  <div
                    className="d-flex flex-wrap"
                    style={{ gap: 20, width: "70%" }}
                  >
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <Save />
                          <div className="ml-1">Save</div>
                        </div>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <Play />
                          <div className="ml-1">Submit</div>
                        </div>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <Check />
                          <div className="ml-1">Approve</div>
                        </div>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <Edit />
                          <div className="ml-1">Revise</div>
                        </div>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <XSquare />
                          <div className="ml-1">Reject</div>
                        </div>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <ArrowLeft />
                          <div className="ml-1">Back</div>
                        </div>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <Printer />
                          <div className="ml-1">Cetak QR</div>
                        </div>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <Eye />
                          <div className="ml-1">Show QR</div>
                        </div>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="primary"
                      disabled={submitLoading}
                      onClick={() => {
                        setValues({
                          status: 4,
                        });
                        setSubmitLoading(true);
                      }}
                    >
                      {submitLoading && values.status === 4 ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Approving...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <Download />
                          <div className="ml-1">Download QR</div>
                        </div>
                      )}
                    </Button.Ripple>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#FFB84C",
                      height: 40,
                      borderRadius: 10,
                      minWidth: 140,
                      textAlign: "center",
                      paddingTop: 10,
                    }}
                  >
                    Draft
                  </div>
                </div>
                <DetaiDataInventory dummyData={dummyData} />
              </div>
            </TabPane>
            <TabPane tabId="2">
              <div className="d-flex justify-content-between w-100 flex-wrap">
                <div
                  className="d-flex flex-wrap"
                  style={{ gap: 20, width: "70%" }}
                >
                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Save />
                        <div className="ml-1">Save</div>
                      </div>
                    )}
                  </Button.Ripple>
                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <ExternalLink />
                        <div className="ml-1">Submit</div>
                      </div>
                    )}
                  </Button.Ripple>
                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <ArrowLeft />
                        <div className="ml-1">Back</div>
                      </div>
                    )}
                  </Button.Ripple>
                </div>
                <div
                  style={{
                    backgroundColor: "#FFB84C",
                    height: 40,
                    borderRadius: 10,
                    minWidth: 140,
                    textAlign: "center",
                    paddingTop: 10,
                  }}
                >
                  Draft
                </div>
              </div>
              <div className="mt-4" style={{width: '100%'}} >
              
                <Table bordered responsive className="border">
                  <thead>
                    <tr>
                      <th className="w-5 text-left">No</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">User</th>
                      <th className="text-left">Message</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Lead Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {[{}].map((data) => (
                      <CreateTableRow
                        key={data?.id}
                        {...{ data, router, token: "a" }}
                      />
                    ))} */}
                  </tbody>
                </Table>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </Paper>
    </div>
  );
};

DetailInventory.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

//Render Data
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query } = ctx;
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    return {
      props: {
        // closeProjectData,
      },
    };
  }
);

export default DetailInventory;
