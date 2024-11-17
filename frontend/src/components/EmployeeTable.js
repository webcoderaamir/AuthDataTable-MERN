import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";

const EmployeeTable = ({ employeeData, onEmployeeSelect, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle change in the search input field
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter the employee data based on the search query
  const filteredEmployees = employeeData.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Image</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee._id}</td>
              <td>{employee.name}</td>
              <td>{employee.img}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.course}</td>
              <td>
                <button
                  className="btn btn-outline-success"
                  onClick={() => {
                    onEmployeeSelect(employee);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => onDelete(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default EmployeeTable;
