import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNav from "../components/AdminNav";
import AdminProducts from "./AdminProducts";

const AdminDetails = () => {
  const { userId } = useParams(); // Get the ID from the URL params
  const navigate = useNavigate(); // For navigation after deletion
  const [adminData, setAdminData] = useState(null); // State to store user details
  const [loading, setLoading] = useState(true); // To handle the loading state
  const [error, setError] = useState(null); // To handle error state
  const [companyDetails, setCompanyDetails] = useState(null); // To store company details
  const [teamDetails, setTeamDetails] = useState(null); // To store team details

  console.log("comp details", companyDetails);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/admin/userdetails/${userId}`
        );
        setAdminData(response.data);
        setLoading(false);

        // Fetch additional details based on the user type
        if (response.data.type === "company") {
          fetchCompanyDetails(userId);
        } else if (response.data.type === "team") {
          fetchTeamDetails(userId);
        }
        
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const fetchCompanyDetails = async (userId) => {
    try {
      const companyResponse = await axios.get(
        `http://localhost:3001/admin/getcompanydetails/${userId}`
      );
      setCompanyDetails(companyResponse.data);
    } catch (err) {
      console.error("Failed to fetch company details:", err);
    }
  };

  const fetchTeamDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/admin/teamdetails/${userId}`
      );
      setTeamDetails(response.data);
      console.log("teams", response.data);
    } catch (err) {
      console.error("Failed to fetch team details:", err);
    }
  };

  // Handle deleting the user
  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/admin/deluser/${userId}`);
        alert("User deleted successfully.");
        navigate("/admin"); // Redirect to another page after deletion
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  // Render loading, error or the actual data
  if (loading)
    return <div className="text-center mt-4 text-lg">Loading...</div>;
  if (error)
    return <div className="text-center mt-4 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNav name={"Admin Dashboard"} />
      <h2 className="mt-3 text-center text-2xl font-bold mb-6 text-gray-700">
        User Details
      </h2>

      {adminData && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Name:</strong> {adminData.name}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Email:</strong>{" "}
              {adminData.email}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Type:</strong> {adminData.type.charAt(0).toUpperCase() + adminData.type.slice(1).toLowerCase()}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Compensation Level:</strong>{" "}
              {adminData.compensationLevel || "Not Applicable"}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Total Sale:</strong>{" "}
              {adminData.totalSale} Products
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Personal Income:</strong>{" "}
              £ {adminData.personalIncome.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Downline Income:</strong>{" "}
              {adminData.downlineIncome}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-gray-700">
              <strong className="font-semibold">Members:</strong>{" "}
              {adminData.members.length > 0
                ? adminData.members.join(", ")
                : "No members"}
            </p>
          </div>

          {/* Conditionally render based on type */}
          {adminData.type === "company" && (
            <div className="bg-blue-100 p-4 rounded-md mt-4">
              <h2 className="text-xl font-bold text-blue-600">
                Company Details
              </h2>

              {companyDetails && companyDetails.length > 0 ? (
                companyDetails.map((company, index) => (
                  <div key={index} className="mt-4">
                    <p className="text-gray-700">
                      <strong>Name:</strong> {company.name || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Website:</strong> {company.website || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Address:</strong> {company.address || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Compensation Plan Type:</strong>{" "}
                      {company.compensationPlanType || "N/A"}
                    </p>

                    

                    {/* Rendering teams list */}
                    <div className="mt-4">
                      <strong className="text-gray-700">Teams:</strong>
                      {company?.teams?.length > 0 ? (
                        <ul className="list-disc ml-5 mt-2">
                          {company.teams.map((team, teamIndex) => (
                            <li
                              key={teamIndex}
                              // onClick={() => teamHandler(team)}
                              className="text-gray-700 cursor-pointer"
                            >
                              {team}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 mt-2">
                          No teams available.
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-700 mt-2">
                  No company details available.
                </p>
              )}
            </div>
          )}

          

          {adminData.type === "team" && (
            <div className="bg-green-100 p-4 rounded-md mt-4">
              <h2 className="text-xl font-bold text-green-600">Team Details</h2>
              {teamDetails ? (
                <div>
                  <p className="text-gray-700">
                    <strong>Team Name:</strong> {teamDetails.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Company ID:</strong> {teamDetails.companyId}
                  </p>
                  <p className="text-gray-700">
                    <strong>Compensation Plan:</strong>{" "}
                    {teamDetails.compensationPlan.length > 0
                      ? teamDetails.compensationPlan.join(", ")
                      : "No Compensation Plan"}
                  </p>

                  <p className="text-gray-700">
                    <strong>Members:</strong>{" "}
                    {teamDetails.members.length > 0
                      ? teamDetails.members
                          .map((member) => member.name)
                          .join(", ")
                      : "No Members"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-700 mt-2">No team details available.</p>
              )}
            </div>
          )}

          {/* Delete button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleDeleteUser}
              className="bg-red-500  hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Delete User
            </button>
          </div>
        </div>
      )}

      <div>
        <AdminProducts id={adminData?.tocId} />
      </div>
    </div>
  );
};

export default AdminDetails;
