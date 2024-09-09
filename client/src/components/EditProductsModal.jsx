import { Box, Modal } from "@mui/material";
import { useState } from "react";
import axiosClient from "../utils/axios.config";
import { toast } from "react-toastify";
import { IoImage } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  radius: 12,
};

const EditProductsModal = ({
  id,
  prevName,
  prevDescription,
  prevPoints,
  prevPrice,
  prevImage,
  refetchProducts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setProductName] = useState(prevName);
  const [description, setProductDescription] = useState(prevDescription);
  const [points, setProductPoints] = useState(prevPoints);
  const [price, setPrice] = useState(prevPrice);
  // image
  const [image, setProductImage] = useState(prevImage);
  const [displayImage, setDisplayImage] = useState();
  const [loading, setLoading] = useState(false);

  const onClick = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("points", points);
      formData.append("price", price);
      formData.append("id", id);

      await axiosClient
        .post(
          "/product/updateProduct",
          formData, // Use FormData directly as the data
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          toast.success(res.data.msg, {
            position: "top-center",
            autoClose: 3000,
            closeOnClick: true,
            draggable: true,
          });
          refetchProducts();
          setIsModalOpen(false);
          setLoading(false);
        });
    } catch (error) {
      toast.error(error.response.data.msg, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(e.target.files[0]);
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

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
      >
        <BiEdit size={20} />
      </button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={style}>
          <form className="rounded flex flex-col items-center gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg text-black font-[600]">Name</label>
              <input
                required
                type="text"
                className="border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400"
                value={name}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg text-black font-[600]">
                Description
              </label>
              <input
                required
                type="text"
                className="border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400"
                value={description}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg text-black font-[600]">Points</label>
              <input
                required
                type="number"
                className="border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400"
                value={points}
                onChange={(e) => setProductPoints(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg text-black font-[600]">Price</label>
              <input
                required
                type="number"
                className="border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg text-black font-[600]">Image</label>
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
                  className="w-full h-48 rounded-md border-2 border-gray-300 flex items-center justify-center cursor-pointer"
                  onClick={handleImageClick}
                >
                  {image ? (
                    <img
                      src={typeof image === "string" ? image : displayImage}
                      alt="Selected"
                      className="w-full h-full rounded-md object-cover"
                    />
                  ) : (
                    <IoImage size={32} />
                  )}
                </div>
              </div>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 mt-3 text-white font-bold py-2 px-4 rounded w-max flex gap-4 items-center disabled:opacity-50"
              type="submit"
              disabled={loading}
              onClick={onClick}
            >
              {loading && (
                <div className="animate-spin">
                  <AiOutlineLoading />
                </div>
              )}
              Update Product
            </button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditProductsModal;
