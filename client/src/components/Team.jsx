import { useState, useCallback } from "react";
import AddMemberModal from "./AddMemberModal";
import { useEffect } from "react";
import axiosClient from "../utils/axios.config";
import { useAuth } from "../contexts/AuthContext";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
	console.log(teamMembers)
  const { user } = useAuth();

  console.log("team check", user);
  const fetchTeamDetails = useCallback(async () => {
    try {
      axiosClient.get(`/team/${user?._id}`).then((res) => {
        setTeamMembers(res.data.teamMembers);
      });
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  }, [user?.additionalData._id]);

  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  return (
    <div className="col-span-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Team</h2>
        <AddMemberModal onSubmit={fetchTeamDetails} />
      </div>

      <table className="w-full">
        <thead className="text-lg text-gray-700 uppercase bg-slate-300 top-[150px]">
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Level</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers?.map((member, index) => {
            return (
              <>
                <tr
                  key={index}
                  className={`'text-left ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-100"
                  } border-b-2 border-slate-400'`}
                >
                  <td className="px-2 py-4 text-center">{member._id}</td>
                  <td className="px-2 py-4 text-center">{member.name}</td>
                  <td className="px-2 py-4 text-center">{member.email}</td>
                  <td className="px-2 py-4 text-center capitalize">
                    {member.compensationLevel.replace("_", " ")}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Team;
