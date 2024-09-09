import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import axiosClient from '../utils/axios.config';
import { ArrowBack } from '@mui/icons-material';

const getOrderDetails = async (id, sellerType, buyerType) => {
	try {
		const { data } = await axiosClient.get(`/order/${id}`, {
			params: {
				sellerType,
				buyerType,
			},
		});

		return data;
	} catch (error) {
		console.log(error);
	}
};

const OrderDetails = ({ orderId, setViewType }) => {
	const [products, setProducts] = useState([]);
	const [totalPoints, setTotalPoints] = useState(0);

	const fetchProducts = useCallback(() => {
		getOrderDetails(orderId).then((response) => {
			setProducts(response.items);
			setTotalPoints(
				response.items.reduce(
					(acc, item) => acc + item.quantity * item.productId.points,
					0,
				),
			);
		});
	}, [orderId]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return (
		<div className='col-span-4'>
			<div className='flex items-center py-4 gap-96 sticky top-0 bg-white'>
				<div className='flex gap-5 items-center'>
					<button onClick={setViewType}>
						<ArrowBack />
					</button>
					<h2 className='text-2xl font-bold '>Order</h2>
				</div>
				{!!totalPoints && (
					<span className='text-xl font-bold text-black'>
						Total Points: {totalPoints}
					</span>
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
									<span className='text-center px-3 h-full bg-green-500 rounded-full text-white font-bold flex items-center justify-center focus:outline-none'>
										quantity: {item.quantity}
									</span>
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

export default OrderDetails;
