import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getEmployee,
  updateEmployee
} from "../services/ApiService";
import "../css/EditEmployee.css";
import { toast } from "sonner";

function EditEmployee() {

  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // EMPLOYEE STATE
  // ==========================================

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    hireDate: "",
    department: "",
    role: "",
    jobTitle: "",
    salary: "",
    email: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
    educationLevel: "",
    yearsOfExperience: "",
    rating: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  // ==========================================
  // LOAD EMPLOYEE / ADMIN
  // ==========================================

  useEffect(() => {

    const loadEmployee = async () => {

      try {

        const response = await getEmployee(id);

        setEmployee({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          dateOfBirth: response.data.dateOfBirth || "",
          gender: response.data.gender || "",
          hireDate: response.data.hireDate || "",
          department: response.data.department || "",
          role: response.data.role || "",
          jobTitle: response.data.jobTitle || "",
          salary: response.data.salary || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          city: response.data.city || "",
          state: response.data.state || "",
          country: response.data.country || "",
          educationLevel: response.data.educationLevel || "",
          yearsOfExperience:
            response.data.yearsOfExperience || "",
          rating: response.data.rating || ""
        });

      } catch (error) {

        console.error(
          "GET EMPLOYEE ERROR:",
          error
        );

        toast.error(
          "Unable to load employee"
        );
      }
    };

    loadEmployee();

  }, [id]);


  // ==========================================
  // VALIDATION
  // ==========================================

  const validateField = (
    name,
    value,
    currentData = employee
  ) => {

    let message = "";

    // ------------------------------------------
    // TEXT FIELDS
    // ------------------------------------------

    const textFields = [
      "firstName",
      "lastName",
      "jobTitle",
      "city",
      "state",
      "country",
      "educationLevel"
    ];

    if (textFields.includes(name)) {

      if (!value.trim()) {

        message = "This field is required.";

      } else if (value.trim().length < 2) {

        message =
          "Minimum 2 characters required.";

      } else if (
        ["firstName", "lastName"].includes(name) &&
        !/^[A-Za-z ]+$/.test(value.trim())
      ) {

        message = "Letters only.";
      }
    }


    // ------------------------------------------
    // DATE OF BIRTH
    // ------------------------------------------

    if (name === "dateOfBirth") {

      if (!value) {

        message =
          "Date of birth is required.";

      } else {

        const today = new Date();
        const dob = new Date(value);

        if (dob >= today) {

          message =
            "Must be a valid past date.";
        }
      }
    }


    // ------------------------------------------
    // GENDER
    // ------------------------------------------

    if (name === "gender") {

      if (!value) {

        message =
          "Please select Male or Female.";
      }
    }


    // ------------------------------------------
    // HIRE DATE
    // ------------------------------------------

    if (name === "hireDate") {

      if (!value) {

        message =
          "Hire date is required.";

      } else if (
        currentData.dateOfBirth &&
        new Date(value) <=
          new Date(currentData.dateOfBirth)
      ) {

        message =
          "Must be after Date of Birth.";
      }
    }


    // ------------------------------------------
    // DEPARTMENT
    // ------------------------------------------

    if (name === "department") {

      if (!value) {

        message =
          "Please select a department.";
      }
    }


    // ------------------------------------------
    // ROLE
    // ------------------------------------------

    if (name === "role") {

      if (!value) {

        message =
          "Please select Employee or Admin.";
      }
    }


    // ------------------------------------------
    // SALARY
    // ------------------------------------------

    if (name === "salary") {

      if (value === "") {

        message =
          "Salary is required.";

      } else if (Number(value) <= 0) {

        message =
          "Must be greater than 0.";
      }
    }


    // ------------------------------------------
    // EMAIL
    // ------------------------------------------

    if (name === "email") {

      if (!value.trim()) {

        message =
          "Email is required.";

      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {

        message =
          "Enter a valid email address.";
      }
    }


    // ------------------------------------------
    // PHONE
    // ------------------------------------------

    if (name === "phoneNumber") {

      if (!value.trim()) {

        message =
          "Phone number is required.";

      } else if (!/^\d{10}$/.test(value)) {

        message =
          "Exactly 10 digits.";
      }
    }


    // ------------------------------------------
    // EXPERIENCE
    // ------------------------------------------

    if (name === "yearsOfExperience") {

      if (value === "") {

        message =
          "Years of experience is required.";

      } else if (Number(value) < 0) {

        message =
          "Cannot be negative.";
      }
    }


    // ------------------------------------------
    // RATING
    // ------------------------------------------

    if (name === "rating") {

      if (value === "") {

        message =
          "Rating is required.";

      } else if (
        Number(value) < 0 ||
        Number(value) > 5
      ) {

        message =
          "Rating must be between 0 and 5.";
      }
    }


    return message;
  };


  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    const updatedEmployee = {
      ...employee,
      [name]: value
    };

    setEmployee(updatedEmployee);

    if (touched[name]) {

      const message =
        validateField(
          name,
          value,
          updatedEmployee
        );

      setErrors({
        ...errors,
        [name]: message
      });
    }
  };


  // ==========================================
  // HANDLE BLUR
  // ==========================================

  const handleBlur = (e) => {

    const { name, value } = e.target;

    setTouched({
      ...touched,
      [name]: true
    });

    const message =
      validateField(
        name,
        value,
        employee
      );

    setErrors({
      ...errors,
      [name]: message
    });
  };


  // ==========================================
  // VALIDATE ALL
  // ==========================================

  const validateAll = () => {

    const newErrors = {};

    Object.keys(employee).forEach((field) => {

      const message =
        validateField(
          field,
          employee[field],
          employee
        );

      if (message) {

        newErrors[field] = message;
      }
    });

    setErrors(newErrors);

    const allTouched = {};

    Object.keys(employee).forEach((field) => {

      allTouched[field] = true;
    });

    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateAll()) {

      return;
    }

    try {

      const employeeData = {
        ...employee,

        salary: Number(
          employee.salary
        ),

        yearsOfExperience:
          Number(
            employee.yearsOfExperience
          ),

        rating: Number(
          employee.rating
        )
      };

      await updateEmployee(
        id,
        employeeData
      );

      toast.success(
        "Employee Updated Successfully"
      );

      setTimeout(() => {

        navigate("/employees");

      }, 500);

    } catch (error) {

      console.error(
        "UPDATE EMPLOYEE ERROR:",
        error
      );

      if (
        error.response?.status === 400
      ) {

        toast.error(
          "Please check the entered details."
        );

      } else if (
        error.response?.status === 403
      ) {

        toast.error(
          "You are not allowed to update this employee."
        );

      } else {

        toast.error(
          "Unable To Update Employee"
        );
      }
    }
  };


  // ==========================================
  // ERROR CLASS
  // ==========================================

  const errorClass = (field) =>
    touched[field] && errors[field]
      ? "input-error"
      : "";


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <Layout>

      <div className="edit-page">

        <div className="edit-card">

          <div className="title">

            <h1>
              Edit Employee
            </h1>

            <p>
              Update employee or administrator information
            </p>

          </div>


          <form
            className="edit-form"
            onSubmit={handleSubmit}
          >

            {/* ==========================================
                FIRST NAME
            ========================================== */}

            <div className="form-group">

              <label>
                First Name
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="firstName"
                value={employee.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("firstName")}
              />

              {touched.firstName &&
                errors.firstName && (

                  <small className="error-text">
                    {errors.firstName}
                  </small>

              )}

            </div>


            {/* ==========================================
                LAST NAME
            ========================================== */}

            <div className="form-group">

              <label>
                Last Name
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="lastName"
                value={employee.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("lastName")}
              />

              {touched.lastName &&
                errors.lastName && (

                  <small className="error-text">
                    {errors.lastName}
                  </small>

              )}

            </div>


            {/* ==========================================
                DATE OF BIRTH
            ========================================== */}

            <div className="form-group">

              <label>
                Date of Birth
                <span className="required">*</span>
              </label>

              <input
                type="date"
                name="dateOfBirth"
                value={employee.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("dateOfBirth")}
              />

              {touched.dateOfBirth &&
                errors.dateOfBirth && (

                  <small className="error-text">
                    {errors.dateOfBirth}
                  </small>

              )}

            </div>


            {/* ==========================================
                GENDER
            ========================================== */}

            <div className="form-group">

              <label>
                Gender
                <span className="required">*</span>
              </label>

              <select
                name="gender"
                value={employee.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("gender")}
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

              {touched.gender &&
                errors.gender && (

                  <small className="error-text">
                    {errors.gender}
                  </small>

              )}

            </div>


            {/* ==========================================
                HIRE DATE
            ========================================== */}

            <div className="form-group">

              <label>
                Hire Date
                <span className="required">*</span>
              </label>

              <input
                type="date"
                name="hireDate"
                value={employee.hireDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("hireDate")}
              />

              {touched.hireDate &&
                errors.hireDate && (

                  <small className="error-text">
                    {errors.hireDate}
                  </small>

              )}

            </div>


            {/* ==========================================
                DEPARTMENT
            ========================================== */}

            <div className="form-group">

              <label>
                Department
                <span className="required">*</span>
              </label>

              <select
                name="department"
                value={employee.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("department")}
              >

                <option value="">
                  Select Department
                </option>

                <option value="Software Development">
                  Software Development
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Finance">
                  Finance
                </option>

                <option value="Marketing">
                  Marketing
                </option>

                <option value="Sales">
                  Sales
                </option>

                <option value="Operations">
                  Operations
                </option>

              </select>

              {touched.department &&
                errors.department && (

                  <small className="error-text">
                    {errors.department}
                  </small>

              )}

            </div>


            {/* ==========================================
                ROLE
            ========================================== */}

            <div className="form-group">

              <label>
                Role
                <span className="required">*</span>
              </label>

              <select
                name="role"
                value={employee.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("role")}
              >

                <option value="">
                  Select Role
                </option>

                <option value="EMPLOYEE">
                  Employee
                </option>

                <option value="ADMIN">
                  Admin
                </option>

              </select>

              {touched.role &&
                errors.role && (

                  <small className="error-text">
                    {errors.role}
                  </small>

              )}

            </div>


            {/* ==========================================
                JOB TITLE
            ========================================== */}

            <div className="form-group">

              <label>
                Job Title
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="jobTitle"
                value={employee.jobTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("jobTitle")}
              />

              {touched.jobTitle &&
                errors.jobTitle && (

                  <small className="error-text">
                    {errors.jobTitle}
                  </small>

              )}

            </div>


            {/* ==========================================
                SALARY
            ========================================== */}

            <div className="form-group">

              <label>
                Salary
                <span className="required">*</span>
              </label>

              <input
                type="number"
                name="salary"
                value={employee.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("salary")}
              />

              {touched.salary &&
                errors.salary && (

                  <small className="error-text">
                    {errors.salary}
                  </small>

              )}

            </div>


            {/* ==========================================
                EMAIL
            ========================================== */}

            <div className="form-group">

              <label>
                Email
                <span className="required">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("email")}
              />

              {touched.email &&
                errors.email && (

                  <small className="error-text">
                    {errors.email}
                  </small>

              )}

            </div>


            {/* ==========================================
                PHONE NUMBER
            ========================================== */}

            <div className="form-group">

              <label>
                Phone Number
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="phoneNumber"
                value={employee.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("phoneNumber")}
              />

              {touched.phoneNumber &&
                errors.phoneNumber && (

                  <small className="error-text">
                    {errors.phoneNumber}
                  </small>

              )}

            </div>


            {/* ==========================================
                CITY
            ========================================== */}

            <div className="form-group">

              <label>
                City
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="city"
                value={employee.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("city")}
              />

              {touched.city &&
                errors.city && (

                  <small className="error-text">
                    {errors.city}
                  </small>

              )}

            </div>


            {/* ==========================================
                STATE
            ========================================== */}

            <div className="form-group">

              <label>
                State
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="state"
                value={employee.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("state")}
              />

              {touched.state &&
                errors.state && (

                  <small className="error-text">
                    {errors.state}
                  </small>

              )}

            </div>


            {/* ==========================================
                COUNTRY
            ========================================== */}

            <div className="form-group">

              <label>
                Country
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="country"
                value={employee.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("country")}
              />

              {touched.country &&
                errors.country && (

                  <small className="error-text">
                    {errors.country}
                  </small>

              )}

            </div>


            {/* ==========================================
                EDUCATION
            ========================================== */}

            <div className="form-group">

              <label>
                Education Level
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="educationLevel"
                value={employee.educationLevel}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("educationLevel")}
              />

              {touched.educationLevel &&
                errors.educationLevel && (

                  <small className="error-text">
                    {errors.educationLevel}
                  </small>

              )}

            </div>


            {/* ==========================================
                EXPERIENCE
            ========================================== */}

            <div className="form-group">

              <label>
                Years of Experience
                <span className="required">*</span>
              </label>

              <input
                type="number"
                name="yearsOfExperience"
                value={employee.yearsOfExperience}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass(
                  "yearsOfExperience"
                )}
              />

              {touched.yearsOfExperience &&
                errors.yearsOfExperience && (

                  <small className="error-text">
                    {errors.yearsOfExperience}
                  </small>

              )}

            </div>


            {/* ==========================================
                RATING
            ========================================== */}

            <div className="form-group full-width">

              <label>
                Rating
                <span className="required">*</span>
              </label>

              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={employee.rating}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errorClass("rating")}
              />

              {touched.rating &&
                errors.rating && (

                  <small className="error-text">
                    {errors.rating}
                  </small>

              )}

            </div>


            {/* ==========================================
                UPDATE BUTTON
            ========================================== */}

            <button type="submit">
              Update Employee
            </button>

          </form>

        </div>

      </div>

    </Layout>
  );
}

export default EditEmployee;