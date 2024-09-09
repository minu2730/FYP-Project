import React from 'react';
import prodImg from "../assets/logo.png";
import { AddShoppingCart } from '@mui/icons-material';

const ProductCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 transform transition duration-500 ease-in-out hover:scale-105 active:scale-95">
      <img
        src={prodImg}
        alt="Product"
        className="w-full h-40 object-container rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">Product Name</h3>
      <p className="text-gray-500 text-sm mb-2">Product Description</p>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <span className="text-lg font-bold text-blue-500 mb-2 sm:mb-0 sm:mr-4">$19.99</span>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <AddShoppingCart />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;