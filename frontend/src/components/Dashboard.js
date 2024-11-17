import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeTable from "./EmployeeTable";
import EmployeeForm from "./EmployeeForm";

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employee data when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/data")
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleEmployeeAdd = (employee) => {
    axios
      .post("http://localhost:3000/api/data", employee)
      .then((response) => {
        setEmployeeData((prevData) => [...prevData, response.data.data]);
        setShowForm(false);  // Hide the form after adding
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
      });
  };

  const handleEmployeeUpdate = (employee) => {
    axios
      .put(`http://localhost:3000/api/data/${employee._id}`, employee)
      .then((response) => {
        const updatedData = employeeData.map((e) =>
          e._id === employee._id ? response.data.data : e
        );
        setEmployeeData(updatedData);
        setShowForm(false);  // Hide the form after updating
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
      });
  };

  const handleEmployeeDelete = (_id) => {
    axios
      .delete(`http://localhost:3000/api/data/${_id}`)
      .then(() => {
        setEmployeeData(employeeData.filter((employee) => employee._id !== _id));
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
  };

  return (
    <div>
      <div className="addemp">
        {showForm ? (
          <EmployeeForm
            employee={selectedEmployee}
            onAdd={handleEmployeeAdd}
            onUpdate={handleEmployeeUpdate}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <button
            className="btn"
            onClick={() => setShowForm(true)}
          >
            Create Employee
          </button>
        )}
      </div>

      <div className="employee-tab">
        <h2 className="das">Employee Dashboard</h2>
        <EmployeeTable
          employeeData={employeeData}
          onEmployeeSelect={handleEmployeeSelect}
          onDelete={handleEmployeeDelete}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
