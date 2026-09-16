import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  addEmployee,
  getMyProfile
} from "../services/ApiService";
import "../css/AddEmployee.css";
import { toast } from "sonner";

function AddEmployee() {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const isAdmin = role === "ADMIN";
 


  // =====================================================
  // EMPLOYEE STATE
  // =====================================================

  const [employee, setEmployee] = useState({

    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    hireDate: "",
    department: "",
    role: "EMPLOYEE",
    jobTitle: "",
    salary: "",
    email: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
    educationLevel: "",
    yearsOfExperience: "",
    password: "",
    rating: ""

  });


  // =====================================================
  // VALIDATION ERRORS
  // =====================================================

  const [errors, setErrors] = useState({});


  // =====================================================
  // LOAD ADMIN DEPARTMENT
  // =====================================================

  useEffect(() => {

    const loadMyProfile = async () => {

      if (!isAdmin) {
        return;
      }

      try {

        const response = await getMyProfile();

        const adminDepartment =
          response.data.department || "";

        setEmployee((previousEmployee) => ({
          ...previousEmployee,
          department: adminDepartment
        }));

      } catch (error) {

        console.error(
          "Unable to load admin department:",
          error
        );

      }

    };

    loadMyProfile();

  }, [isAdmin]);


  // =====================================================
  // VALIDATE ONE FIELD
  // =====================================================

  const validateField = (
    name,
    value,
    currentEmployee = employee
  ) => {

    let error = "";

    switch (name) {

      // ==========================================
      // FIRST NAME
      // ==========================================

      case "firstName":

        if (!value.trim()) {

          error = "First name is required.";

        } else if (value.trim().length < 2) {

          error = "Minimum 2 characters required.";

        } else if (!/^[A-Za-z]+$/.test(value.trim())) {

          error = "Only letters are allowed.";

        }

        break;


      // ==========================================
      // LAST NAME
      // ==========================================

      case "lastName":

        if (!value.trim()) {

          error = "Last name is required.";

        } else if (value.trim().length < 2) {

          error = "Minimum 2 characters required.";

        } else if (!/^[A-Za-z]+$/.test(value.trim())) {

          error = "Only letters are allowed.";

        }

        break;


      // ==========================================
      // DATE OF BIRTH
      // ==========================================

      case "dateOfBirth":

        if (!value) {

          error = "Date of birth is required.";

        } else {

          const dob = new Date(value);
          const today = new Date();

          if (dob >= today) {

            error = "Must be a valid past date.";

          }

        }

        break;


      // ==========================================
      // GENDER
      // ==========================================

      case "gender":

        if (!value) {

          error = "Gender is required.";

        }

        break;


      // ==========================================
      // HIRE DATE
      // ==========================================

      case "hireDate":

        if (!value) {

          error = "Hire date is required.";

        } else if (
          currentEmployee.dateOfBirth &&
          new Date(value) <=
          new Date(currentEmployee.dateOfBirth)
        ) {

          error =
            "Hire date must be after date of birth.";

        }

        break;


      // ==========================================
      // DEPARTMENT
      // ==========================================

      case "department":

        if (!value) {

          error = "Department is required.";

        }

        break;


      // ==========================================
      // ROLE
      // ==========================================

      case "role":

        if (!value) {

          error = "Role is required.";

        }

        break;


      // ==========================================
      // JOB TITLE
      // ==========================================

      case "jobTitle":

        if (!value.trim()) {

          error = "Job title is required.";

        } else if (value.trim().length < 2) {

          error = "Minimum 2 characters required.";

        }

        break;


      // ==========================================
      // SALARY
      // ==========================================

      case "salary":

        if (!value) {

          error = "Salary is required.";

        } else if (Number(value) <= 0) {

          error = "Salary must be greater than 0.";

        }

        break;


      // ==========================================
      // EMAIL
      // ==========================================

      case "email":

        if (!value.trim()) {

          error = "Email is required.";

        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {

          error = "Enter a valid email address.";

        }

        break;


      // ==========================================
      // PHONE
      // ==========================================

      case "phoneNumber":

        if (!value.trim()) {

          error = "Phone number is required.";

        } else if (!/^\d{10}$/.test(value)) {

          error =
            "Phone number must contain exactly 10 digits.";

        }

        break;


      // ==========================================
      // CITY
      // ==========================================

      case "city":

        if (!value.trim()) {

          error = "City is required.";

        } else if (value.trim().length < 2) {

          error = "Minimum 2 characters required.";

        }

        break;


      // ==========================================
      // STATE
      // ==========================================

      case "state":

        if (!value.trim()) {

          error = "State is required.";

        } else if (value.trim().length < 2) {

          error = "Minimum 2 characters required.";

        }

        break;


      // ==========================================
      // COUNTRY
      // ==========================================

      case "country":

        if (!value.trim()) {

          error = "Country is required.";

        } else if (value.trim().length < 2) {

          error = "Minimum 2 characters required.";

        }

        break;


      // ==========================================
      // EDUCATION
      // ==========================================

      case "educationLevel":

        if (!value.trim()) {

          error = "Education level is required.";

        } else if (value.trim().length < 2) {

          error = "Minimum 2 characters required.";

        }

        break;


      // ==========================================
      // EXPERIENCE
      // ==========================================

      case "yearsOfExperience":

        if (value === "") {

          error =
            "Years of experience is required.";

        } else if (Number(value) < 0) {

          error =
            "Experience cannot be negative.";

        }

        break;


      // ==========================================
      // PASSWORD
      // ==========================================

      case "password":

        if (!value) {

          error = "Password is required.";

        } else if (value.length < 6) {

          error =
            "Password must be at least 6 characters.";

        }

        break;


      // ==========================================
      // RATING
      // ==========================================

      case "rating":

        if (value === "") {

          error = "Rating is required.";

        } else if (
          Number(value) < 0 ||
          Number(value) > 5
        ) {

          error =
            "Rating must be between 0 and 5.";

        }

        break;


      default:
        break;

    }

    return error;

  };


  // =====================================================
  // HANDLE CHANGE
  // ERROR APPEARS WHILE TYPING
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    // ==========================================
    // ADMIN CANNOT CHANGE DEPARTMENT
    // ==========================================

    if (
      isAdmin &&
      name === "department"
    ) {

      return;

    }


    const updatedEmployee = {

      ...employee,

      [name]: value

    };


    setEmployee(updatedEmployee);


    // ==========================================
    // VALIDATE IMMEDIATELY
    // ==========================================

    const error = validateField(
      name,
      value,
      updatedEmployee
    );


    setErrors((previousErrors) => ({

      ...previousErrors,

      [name]: error

    }));

  };


  // =====================================================
  // VALIDATE ALL FIELDS
  // =====================================================

  const validateAll = () => {

    const newErrors = {};


    Object.keys(employee).forEach((field) => {

      const error = validateField(
        field,
        employee[field],
        employee
      );


      if (error) {

        newErrors[field] = error;

      }

    });


    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    const isValid = validateAll();


    if (!isValid) {

      return;

    }


    try {

      const employeeData = {

        ...employee,

        salary:
          Number(employee.salary),

        yearsOfExperience:
          Number(employee.yearsOfExperience),

        rating:
          Number(employee.rating)

      };


      await addEmployee(employeeData);


      toast.success(

        employee.role === "ADMIN"

          ? "Admin Added Successfully"

          : "Employee Added Successfully"

      );


      navigate("/employees");


    } catch (error) {

      console.error(
        "ADD EMPLOYEE ERROR:",
        error
      );


      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data
      ) {

        setErrors(error.response.data);

      } else {

        toast.error(
          "Unable To Add Employee"
        );

      }

    }

  };


  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = (field) =>

    errors[field]
      ? "input-error"
      : "";


  // =====================================================
  // JSX
  // =====================================================

  return (

    <Layout>

      <div className="add-page">

        <div className="add-card">


          {/* ==========================================
              TITLE
          ========================================== */}

          <div className="title">

            <h1>
              Add Employee
            </h1>

            <p>
              Add employee or administrator details below
            </p>

          </div>


          <form
            className="add-form"
            onSubmit={handleSubmit}
            noValidate
          >


            {/* ==========================================
                FIRST NAME
            ========================================== */}

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
                className={inputClass("firstName")}
              />


              {errors.firstName && (

                <span className="error-text">

                  {errors.firstName}

                </span>

              )}

            </div>


            {/* ==========================================
                LAST NAME
            ========================================== */}

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
                className={inputClass("lastName")}
              />


              {errors.lastName && (

                <span className="error-text">

                  {errors.lastName}

                </span>

              )}

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
                className={inputClass("dateOfBirth")}
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
                className={inputClass("gender")}
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
                HIRE DATE
            ========================================== */}

            <div className="form-group">

              <label>

                Hire Date

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="date"
                name="hireDate"
                value={employee.hireDate}
                onChange={handleChange}
                className={inputClass("hireDate")}
              />


              {errors.hireDate && (

                <span className="error-text">

                  {errors.hireDate}

                </span>

              )}

            </div>


            {/* ==========================================
                DEPARTMENT
            ========================================== */}

            <div className="form-group">

              <label>

                Department

                <span className="required">
                  *
                </span>

              </label>


              <select
                name="department"
                value={employee.department}
                onChange={handleChange}
                disabled={isAdmin}
                className={inputClass("department")}
              >

                {/* =====================================
                    SUPER ADMIN
                ===================================== */}

                {!isAdmin && (

                  <option value="">
                    Select Department
                  </option>

                )}


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

                <option value="Testing">
                  Testing
                </option>

              </select>


              {errors.department && (

                <span className="error-text">

                  {errors.department}

                </span>

              )}

            </div>


            {/* ==========================================
                ROLE
            ========================================== */}

            <div className="form-group">

              <label>

                Role

                <span className="required">
                  *
                </span>

              </label>


              <select
                name="role"
                value={employee.role}
                onChange={handleChange}
                className={inputClass("role")}
              >

                <option value="EMPLOYEE">
                  Employee
                </option>

                <option value="ADMIN">
                  Admin
                </option>

              </select>


              {errors.role && (

                <span className="error-text">

                  {errors.role}

                </span>

              )}

            </div>


            {/* ==========================================
                JOB TITLE
            ========================================== */}

            <div className="form-group">

              <label>

                Job Title

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="text"
                name="jobTitle"
                value={employee.jobTitle}
                onChange={handleChange}
                className={inputClass("jobTitle")}
              />


              {errors.jobTitle && (

                <span className="error-text">

                  {errors.jobTitle}

                </span>

              )}

            </div>


            {/* ==========================================
                SALARY
            ========================================== */}

            <div className="form-group">

              <label>

                Salary

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="number"
                name="salary"
                value={employee.salary}
                onChange={handleChange}
                className={inputClass("salary")}
              />


              {errors.salary && (

                <span className="error-text">

                  {errors.salary}

                </span>

              )}

            </div>


            {/* ==========================================
                EMAIL
            ========================================== */}

            <div className="form-group">

              <label>

                Email

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
                className={inputClass("email")}
              />


              {errors.email && (

                <span className="error-text">

                  {errors.email}

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
                className={inputClass("phoneNumber")}
              />


              {errors.phoneNumber && (

                <span className="error-text">

                  {errors.phoneNumber}

                </span>

              )}

            </div>


            {/* ==========================================
                CITY
            ========================================== */}

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
                className={inputClass("city")}
              />


              {errors.city && (

                <span className="error-text">

                  {errors.city}

                </span>

              )}

            </div>


            {/* ==========================================
                STATE
            ========================================== */}

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
                className={inputClass("state")}
              />


              {errors.state && (

                <span className="error-text">

                  {errors.state}

                </span>

              )}

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
                className={inputClass("country")}
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
                value={employee.educationLevel}
                onChange={handleChange}
                className={inputClass("educationLevel")}
              />


              {errors.educationLevel && (

                <span className="error-text">

                  {errors.educationLevel}

                </span>

              )}

            </div>


            {/* ==========================================
                EXPERIENCE
            ========================================== */}

            <div className="form-group">

              <label>

                Years of Experience

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="number"
                name="yearsOfExperience"
                value={employee.yearsOfExperience}
                onChange={handleChange}
                className={inputClass("yearsOfExperience")}
              />


              {errors.yearsOfExperience && (

                <span className="error-text">

                  {errors.yearsOfExperience}

                </span>

              )}

            </div>


            {/* ==========================================
                PASSWORD
            ========================================== */}

            <div className="form-group">

              <label>

                Password

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="password"
                name="password"
                value={employee.password}
                onChange={handleChange}
                className={inputClass("password")}
              />


              {errors.password && (

                <span className="error-text">

                  {errors.password}

                </span>

              )}

            </div>


            {/* ==========================================
                RATING
            ========================================== */}

            <div className="form-group">

              <label>

                Rating

                <span className="required">
                  *
                </span>

              </label>


              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={employee.rating}
                onChange={handleChange}
                className={inputClass("rating")}
              />


              {errors.rating && (

                <span className="error-text">

                  {errors.rating}

                </span>

              )}

            </div>


            {/* ==========================================
                SAVE
            ========================================== */}

            <button type="submit">

              Save Employee

            </button>


          </form>

        </div>

      </div>

    </Layout>

  );

}

export default AddEmployee;