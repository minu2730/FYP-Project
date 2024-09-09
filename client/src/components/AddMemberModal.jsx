import { Box, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import axiosClient from "../utils/axios.config";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddMemberModal = ({ onSubmit }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState(user.tocId);
  const [teamId, setTeamId] = useState(user.teamId);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [sponserId, setSponserId] = useState(user._id);
  const [compensationLevel, setCompensationLevel] = useState("");
  const [compansationLevels, setCompansationLevels] = useState([]);

  // Fetch and filter compansation levels based on the user level
  useEffect(() => {
    if (companyId) {
      axiosClient
        .get(`/user/getCompansationLevels/`, {
          params: { tocId: user?.tocId },
        })
        .then((response) => {
          const levels = response.data.levels || [];
          const levelIndex = levels.indexOf(user.compensationLevel);

          // Filter levels to only include those at or below the user's level
          if (levelIndex !== -1) {
            const filteredLevels = levels.slice(levelIndex);
            setCompansationLevels(filteredLevels);
          } else {
            setCompansationLevels([]);
          }
        })
        .catch((error) => {
          console.error(error);
          setCompansationLevels([]);
        });
    }
  }, [user?.tocId, user.compensationLevel, companyId]);

  const onClick = () => {
    axiosClient
      .post("/user/addDownLine", {
        name: userName,
        email: userEmail,
        sponserId: sponserId,
        userId: userId,
        tocId: companyId,
        teamId: teamId,
        compensationLevel: compensationLevel,
      })
      .then((res) => {
        onSubmit();
        toast.success(res.data.msg, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
        setIsModalOpen(false);
        setUserName("");
        setUserEmail("");
        // setCompansationLevels([])
        setCompensationLevel("")
      })
      .catch((error) => {
        toast.error(error.response.data.msg, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
      });
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Add Member
      </button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={style} className="rounded-2xl border-orange-400 border-2 p-8">
          <form
            className="flex flex-col gap-5 w-full items-center"
            onSubmit={(e) => {
              e.preventDefault();
              onClick();
            }}
          >
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg text-black">Name</label>
              <input
                required
                type="text"
                className="border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg text-black">User Email</label>
              <input
                required
                type="text"
                className="border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            {!!compansationLevels.length && (
              <div className="flex flex-col gap-2 w-full">
                <label className="text-lg text-black">Compensation Level</label>
                <select
                  className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-500 w-full"
                  onChange={(e) => setCompensationLevel(e.target.value)}
                  name="compensationLevel"
                  value={compensationLevel}
                  required
                >
                  <option value="">Select Level</option>
                  {compansationLevels.map((level) => (
                    <option key={level} value={level} className="capitalize">
                      {level.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="bg-blue-500 hover:bg-blue-700 mt-3 text-white font-bold py-2 px-4 rounded w-max focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Member
            </button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddMemberModal;
