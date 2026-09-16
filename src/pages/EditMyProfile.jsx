import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

import {
  getMyProfile,
  updateMyProfile
} from "../services/ApiService";

import { toast } from "sonner";
import "../css/EditMyProfile.css";


function EditMyProfile() {

  const navigate = useNavigate();


  // =====================================================
  // PROFILE DATA
  // =====================================================

  const [employee, setEmployee] = useState({

    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
    educationLevel: ""

  });


  // =====================================================
  // VALIDATION ERRORS
  // =====================================================

  const [errors, setErrors] = useState({});


  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const response = await getMyProfile();

        const data = response.data;


        setEmployee({

          firstName: data.firstName || "",

          lastName: data.lastName || "",

          dateOfBirth: data.dateOfBirth || "",

          gender: data.gender || "",

          phoneNumber: data.phoneNumber || "",

          city: data.city || "",

          state: data.state || "",

          country: data.country || "",

          educationLevel: data.educationLevel || ""

        });

      }

      catch (error) {

        console.log(
          "Error loading profile:",
          error
        );

        toast.error(
          "Unable to load profile"
        );

      }

      finally {

        setLoading(false);

      }

    };


    loadProfile();

  }, []);


  // =====================================================
  // VALIDATE FIELD
  // =====================================================

  const validateField = (name, value) => {

    let error = "";


    switch (name) {


      // ==========================================
      // FIRST NAME
      // ==========================================

      case "firstName":

        if (!value.trim()) {

          error = "First name is required.";

        }

        else if (
          value.trim().length < 2
        ) {

          error =
            "Minimum 2 characters required.";

        }

        else if (
          !/^[A-Za-z]+$/.test(
            value.trim()
          )
        ) {

          error =
            "Only letters are allowed.";

        }

        break;


      // ==========================================
      // LAST NAME
      // ==========================================

      case "lastName":

        if (!value.trim()) {

          error = "Last name is required.";

        }

        else if (
          value.trim().length < 2
        ) {

          error =
            "Minimum 2 characters required.";

        }

        else if (
          !/^[A-Za-z]+$/.test(
            value.trim()
          )
        ) {

          error =
            "Only letters are allowed.";

        }

        break;


      // ==========================================
      // DATE OF BIRTH
      // ==========================================

      case "dateOfBirth":

        if (!value) {

          error =
            "Date of birth is required.";

        }

        else {

          const dob = new Date(value);
          const today = new Date();

          if (dob >= today) {

            error =
              "Date of birth must be a past date.";

          }

        }

        break;


      // ==========================================
      // GENDER
      // ==========================================

      case "gender":

        if (!value.trim()) {

          error =
            "Gender is required.";

        }

        break;


      // ==========================================
      // PHONE
      // ==========================================

      case "phoneNumber":

        if (!value.trim()) {

          error =
            "Phone number is required.";

        }

        else if (
          !/^\d{10}$/.test(value)
        ) {

          error =
            "Phone number must contain exactly 10 digits.";

        }

        break;


      // ==========================================
      // CITY
      // ==========================================

      case "city":

        if (!value.trim()) {

          error =
            "City is required.";

        }

        else if (
          value.trim().length < 2
        ) {

          error =
            "Minimum 2 characters required.";

        }

        break;


      // ==========================================
      // STATE
      // ==========================================

      case "state":

        if (!value.trim()) {

          error =
            "State is required.";

        }

        else if (
          value.trim().length < 2
        ) {

          error =
            "Minimum 2 characters required.";

        }

        break;


      // ==========================================
      // COUNTRY
      // ==========================================

      case "country":

        if (!value.trim()) {

          error =
            "Country is required.";

        }

        else if (
          value.trim().length < 2
        ) {

          error =
            "Minimum 2 characters required.";

        }

        break;


      // ==========================================
      // EDUCATION
      // ==========================================

      case "educationLevel":

        if (!value.trim()) {

          error =
            "Education level is required.";

        }

        else if (
          value.trim().length < 2
        ) {

          error =
            "Minimum 2 characters required.";

        }

        break;


      default:

        break;

    }


    return error;

  };


  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = (fieldName) => {

    if (errors[fieldName]) {

      return "input-error";

    }

    return "";

  };


  // =====================================================
  // HANDLE FIELD CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setEmployee(
      (previousEmployee) => ({

        ...previousEmployee,

        [name]: value

      })
    );


    const error =
      validateField(
        name,
        value
      );


    setErrors(
      (previousErrors) => ({

        ...previousErrors,

        [name]: error

      })
    );

  };


  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // ==========================================
    // VALIDATE ALL FIELDS
    // ==========================================

    const newErrors = {};


    Object.keys(employee).forEach(
      (fieldName) => {

        const error =
          validateField(
            fieldName,
            employee[fieldName]
          );


        if (error) {

          newErrors[fieldName] =
            error;

        }

      }
    );


    setErrors(newErrors);


    // ==========================================
    // STOP IF VALIDATION FAILS
    // ==========================================

    if (
      Object.keys(newErrors).length > 0
    ) {

      toast.error(
        "Please correct the errors before saving."
      );

      return;

    }


    try {

      // ==========================================
      // ONLY PROFILE INFORMATION
      // NO PASSWORD
      // ==========================================

      const profileData = {

        firstName:
          employee.firstName,

        lastName:
          employee.lastName,

        dateOfBirth:
          employee.dateOfBirth,

        gender:
          employee.gender,

        phoneNumber:
          employee.phoneNumber,

        city:
          employee.city,

        state:
          employee.state,

        country:
          employee.country,

        educationLevel:
          employee.educationLevel

      };


      await updateMyProfile(
        profileData
      );


      toast.success(
        "Profile updated successfully"
      );


      setTimeout(() => {

        navigate("/profile");

      }, 800);

    }

    catch (error) {

      console.log(
        "Update profile error:",
        error
      );


      toast.error(
        error?.response?.data?.message ||
        "Unable to update profile"
      );

    }

  };


  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {

    navigate("/profile");

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <Layout>

        <div className="edit-profile-loading">

          Loading profile...

        </div>

      </Layout>

    );

  }


  // =====================================================
  // JSX
  // =====================================================

  return (

    <Layout>

      <div className="edit-profile-page">

        <div className="edit-profile-card">


          {/* ==========================================
              TITLE
          ========================================== */}

          <h2>
            Edit My Profile
          </h2>


          <p className="profile-subtitle">
            Update your personal information
          </p>


          <form
            onSubmit={handleSubmit}
            noValidate
          >


            {/* ==========================================
                FIRST NAME + LAST NAME
            ========================================== */}

            <div className="form-row">


              {/* FIRST NAME */}

              <div className="form-group">

                <label>

                  First Name

                  <span className="required">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="firstName"
                  value={employee.firstName}
                  onChange={handleChange}
                  className={
                    inputClass("firstName")
                  }
                />


                {errors.firstName && (

                  <span className="error-text">

                    {errors.firstName}

                  </span>

                )}

              </div>


              {/* LAST NAME */}

              <div className="form-group">

                <label>

                  Last Name

                  <span className="required">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="lastName"
                  value={employee.lastName}
                  onChange={handleChange}
                  className={
                    inputClass("lastName")
                  }
                />


                {errors.lastName && (

                  <span className="error-text">

                    {errors.lastName}

                  </span>

                )}

              </div>

            </div>


            {/* ==========================================
                DATE OF BIRTH
            ========================================== */}

            <div className="form-group">

              <label>

                Date of Birth

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="date"
                name="dateOfBirth"
                value={employee.dateOfBirth}
                onChange={handleChange}
                className={
                  inputClass("dateOfBirth")
                }
              />


              {errors.dateOfBirth && (

                <span className="error-text">

                  {errors.dateOfBirth}

                </span>

              )}

            </div>


            {/* ==========================================
                GENDER
            ========================================== */}

            <div className="form-group">

              <label>

                Gender

                <span className="required">
                  *
                </span>

              </label>


              <select
                name="gender"
                value={employee.gender}
                onChange={handleChange}
                className={
                  inputClass("gender")
                }
              >

                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

              </select>


              {errors.gender && (

                <span className="error-text">

                  {errors.gender}

                </span>

              )}

            </div>


            {/* ==========================================
                PHONE
            ========================================== */}

            <div className="form-group">

              <label>

                Phone Number

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="text"
                name="phoneNumber"
                value={employee.phoneNumber}
                onChange={handleChange}
                className={
                  inputClass("phoneNumber")
                }
              />


              {errors.phoneNumber && (

                <span className="error-text">

                  {errors.phoneNumber}

                </span>

              )}

            </div>


            {/* ==========================================
                CITY + STATE
            ========================================== */}

            <div className="form-row">


              {/* CITY */}

              <div className="form-group">

                <label>

                  City

                  <span className="required">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="city"
                  value={employee.city}
                  onChange={handleChange}
                  className={
                    inputClass("city")
                  }
                />


                {errors.city && (

                  <span className="error-text">

                    {errors.city}

                  </span>

                )}

              </div>


              {/* STATE */}

              <div className="form-group">

                <label>

                  State

                  <span className="required">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="state"
                  value={employee.state}
                  onChange={handleChange}
                  className={
                    inputClass("state")
                  }
                />


                {errors.state && (

                  <span className="error-text">

                    {errors.state}

                  </span>

                )}

              </div>

            </div>


            {/* ==========================================
                COUNTRY
            ========================================== */}

            <div className="form-group">

              <label>

                Country

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="text"
                name="country"
                value={employee.country}
                onChange={handleChange}
                className={
                  inputClass("country")
                }
              />


              {errors.country && (

                <span className="error-text">

                  {errors.country}

                </span>

              )}

            </div>


            {/* ==========================================
                EDUCATION
            ========================================== */}

            <div className="form-group">

              <label>

                Education Level

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="text"
                name="educationLevel"
                value={
                  employee.educationLevel
                }
                onChange={handleChange}
                className={
                  inputClass(
                    "educationLevel"
                  )
                }
              />


              {errors.educationLevel && (

                <span className="error-text">

                  {
                    errors.educationLevel
                  }

                </span>

              )}

            </div>


            {/* ==========================================
                BUTTONS
            ========================================== */}

            <div className="button-row">

              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >

                Cancel

              </button>


              <button
                type="submit"
                className="save-btn"
              >

                Save Changes

              </button>

            </div>


          </form>

        </div>

      </div>

    </Layout>

  );

}


export default EditMyProfile;