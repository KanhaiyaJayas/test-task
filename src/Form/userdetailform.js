import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import "./form.css";
import Data from "./Nationality.json";
const Religion = ["Hinduism", "Islam", "Sikhism", "Jainism", "Christianity"];
const MaritalStatus = ["Single", "Married", "Widowed", "Separated", "Divorced"];
const BloodGroup = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
export default function PersonalDetail() {
  const schema = yup.object({
    name: yup.string().required(),
    govId: yup.string().required(),
    govtIdValue: yup.string().when("govId", {
      is: "Aadhar",
      then: () =>
        yup
          .string()
          .matches(
            /^\d{12}$/,
            "Govt Id should be a valid 12-digit numeric string"
          ),
      otherwise: () =>
        yup
          .string()
          .matches(
            /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/,
            "Govt Id should be a valid 10-digit alpha-numeric string"
          ),
    }),
    age: yup.mixed().test("age-validation", "Invalid age", (value) => {
      const isDate = yup.date().isValidSync(value);
      if (isDate) {
        const ageDiff = Date.now() - new Date(value).getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age >= 0 && age <= 120;
      } else {
        const isPositiveInteger = yup
          .number()
          .positive()
          .integer()
          .isValidSync(value);
        return isPositiveInteger;
      }
    }),
    sex: yup.string().required(),
    mobileNumber: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "Mobile number is not valid"),
    guardianName: yup.string(),
    guardianEmail: yup.string().email("Invalid Email"),
    emergencyNumber: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "Emergency Mobile number is not valid"),
  });
  const {
    register,
    formState,
    getValues,
    reset,
    handleSubmit,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getCountry = async () => {
      try {
        const res = await axios.get(
          "https://api.countrystatecity.in/v1/countries",
          {
            headers: {
              "X-CSCAPI-KEY":
                "TmE5eGhWSzQ0anZSeFVMNmlEd2ZSbzBwUGFxclA4S05hUVNtT1A4SA==",
            },
            redirect: "follow",
          }
        );
        setCountry(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCountry();
  }, []);
  const getState = async (key) => {
    try {
      const res = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${key}/states`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "TmE5eGhWSzQ0anZSeFVMNmlEd2ZSbzBwUGFxclA4S05hUVNtT1A4SA==",
          },
          redirect: "follow",
        }
      );
      localStorage.setItem("CountryKey", key);
      setStates(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCity = async (countryKey, stateKey) => {
    let StateKey = states?.find((data) => data?.name === stateKey);
    try {
      let res = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryKey}/states/${StateKey?.iso2}/cities`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "TmE5eGhWSzQ0anZSeFVMNmlEd2ZSbzBwUGFxclA4S05hUVNtT1A4SA==",
          },
          redirect: "follow",
        }
      );
      setCity(res?.data);
    } catch (error) {
     
    }
  };
  const options = country?.map((data) =>
    Object.assign(
      {},
      {
        value: data?.name,
        label: data?.name,
        iso2: data?.iso2,
        name: data?.name,
      }
    )
  );
  const NationalityOptions = Data?.map((data) =>
    Object.assign({}, { value: data?.nationality, label: data?.nationality })
  );

  const submitForm = async (data) => {
    try {
      let req = {
        name: data?.name,
        age: data?.age,
        sex: data?.sex,
        mobileNumber: data?.mobileNumber,
        guardianName: data?.guardianName,
        guardianEmail: data?.guardianEmail,
        emergencyNumber: data?.emergencyNumber,
        address: data?.address,
        country: data?.country,
        state: data?.state,
        city: data?.city,
        pincode: data?.pinCode,
        govId: data?.govId,
        govtIdValue: data?.govtIdValue,
        nationality: data?.nationality,
        religion: data?.religion,
        occupation: data?.occupation,
        bloodGroup: data?.bloodGroup,
        nationality: data?.nationality,
        martailStatus: data?.maritalStatus,
      };
      let res = await axios.post("http://localhost:8000/post", req);
      if (res) {
        reset();
      }
      navigate("/table");
    } catch (error) {
      console.log(error);
    }
  };
  const stateRegister = register("state");
  const { errors } = formState;
  console.log(errors);
  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit(submitForm)}>
          <h1 className="title">Personal Details</h1>
          <div className="detail-input-box">
            <div className="detail-input-box left-box top-row">
              <label htmlFor="userName">
                Name<span className="required">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Enter Name"
                  id="userName"
                  name="userName"
                  {...register("name")}
                  style={{ width: "100%" }}
                />
                <span className="error">{errors?.name?.message}</span>
              </div>
            </div>
            <div className="detail-input-box right-box right-flex-grow">
              <label htmlFor="dob">
                Date of Birth or Age<span className="required">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="MM/DD/YYYY or Age in Years"
                  id="dob"
                  {...register("age")}
                  style={{ width: "100%" }}
                />
                <span className="error">{errors?.age?.message}</span>
              </div>

              <label>
                Sex<span className="required">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select
                  {...register("sex")}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  <option disabled selected value="">
                    Enter Sex
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <span className="error">{errors?.sex?.message}</span>
              </div>
            </div>
          </div>
          <div className="detail-input-box bottom-row">
            <div className="detail-input-box left-box">
              <label>Mobile</label>
              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  placeholder="Enter Mobile"
                  {...register("mobileNumber")}
                  style={{ width: "100%" }}
                />
                <span className="error">{errors?.mobileNumber?.message}</span>
              </div>
            </div>
            <div className="detail-input-box right-box">
              <label>Govt Issued ID</label>
              <select {...register("govId")}>
                <option disabled selected value="">
                  ID Type
                </option>
                <option value="Aadhar">Aadhar</option>
                <option value="PAN">PAN</option>
              </select>
              <div style={{position : "relative"}}>
                <input
                  type="text"
                  placeholder="Enter Govt ID"
                  {...register("govtIdValue")}
                  style={{width: "100%"}}
                />
                <span className="error">{errors?.govtIdValue?.message}</span>
              </div>
            </div>
          </div>
          <h1 className="title" style={{ marginTop: "2%", marginBottom: "2%" }}>
            Contact Details
          </h1>
          <div className="detail-input-box">
            <div className="detail-input-box left-box contact-details-left">
              <label>Guardian Details</label>
              <select {...register("guardian")}>
                <option disabled selected value="">
                  Enter Label
                </option>
                <option value="Aadhar">Father</option>
                <option value="PAN">Mother</option>
              </select>
              <input
                type="text"
                placeholder="Enter Guardian Name"
                {...register("guardianName")}
              />
            </div>
            <div className="detail-input-box right-box contact-details-right">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                {...register("guardianEmail")}
              />
              <label>Emergency Contact Number</label>
              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  placeholder="Enter Emergency No"
                  {...register("emergencyNumber")}
                  style={{ width: "100%" }}
                />
                <span className="error">{errors?.mobileNumber?.message}</span>
              </div>
            </div>
          </div>
          <h1 className="title" style={{ marginTop: "2%", marginBottom: "2%" }}>
            Address Details
          </h1>
          <div className="detail-input-box ">
            <div className="detail-input-box left-box address-details-left">
              <label>Address</label>
              <input
                type="text"
                placeholder="Enter Address"
                {...register("address")}
              />
            </div>
            <div className="detail-input-box right-box address-details-right">
              <label>State</label>
              <select
                {...stateRegister}
                onChange={(e) => {
                  stateRegister.onChange(e);
                  getCity(localStorage.getItem("CountryKey"), e.target.value);
                }}
              >
                <option disabled selected value="">
                  Enter State
                </option>
                {states?.map((data) => (
                  <option value={data?.name}>{data?.name}</option>
                ))}
              </select>
              <label>City</label>
              <select {...register("city")}>
                <option disabled selected value="">
                  Enter City
                </option>
                {city?.map((data) => (
                  <option value={data?.name}>{data?.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* {{...countryRegister}} */}
          <div className="detail-input-box Address-bottom-box">
            <div className="detail-input-box left-box address-details-left">
              <label>Country</label>
              <Controller
                name="country"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    options={options}
                    value={country?.find((data) => data.value === value)}
                    onChange={(val) => {
                      onChange(val.value);
                      getState(val.iso2);
                    }}
                  />
                )}
              />
            </div>
            <div className="detail-input-box right-box address-details-right">
              <label>Pincode</label>
              <input
                type="text"
                placeholder="Enter Pincode"
                {...register("pinCode")}
              />
            </div>
          </div>
          <h1 className="title" style={{ marginTop: "2%", marginBottom: "2%" }}>
            Other Details
          </h1>
          <div className="detail-input-box Other-Detail">
            <label style={{ marginLeft: "1%" }}>Occupation</label>
            <input type="text" placeholder="Enter Occupation" />
            <label>Religion</label>
            <select {...register("religion")}>
              <option disabled selected>
                Enter Religion
              </option>
              {Religion.map((data) => {
                return <option value={data}>{data}</option>;
              })}
            </select>
            <label>Marital Status</label>
            <select {...register("maritalStatus")}>
              <option disabled selected value="">
                Enter Marital Status
              </option>
              {MaritalStatus.map((data) => {
                return <option value={data}>{data}</option>;
              })}
            </select>
            <label>Blood Group</label>
            <select {...register("bloodGroup")}>
              <option disabled selected>
                Group
              </option>
              {BloodGroup.map((data) => {
                return <option value={data}>{data}</option>;
              })}
            </select>
          </div>
          <div
            className="detail-input-box Other-Detail"
            style={{ margin: "2% 0" }}
          >
            <label style={{ marginLeft: "1%" }}>Nationality</label>
            <Controller
              name="nationality"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  options={NationalityOptions}
                  value={NationalityOptions?.find(
                    (data) => data.value === value
                  )}
                  onChange={(val) => {
                    onChange(val.value);
                  }}
                />
              )}
            />
          </div>
          <div className="form-btn">
            <input type="reset" value="Cancel" onClick={() => reset()} />
            <input type="submit" />
          </div>
        </form>
      </div>
    </>
  );
}
