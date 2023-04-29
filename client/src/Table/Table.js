import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "jquery";
import "datatables.net";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jszip";
import "pdfmake";
import "./table.css";
function DataTables() {
  $.DataTable = require("datatables.net");
  const tableRef = useRef();
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    if (tableData.length === 0) {
      const getTableData = async () => {
        try {
          let res = await axios.get("http://localhost:8000/");
          const calcAge = (value) => {
            var dob = new Date(value);
            var month_diff = Date.now() - dob.getTime();
            var age_dt = new Date(month_diff);
            var year = age_dt.getUTCFullYear();
            var age = Math.abs(year - 1970);
            console.log(age);
            return String(age);
          };

          let Data = res?.data?.result?.map((data) => {
            return [
              data.name,
              `${data.age.length > 3 ? calcAge(data.age) : data.age}`,
              data.mobileNumber,
              `${data.address + data.city + data.country + data.pincode}`,
              `${data.guardianName ? data.guardianName : ""}`,
              `${data.guardianEmail ? data.guardianEmail : ""}`,
              `${data.emergencyNumber ? data.emergencyNumber : ""}`,
              `${data.nationality ? data.nationality : ""}`,
            ];
          });

          setTableData(Data);
        } catch (error) {
          console.log(error);
        }
      };
      getTableData();
    }
    const table = $(tableRef.current).DataTable({
      data: tableData,
      paging: true,
      pageLength: 20,
      lengthChange: true,
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "Tous"],
      ],
      dom: 'B<"clear">lfrtip',
      buttons: ["excel", "print"],
      columns: [
        { title: "Name" },
        { title: "Age" },
        { title: "Mob" },
        { title: "Address" },
        { title: "Guardian Name" },
        { title: "Guardian Email" },
        { title: "Guardian Number" },
        { title: "Nationality" },
      ],

      destroy: true,
    });

    return function () {
      table.destroy();
    };
  }, [tableData]);

  return (
    <>
      {tableData?.length > 0 && (
        <div>
          <table
            className="display"
            id="example"
            width="100%"
            ref={tableRef}
          ></table>
        </div>
      )}
    </>
  );
}

export default DataTables;
