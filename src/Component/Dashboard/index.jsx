import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const states = ["Tamil Nadu", "Karnataka", "Kerala", "Maharashtra"];
const genders = ["Male", "Female", "Other"];

export default function Dashboard() {

    const [employees, setEmployees] = useState(() => {
        const stored = localStorage.getItem("employees");
        return stored ? JSON.parse(stored) : [];
    });
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteEmployee, setDeleteEmployee] = useState(null);
    const emptyForm = {
        id: null,
        fullName: "",
        gender: "",
        dob: "",
        state: "",
        active: true,
        image: "",
    };
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");



  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAuth");
    toast.success("Logged out successfully");
    navigate("/");
  };

  

  

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);


  

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);


  const handleSave = () => {
    if (!form.fullName || !form.gender || !form.dob || !form.state || !form.image){
        toast.error("Please fill all required fields");
        return;
    }
        

    if (isEditing) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === form.id ? form : e))
      );
       toast.success("Employee updated successfully");
    } else {
      setEmployees((prev) => [
        ...prev,
        { ...form, id: employees.length + 1, active: employees?.active },
      ]);
      toast.success("Employee added successfully");
    }

    setForm(emptyForm);
    setIsEditing(false);
    setShowModal(false);
  };


  const handleEdit = (emp) => {
    setForm(emp);
    setIsEditing(true);
    setShowModal(true);
  };


  const handleDeleteConfirmed = () => {
    setEmployees((prev) =>
      prev.filter((e) => e.id !== deleteEmployee.id)
    );
    toast.warn("Employee deleted");
    setDeleteEmployee(null);
  };


  const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG and PNG image formats are allowed");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({ ...form, image: reader.result });
        };
        reader.readAsDataURL(file);
        };




 const filteredEmployees = useMemo(() => {
  return employees.filter((emp) => {
    const matchName = emp.fullName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchGender =
      genderFilter === "" || emp.gender === genderFilter;

    const matchStatus =
      statusFilter === ""
        ? true
        : statusFilter === "active"
        ? emp.active
        : !emp.active;

    return matchName && matchGender && matchStatus;
  });
}, [employees, search, genderFilter, statusFilter]);


  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold"> Employee Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>


      <div className="flex flex-wrap gap-4 items-center mb-4 bg-white p-4 rounded shadow">
  {/* Search */}
  <input
    placeholder="Search by name..."
    className="border p-2 rounded w-full md:w-1/4"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* Gender Filter */}
  <select
    className="border p-2 rounded w-full md:w-1/6"
    value={genderFilter}
    onChange={(e) => setGenderFilter(e.target.value)}
  >
    <option value="">All Gender</option>
    {genders.map((g) => (
      <option key={g} value={g}>
        {g}
      </option>
    ))}
  </select>

  {/* Status Filter */}
  <select
    className="border p-2 rounded w-full md:w-1/6"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="">All Status</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>

  {/* Actions */}
  <div className="flex gap-3 ml-auto">
    <button
      onClick={() => window.print()}
      className="bg-indigo-600 text-white px-4 py-2 rounded"
    >
      🖨 Print All
    </button>

    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      + Add Employee
    </button>
  </div>
      </div>


      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Emp ID</th>
              <th className="p-3">Profile</th>
              <th className="p-3">Name</th>
              <th className="p-3">Gender</th>
              <th className="p-3">DOB</th>
              <th className="p-3">State</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((e) => (
                <tr key={e.id} className="border-t text-center">
                    <td>{e.id}</td>
                  <td>
                    <img
                      src={e.image}
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  </td>
                  <td>{e.fullName}</td>
                  <td>{e.gender}</td>
                  <td>{e.dob}</td>
                  <td>{e.state}</td>

                  <td>
                    <span
                       onClick={() => {
                                setEmployees((prev) =>
                                prev.map((emp) =>
                                    emp.id === e.id ? { ...emp, active: !emp.active } : emp
                                )
                                );

                                toast.info(
                                `${e.fullName} marked as ${e.active ? "Inactive" : "Active"}`
                                );
                            }}
                      
                      className={`px-3 py-1 rounded-full text-white text-sm cursor-pointer
                        ${e.active ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {e.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(e)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteEmployee(e)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EmployeeModal
          form={form}
          setForm={setForm}
          handleImage={handleImage}
          handleSave={handleSave}
          close={() => {
            setShowModal(false);
            setIsEditing(false);
            setForm(emptyForm);
          }}
          isEditing={isEditing}
        />
      )}

      {deleteEmployee && (
        <DeleteConfirmModal
          employee={deleteEmployee}
          onCancel={() => setDeleteEmployee(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}

      
    </div>
  );
}


        const EmployeeModal = ({
        form,
        setForm,
        handleImage,
        handleSave,
        close,
        isEditing,
        }) => (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-xl font-bold mb-4">
                {isEditing ? "Edit" : "Add"} Employee
            </h2>

         
            <input
                className="border p-2 w-full mb-2"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
                }
            />

        
            <select
                className="border p-2 w-full mb-2"
                value={form.gender}
                onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
                }
            >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                <option key={g}>{g}</option>
                ))}
            </select>

            
            <input
                type="date"
                className="border p-2 w-full mb-2"
                value={form.dob}
                onChange={(e) =>
                setForm({ ...form, dob: e.target.value })
                }
            />

            
            <select
                className="border p-2 w-full mb-2"
                value={form.state}
                onChange={(e) =>
                setForm({ ...form, state: e.target.value })
                }
            >
                <option value="">Select State</option>
                {states.map((s) => (
                <option key={s}>{s}</option>
                ))}
            </select>

           
            <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Status</span>

                <span
                onClick={() =>
                    setForm({ ...form, active: !form.active })
                }
                className={`px-4 py-1 rounded-full text-sm font-semibold text-white cursor-pointer
                    ${form.active ? "bg-green-500" : "bg-red-500"}
                    hover:opacity-80 transition`}
                >
                {form.active ? "Active" : "Inactive"}
                </span>
            </div>


            <input type="file" 
            accept=".jpg,.jpeg,.png"
            onChange={handleImage} 
            />
            {form.image && (
                <img
                src={form.image}
                className="w-16 h-16 rounded-full mt-2 border"
                />
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-4">
                <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                Save
                </button>
                <button
                onClick={close}
                className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                >
                Cancel
                </button>
            </div>
            </div>
        </div>
        );


        const DeleteConfirmModal = ({ employee, onCancel, onConfirm }) => (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded text-center w-[320px]">
            <h2 className="text-xl font-bold text-red-600 mb-2">Delete Employee</h2>
            <p className="mb-4">Delete <strong>{employee.fullName}</strong>?</p>
            <div className="flex justify-center gap-3">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
            </div>
        </div>
        );


