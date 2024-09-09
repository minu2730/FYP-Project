import { Box, Modal } from "@mui/material";
import { useState } from "react";
import axiosClient from "../utils/axios.config";
import { toast } from "react-toastify";
import { IoImage } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { AiOutlineLoading, AiOutlineClose } from "react-icons/ai";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 0,
};

const AddProductsModal = ({ refetchProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setProductName] = useState("");
  const [description, setProductDescription] = useState("");
  const [points, setProductPoints] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setProductImage] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("points", points);
      formData.append("price", price);
      formData.append("type", user?.type);
      formData.append("id", user?.additionalData?._id);

      const response = await axiosClient.post("/product/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.msg, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });

      setProductImage(null);
      setProductDescription("");
      setProductPoints("");
      setPrice("");
      setProductName("");
      setDisplayImage(null);

      refetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.msg || "Failed to add product", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add Product
      </button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={style} className="relative">
          <button
            className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:text-gray-800"
            onClick={() => setIsModalOpen(false)}
          >
            <AiOutlineClose size={24} />
          </button>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg text-gray-800 font-semibold">
                Name
              </label>
              <input
                required
                type="text"
                className="border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300"
                value={name}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg text-gray-800 font-semibold">
                Description
              </label>
              <input
                required
                type="text"
                className="border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300"
                value={description}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg text-gray-800 font-semibold">
                Points
              </label>
              <input
                required
                type="number"
                className="border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300"
                value={points}
                onChange={(e) => setProductPoints(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg text-gray-800 font-semibold">
                Price
              </label>
              <input
                required
                type="number"
                className="border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg text-gray-800 font-semibold">
                Image
              </label>
              <div className="flex flex-col items-center w-full">
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                <div
                  className="w-full h-48 rounded-md border border-gray-300 flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition duration-300"
                  onClick={handleImageClick}
                >
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt="Selected"
                      className="w-full h-full rounded-md object-cover"
                    />
                  ) : (
                    <IoImage size={40} className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-transform transform ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
              }`}
              disabled={loading}
            >
              {loading && <AiOutlineLoading className="animate-spin mr-2" />}
              Add Product
            </button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddProductsModal;
