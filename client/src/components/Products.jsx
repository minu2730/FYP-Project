import { useEffect, useState } from "react";
import axiosClient from "../utils/axios.config";
import { useAuth } from "../contexts/AuthContext";
import { MdDelete } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import EditProductsModal from "./EditProductsModal";
import { toast } from "react-toastify";
import AddProductsModal from "./AddProductsModal";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

const getProducts = async (id) => {
  try {
    const { data } = await axiosClient.get(`/product/getProducts/${id}`);
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const Products = ({ buyable = false }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const fetchProducts = async () => {
    const fetchedProducts = await getProducts(user?.tocId);
    setProducts(fetchedProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/product/deleteProduct`, {
        params: {
          id: id,
        },
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
  };

  const addToCart = async (id) => {
    try {
      await axiosClient.post(`/cart/addToCart`, {
        productId: id,
        quantity: quantity,
        userId: user?.type === "team" ? user?.additionalData._id : user?._id,
      });
      toast.success("Product added to cart successfully", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.msg || "Failed to add to cart", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="col-span-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        {!buyable &&
          ((user?.type === "team" && !user?.additionalData?.companyId) ||
            user?.type === "company") && (
            <AddProductsModal refetchProducts={fetchProducts} />
          )}
        {buyable && <AddPaymentMethodModal editable={false} />}
      </div>

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
              </p>{" "}
              {/* New section to display price */}
            </div>
            <div className="px-6 pt-4 pb-6 flex justify-between">
              <span className="inline-flex bg-orange-400 rounded-full w-max h-8 items-center justify-center px-3 text-sm font-semibold text-white mr-2">
                Points: {item.points}
              </span>
              <div className="flex">
                {buyable ? (
                  <div className="flex items-center bg-blue-500 rounded-full h-full">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="min-w-10 text-center h-full bg-blue-500 rounded-full pl-2 text-white font-bold focus:outline-none"
                    />
                    <button
                      className="bg-green-500 hover:bg-green-600 h-full text-white font-bold px-4 rounded-full"
                      onClick={() => addToCart(item._id)}
                    >
                      <FaShoppingCart size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <EditProductsModal
                      id={item._id}
                      prevName={item.name}
                      prevDescription={item.description}
                      prevPoints={item.points}
                      prevPrice={item.price} // Pass the price to the edit modal
                      prevImage={item.image}
                      refetchProducts={fetchProducts}
                    />
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-full"
                    >
                      <MdDelete size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
