import { useEffect, useState, useCallback } from "react";
import AddTutorialModal from "./AddTutorialModal";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../utils/axios.config";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";

const Training = ({ editable = true }) => {
  const [tutorials, setTutorials] = useState([]);
  const { user } = useAuth();

  const fetchTutorials = useCallback(async () => {
    if (!user?.tocId) {
      setTutorials([]);
      return;
    }

    try {
      const response = await axiosClient.get(`/tutorial/`, {
        params: { tocId: user.tocId },
      });
      setTutorials(response.data.links);
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      toast.error("Failed to fetch tutorials. Please try again later.");
    }
  }, [user?.tocId]);

  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

  const deleteTutorial = async (tutorialId) => {
    try {
      const res = await axiosClient.delete(`/tutorial/${tutorialId}`);
      toast.success(res.data.msg, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
      fetchTutorials();
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      toast.error("Failed to delete tutorial. Please try again.");
    }
  };

  const convertToEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error("Invalid URL format:", error);
      return "";
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">Training Series</h2>
        {editable && <AddTutorialModal onSubmit={fetchTutorials} />}
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tutorials?.map((tutorial) => (
          <div
            key={tutorial._id}
            className="relative group rounded-lg shadow-lg overflow-hidden bg-gray-100 hover:shadow-2xl transition duration-300 ease-in-out"
          >
            {editable && (
              <button
                className="absolute top-2 right-2 z-10 text-white bg-red-500 p-2 rounded-full shadow-lg hover:bg-red-600 transition duration-300"
                onClick={() => deleteTutorial(tutorial._id)}
                aria-label="Delete tutorial"
              >
                <Delete />
              </button>
            )}
            <iframe
              src={convertToEmbedUrl(tutorial.link)}
              allowFullScreen
              width="100%"
              height="250"
              className="rounded-lg"
              allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
            />
          </div>
        ))}
      </div>
      {tutorials.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No tutorials available.
        </p>
      )}
    </div>
  );
};

export default Training;
