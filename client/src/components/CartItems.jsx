import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import axiosClient from '../utils/axios.config';
import { useAuth } from '../contexts/AuthContext';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

const getCartItems = async (id) => {
	try {
		const { data } = await axiosClient.get(`/cart`, {
			params: {
				userId: id,
			},
		});

		return data;
	} catch (error) {
		console.log(error);
	}
};

const CartItems = () => {
	const [products, setProducts] = useState([]);
	const { user } = useAuth();
	const [totalPoints, settotalPoints] = useState(0);

	const fetchProducts = useCallback(() => {
		getCartItems(
			user?.type === 'team' ? user?.additionalData?._id : user?._id,
		).then((response) => {
			setProducts(response.cartItems);
			settotalPoints(
				response.cartItems.reduce(
					(acc, item) => acc + item.quantity * item.productId.points,
					0,
				),
			);
		});
	}, [user?._id, user?.additionalData?._id, user?.type]);

	const handleDelete = async (id) => {
		try {
			await axiosClient
				.delete(`/cart/removeFromCart`, {
					params: {
						id,
					},
				})
				.then((res) => {
					toast.success(res.data.msg, {
						position: 'top-center',
						autoClose: 3000,
						closeOnClick: true,
						draggable: true,
					});
					fetchProducts();
				});
		} catch (error) {
			console.log(error);
		}
	};

	const handleCheckout = async () => {
		try {
			await axiosClient
				.post(`/order/newOrder`, {
					items: products.map((item) => item._id),
					buyer: user?.type === 'team' ? user?.teamId : user?._id,
					seller:
						user?.type === 'member'
							? user?.teamId
								? user?.teamId
								: user?.tocId
							: products[0]?.productId.owner,
				})
				.then((res) => {
					toast.success(res.data.msg, {
						position: 'top-center',
						autoClose: 3000,
						closeOnClick: true,
						draggable: true,
					});
					fetchProducts();
				});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return (
		<div className='col-span-4'>
			<div className='flex justify-between items-center py-4 sticky top-0 bg-white'>
				<h2 className='text-2xl font-bold'>Cart</h2>
				{!!totalPoints && (
					<>
						<span className='text-xl font-bold text-black'>
							Total Points: {totalPoints}
						</span>
						<button
							className='bg-blue-500 px-4 py-2 rounded-full text-lg text-white font-[500]'
							onClick={handleCheckout}
						>
							Checkout
						</button>
					</>
				)}
			</div>

			<div className='flex flex-wrap'>
				{products.length ? (
					products.map((item) => (
						<div
							key={item.productId._id}
							className='w-[350px] h-[388px] m-4 flex flex-col bg-white justify-between rounded-xl overflow-hidden shadow-lg'
						>
							<div>
								<img
									src={item.productId.image}
									alt={item.productId.name}
									className='w-full h-48 object-cover'
								/>
								<div className='px-6 pt-4'>
									<div className='font-bold text-xl mb-2'>
										{item.productId.name}
									</div>
									<p className='text-gray-700'>
										{item.productId.description.length > 75
											? `${item.productId.description.substring(0, 75)}...`
											: item.productId.description}
									</p>
								</div>
							</div>
							<div className='px-6 pt-4 pb-6 flex justify-between'>
								<span className='inline-flex bg-orange-400 rounded-full w-max h-8 items-center justify-center px-3 text-sm font-semibold text-white mr-2'>
									Points: {item.productId.points}
								</span>
								<div className='flex'>
									<div className='flex items-center bg-blue-500 rounded-full h-full'>
										<span className='w-[40px] text-center h-full bg-blue-500 rounded-full text-white font-bold flex items-center justify-center focus:outline-none'>
											{item.quantity}
										</span>
										<button
											onClick={() => handleDelete(item._id)}
											className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-full'
										>
											<MdDelete size={20} />
										</button>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className='w-full h-full flex items-center justify-center text-2xl font-bold'>
						No items in cart
					</div>
				)}
			</div>
		</div>
	);
};

export default CartItems;
