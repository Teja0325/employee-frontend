import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  getEmployees,
  deleteEmployee,
  filterEmployees,
} from "../services/ApiService";

import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import "../css/EmployeeList.css";

import ConfirmModal from "../components/ConfirmModal";

import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
} from "react-icons/fa";


// ======================================================
// MULTI SELECT
// ======================================================

function MultiSelect({
  title,
  options,
  selected,
  setSelected,
}) {

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);


  // ====================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ====================================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {

        setOpen(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ====================================================
  // SELECT / UNSELECT
  // ====================================================

  const handleChange = (value) => {

    if (selected.includes(value)) {

      setSelected(
        selected.filter(
          (item) => item !== value
        )
      );

    } else {

      setSelected([
        ...selected,
        value,
      ]);

    }

  };


  // ====================================================
  // CLEAR
  // ====================================================

  const clearAll = () => {

    setSelected([]);

  };


  // ====================================================
  // DISPLAY TEXT
  // ====================================================

  let displayText = title;


  if (selected.length === 1) {

    const selectedOption =
      options.find(
        (option) =>
          option.value === selected[0]
      );


    displayText =
      selectedOption
        ? selectedOption.label
        : title;

  }


  if (selected.length > 1) {

    displayText =
      `${selected.length} selected`;

  }


  // ====================================================
  // JSX
  // ====================================================

  return (

    <div
      className="multi-select"
      ref={dropdownRef}
    >

      <button
        type="button"
        className="multi-select-button"
        onClick={() =>
          setOpen(!open)
        }
      >

        <span>
          {displayText}
        </span>


        <FaChevronDown
          className={
            open
              ? "arrow rotate"
              : "arrow"
          }
        />

      </button>


      {open && (

        <div className="multi-select-menu">

          <div className="multi-select-header">

            <span>
              {title}
            </span>


            {selected.length > 0 && (

              <button
                type="button"
                onClick={clearAll}
              >

                Clear

              </button>

            )}

          </div>


          {options.map((option) => (

            <label
              className="multi-select-option"
              key={option.value}
            >

              <input
                type="checkbox"
                checked={
                  selected.includes(
                    option.value
                  )
                }
                onChange={() =>
                  handleChange(
                    option.value
                  )
                }
              />


              <span>
                {option.label}
              </span>

            </label>

          ))}

        </div>

      )}

    </div>

  );

}


// ======================================================
// EMPLOYEE LIST
// ======================================================

function EmployeeList() {

  const navigate = useNavigate();

  const [permissions, setPermissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setPermissions(JSON.parse(localStorage.getItem("permissions") || "[]"));
      } catch {
        setPermissions([]);
      }
    };
    window.addEventListener("permissionsUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("permissionsUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const canWriteEmployee = permissions.includes("employee:write");
  const canDeleteEmployee = permissions.includes("employee:delete");


  // ====================================================
  // EMPLOYEES
  // ====================================================

  const [employees, setEmployees] =
    useState([]);


  // ====================================================
  // SEARCH
  // ====================================================

  const [search, setSearch] =
    useState("");


  // ====================================================
  // FILTERS
  // ====================================================

  const [departmentFilter, setDepartmentFilter] =
    useState([]);


  const [experienceFilter, setExperienceFilter] =
    useState([]);


  const [ratingFilter, setRatingFilter] =
    useState([]);


  const [roleFilter, setRoleFilter] =
    useState([]);


  // ====================================================
  // DELETE
  // ====================================================

  const [deleteId, setDeleteId] =
    useState(null);


  // ====================================================
  // LOAD EMPLOYEES
  // ====================================================

  const loadData = useCallback(async () => {

    try {

      const noFilters =
        search.trim() === "" &&
        departmentFilter.length === 0 &&
        experienceFilter.length === 0 &&
        ratingFilter.length === 0 &&
        roleFilter.length === 0;


      // ==================================================
      // NO FILTERS
      // ==================================================

      if (noFilters) {

        const response =
          await getEmployees();


        setEmployees(
          response.data
        );


        return;

      }


      // ==================================================
      // BACKEND FILTER
      // ==================================================

      const response =
        await filterEmployees({

          keyword:
            search.trim() === ""
              ? null
              : search.trim(),

          departments:
            departmentFilter.length === 0
              ? null
              : departmentFilter,

          experiences:
            experienceFilter.length === 0
              ? null
              : experienceFilter.map(Number),

          ratings:
            ratingFilter.length === 0
              ? null
              : ratingFilter.map(Number),

          roles:
            roleFilter.length === 0
              ? null
              : roleFilter,

        });


      setEmployees(
        response.data
      );


    } catch (error) {

      console.log(
        "Employee filter error:",
        error
      );

    }

  }, [
    search,
    departmentFilter,
    experienceFilter,
    ratingFilter,
    roleFilter,
  ]);


  // ====================================================
  // LOAD WHEN SEARCH / FILTER CHANGES
  // ====================================================

  useEffect(() => {

    loadData();

  }, [loadData]);


  // ====================================================
  // DELETE EMPLOYEE
  // ====================================================

  const handleDelete = async () => {

    if (deleteId === null) {

      return;

    }


    try {

      await deleteEmployee(
        deleteId
      );


      setDeleteId(null);


      await loadData();


    } catch (error) {

      console.log(
        "Delete error:",
        error
      );

    }

  };


  // ====================================================
  // DEPARTMENT OPTIONS
  // ====================================================

  const departmentOptions = [

    {
      value: "IT",
      label: "IT",
    },

    {
      value: "HR",
      label: "HR",
    },

    {
      value: "Finance",
      label: "Finance",
    },

    {
      value: "Sales",
      label: "Sales",
    },

    {
      value: "Marketing",
      label: "Marketing",
    },

    {
      value: "Admin",
      label: "Admin",
    },

    {
      value: "Operations",
      label: "Operations",
    },

    {
      value: "Support",
      label: "Support",
    },

    {
      value: "Testing",
      label: "Testing",
    },

    {
      value: "Security",
      label: "Security",
    },

    {
      value: "Design",
      label: "Design",
    },

    {
      value: "Robotics",
      label: "Robotics",
    },

    {
      value: "Cyber Security",
      label: "Cyber Security",
    },

    {
      value: "Software Development",
      label: "Software Development",
    },

  ];


  // ====================================================
  // EXPERIENCE OPTIONS
  // ====================================================

  const experienceOptions = [

    {
      value: "1",
      label: "1+ Years",
    },

    {
      value: "2",
      label: "2+ Years",
    },

    {
      value: "3",
      label: "3+ Years",
    },

    {
      value: "5",
      label: "5+ Years",
    },

    {
      value: "8",
      label: "8+ Years",
    },

  ];


  // ====================================================
  // RATING OPTIONS
  // ====================================================

  const ratingOptions = [

    {
      value: "5",
      label: "5 Stars",
    },

    {
      value: "4.5",
      label: "4.5+",
    },

    {
      value: "4",
      label: "4+",
    },

    {
      value: "3.5",
      label: "3.5+",
    },

    {
      value: "3",
      label: "3+",
    },

  ];


  // ====================================================
  // ROLE OPTIONS
  // ====================================================

  const roleOptions = [

    {
      value: "EMPLOYEE",
      label: "Employee",
    },

    {
      value: "ADMIN",
      label: "Admin",
    },

  ];


  // ====================================================
  // JSX
  // ====================================================

  return (

    <Layout>

      <div className="employee-page">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="employee-header">

          <div>

            <h1>
              Employees
            </h1>


            <p>
              Manage all employees
            </p>

          </div>


          {canWriteEmployee && (

            <button
              className="add-btn"
              onClick={() =>
                navigate("/add")
              }
            >

              <FaPlus />

              Add Employee

            </button>

          )}

        </div>


        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <div className="filter-bar">


          {/* SEARCH */}

          <div className="search-box2">

            <FaSearch />


            <input
              type="text"
              placeholder="Search Employee..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          {/* EXPERIENCE */}

          <MultiSelect
            title="All Years"
            options={experienceOptions}
            selected={experienceFilter}
            setSelected={
              setExperienceFilter
            }
          />


          {/* DEPARTMENT */}

          <MultiSelect
            title="All Departments"
            options={departmentOptions}
            selected={departmentFilter}
            setSelected={
              setDepartmentFilter
            }
          />


          {/* RATING */}

          <MultiSelect
            title="All Ratings"
            options={ratingOptions}
            selected={ratingFilter}
            setSelected={
              setRatingFilter
            }
          />


          {/* ROLE */}

          <MultiSelect
            title="All Roles"
            options={roleOptions}
            selected={roleFilter}
            setSelected={
              setRoleFilter
            }
          />

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="table-card">

          <div className="table-container">

            <table className="employee-table">


              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Experience
                  </th>

                  <th>
                    Rating
                  </th>

                  {canWriteEmployee && (
                    <th>
                      Edit
                    </th>
                  )}

                  {canDeleteEmployee && (
                    <th>
                      Delete
                    </th>
                  )}

                </tr>

              </thead>


              <tbody>

                {employees.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7 + (canWriteEmployee ? 1 : 0) + (canDeleteEmployee ? 1 : 0)}
                      className="no-employees"
                    >

                      No employees found

                    </td>

                  </tr>

                ) : (

                  employees.map(
                    (employee) => (

                      <tr
                        key={
                          employee.employeeId
                        }
                      >


                        {/* ID */}

                        <td>

                          {
                            employee.employeeId
                          }

                        </td>


                        {/* NAME */}

                        <td>

                          {
                            employee.firstName
                          }{" "}

                          {
                            employee.lastName
                          }

                        </td>


                        {/* DEPARTMENT */}

                        <td>

                          <span className="dept">

                            {
                              employee.department
                            }

                          </span>

                        </td>


                        {/* EMAIL */}

                        <td>

                          {
                            employee.email
                          }

                        </td>


                        {/* PHONE */}

                        <td>

                          {
                            employee.phoneNumber
                          }

                        </td>


                        {/* EXPERIENCE */}

                        <td>

                          {
                            employee.yearsOfExperience
                          }{" "}
                          yrs

                        </td>


                        {/* RATING */}

                        <td>

                          ⭐{" "}

                          {
                            employee.rating
                          }

                        </td>


                        {/* EDIT */}

                        {canWriteEmployee && (
                          <td>

                            <button
                              className="edit-btn"
                              onClick={() =>
                                navigate(
                                  `/edit/${employee.employeeId}`
                                )
                              }
                            >

                              <FaEdit />

                            </button>

                          </td>
                        )}


                        {/* DELETE */}

                        {canDeleteEmployee && (
                          <td>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                setDeleteId(
                                  employee.employeeId
                                )
                              }
                            >

                              <FaTrash />

                            </button>

                          </td>
                        )}



                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ==================================================
            DELETE CONFIRMATION
        ================================================== */}

        <ConfirmModal

          isOpen={
            deleteId !== null
          }

          title="Delete Employee?"

          message="Are you sure you want to delete this employee? This action cannot be undone."

          onConfirm={
            handleDelete
          }

          onCancel={() =>
            setDeleteId(null)
          }

        />

      </div>

    </Layout>

  );

}


export default EmployeeList;