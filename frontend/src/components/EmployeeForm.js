import React, { useState, useEffect } from "react";

const EmployeeForm = ({ employee, onAdd, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    img: null, // Store the file object
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        img: employee.img || null, // Ensure img can handle both file and URL
        email: employee.email,
        mobile: employee.mobile,
        designation: employee.designation,
        gender: employee.gender,
        course: employee.course || [],
      });
    } else {
      setFormData({
        name: "",
        img: null,
        email: "",
        mobile: "",
        designation: "",
        gender: "",
        course: [],
      });
    }
  }, [employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    setFormData((prev) => ({
      ...prev,
      img: file, // Store the file object
    }));
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prev) => {
      let updatedCourses;
      if (checked) {
        updatedCourses = [...prev.course, value]; // Add course to the list
      } else {
        updatedCourses = prev.course.filter((course) => course !== value); // Remove course from the list
      }
      return {
        ...prev,
        course: updatedCourses,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataToSubmit = {
      ...formData,
      img: formData.img ? URL.createObjectURL(formData.img) : null, // Convert file to a temporary URL if available
    };
    if (employee) {
      onUpdate(dataToSubmit);
    } else {
      onAdd(dataToSubmit);
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="formemp">
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>

      <label>
        Image:
        <input
          type="file"
          name="img"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Mobile:
        <input
          type="number"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />
      </label>
      <label>
        Designation:
        <select
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        >
          <option value="">Select Designation</option>
          <option value="Manager">Manager</option>
          <option value="Team Lead">Team Lead</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Intern">Intern</option>
        </select>
      </label>
      <label>
        Gender:
        <div className="rad">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />
            Female
          </label>
        </div>
      </label>


      <label>
        Course:
        <div className="check">
          <label>
            <input
              type="checkbox"
              name="course"
              value="MCA"
              checked={formData.course.includes("MCA")}
              onChange={handleCheckboxChange}
            />
            MCA
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="BCA"
              checked={formData.course.includes("BCA")}
              onChange={handleCheckboxChange}
            />
            BCA
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="BSC"
              checked={formData.course.includes("BSC")}
              onChange={handleCheckboxChange}
            />
            BSC
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="B.TECH"
              checked={formData.course.includes("B.TECH")}
              onChange={handleCheckboxChange}
            />
            B.TECH
          </label>

        </div>
      </label>
      <div className="ad">
        <button className="btn1" type="submit">
          {employee ? "Update" : "Add"}
        </button>
        <button className="btn2" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
