import { useEffect, useState } from "react";
import axiosClient from "../utils/axios.config";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const getProducts = async (id) => {
  try {
    const { data } = await axiosClient.get(`/product/getProducts/${id}`);
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const AdminProducts = ({ id }) => {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const fetchProducts = async () => {
    const fetchedProducts = await getProducts(id);
    setProducts(fetchedProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Product?"
    );
    if (confirmDelete) {
      try {
        await axiosClient.delete(`/product/deleteProduct`, {
          params: { id: productId },
        });
        toast.success("Product deleted successfully", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(error.response?.data?.msg || "Failed to delete product", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
      }
    }
  };

  return (
    <div className="col-span-5">
      <div className="mt-6 flex justify-center items-center mb-4">
        <h2 className="text-5xl font-bold">Products</h2>
      </div>

      {/* Check if products array is empty or not */}
      {products.length > 0 ? (
        <div className="flex flex-wrap">
          {products.map((item) => (
            <div
              key={item._id}
              className="w-[350px] h-[400px] m-4 flex flex-col bg-white justify-between rounded-xl overflow-hidden shadow-lg"
            >
              <div className="w-full h-48">
                <img
                  src={item.image} // Ensure `item.image` contains the correct URL
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="px-6 pt-4">
                <div className="font-bold text-xl mb-2">{item.name}</div>
                <p className="text-gray-700">
                  {item.description.length > 75
                    ? `${item.description.substring(0, 75)}...`
                    : item.description}
                </p>
                <p className="text-gray-700 font-bold mt-2">
                  Price: £{item.price}
                </p>
              </div>
              <div className="px-6 pt-4 pb-6 flex justify-between">
                <span className="inline-flex bg-orange-400 rounded-full w-max h-8 items-center justify-center px-3 text-sm font-semibold text-white mr-2">
                  Points: {item.points}
                </span>
                <div className="flex">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-full"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Render this message if no products are available
        <div className="text-center mt-10">
          <h3 className="text-xl font-semibold text-gray-700">
            No Products to show
          </h3>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
