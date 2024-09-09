import { useCallback, useState, useEffect } from "react";
import axiosClient from "../utils/axios.config";
import AddSubscriptionModal from "./AddSubscriptionModal";
import { useNavigate } from "react-router-dom";

const getUsers = async () => {
  try {
    const { data } = await axiosClient.get(`/user`);
    console.log("Admin Main Page", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const SubscriptionsTable = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Move useNavigate outside the handler

  const fetchUsers = useCallback(() => {
    getUsers().then((response) => {
      setUsers(response.users.filter((u) => u.type !== "member"));
    });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const detailsHandler = (userId) => {
    // Navigate to the /admin/details/:userId route
    navigate(`/admin/details/${userId}`);
  };

  return (
    <div className="rounded px-8 py-6 max-w-full mx-auto h-full text-black flex flex-col">
      <div className="flex gap-6 self-center">
        <div className="w-[150px] rounded-xl shadow-lg hover:shadow-2xl flex flex-col px-5 py-4 items-center justify-center">
          <h3 className="text-lg font-bold">Total Users</h3>
          <h3 className="text-lg font-bold my-6">{users?.length}</h3>
        </div>
        <div className="min-w-[150px] rounded-xl shadow-lg hover:shadow-2xl flex flex-col items-center px-5 py-4 justify-center self-center">
          <h3 className="text-lg font-bold">Active Subscribers</h3>
          <h3 className="text-lg font-bold my-6">
            {users?.filter((user) => user?.subscriptionId?.active).length}
          </h3>
        </div>
        <div className="min-w-[150px] rounded-xl shadow-lg hover:shadow-2xl flex flex-col items-center px-5 py-4 justify-center self-center">
          <h3 className="text-lg font-bold">Companies</h3>
          <h3 className="text-lg font-bold my-6">
            {users?.filter((user) => user?.type === "company").length}
          </h3>
        </div>
        <div className="min-w-[150px] rounded-xl shadow-lg hover:shadow-2xl flex flex-col items-center px-5 py-4 justify-center self-center">
          <h3 className="text-lg font-bold">Teams</h3>
          <h3 className="text-lg font-bold my-6">
            {users?.filter((user) => user?.type === "team").length}
          </h3>
        </div>
      </div>
      <div className="font-extrabold my-10 flex justify-between">
        <h1>Subscriptions Details</h1>
      </div>

      <table className="w-full">
        <thead className="text-md text-gray-700 uppercase bg-slate-300  top-[85px]">
          <tr className="text-left">
            <th className="px-2 py-4 text-center">Sr</th>
            <th className="px-2 py-4 text-center">Name</th>
            <th className="px-2 py-4 text-center">Email</th>
            <th className="px-2 py-4 text-center">Type</th>
            <th className="px-2 py-4 text-center">Payment</th>
            <th className="px-2 py-4 text-center">Action</th>
            <th className="px-2 py-4 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {!!users?.length &&
            users.map((user, index) => (
              <tr
                key={index}
                className={`'text-left ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-100"
                } border-b-2 border-slate-400'`}
              >
                <td className="px-2 py-4 text-center text-black">
                  {index + 1}
                </td>
                <td className="px-2 py-4 text-center text-black">
                  {user?.name}
                </td>
                <td className="px-2 py-4 text-center text-black">
                  {user?.email}
                </td>
                <td className="px-2 py-4 text-center text-black">
                  {user?.type}
                </td>
                <td className="px-2 py-4 text-center text-black">
                  {user?.subscriptionId?.price}
                </td>
                <td className="px-2 py-4 text-center text-black">
                  <div className="flex justify-center items-center gap-4">
                    <AddSubscriptionModal
                      id={user?._id}
                      onSubmit={fetchUsers}
                      details={user?.subscriptionId?.details}
                      price={user?.subscriptionId?.price}
                      active={user?.subscriptionId?.active}
                      haveSubscription={user?.subscriptionId}
                    />
                  </div>
                </td>
                <td
                  onClick={() => detailsHandler(user._id)} // Correctly passing userId
                  className="px-2 py-4 text-center text-black cursor-pointer"
                >
                  See Details
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionsTable;
