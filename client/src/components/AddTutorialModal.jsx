import { Box, Modal } from "@mui/material";
import { useState } from "react";
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

const AddTutorialModal = ({ onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [link, setLink] = useState("");
  const { user } = useAuth();

  const onClick = () => {
    axiosClient
      .post("/tutorial/add", {
        link: link,
        tocId: user?.tocId,
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
        setLink("");
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
        className="text-md text-white font-bold bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        Add Tutorial
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
              <label className="text-md text-black">Video/iframe URL</label>
              <input
                required
                type="text"
                className="border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 mt-3 text-white font-bold py-2 px-4 rounded w-max focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add
            </button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddTutorialModal;
