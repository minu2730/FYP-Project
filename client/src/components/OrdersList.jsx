import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import axiosClient from '../utils/axios.config';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { LuArrowRightFromLine } from 'react-icons/lu';
import OrderDetails from './OrderDetails';

const getOrders = async (userId, accessor, sellerType, buyerType) => {
	const { data } = await axiosClient.get(`/order`, {
		params: {
			userId,
			accessor,
			sellerType,
			buyerType,
		},
	});

	return data;
};

const OrdersList = ({ accessor = 'buyer' }) => {
	const [orders, setOrders] = useState([]);
	const { user } = useAuth();
	const [viewType, setViewType] = useState('list');

	const sellerType =
		accessor === 'buyer'
			? user?.type === 'team'
				? 'company'
				: 'team'
			: user?.type;

	const buyerType =
		accessor === 'buyer'
			? user?.type === 'team'
				? 'team'
				: 'user'
			: user?.type === 'team'
			? 'user'
			: 'team';

	const fetchOrders = useCallback(async () => {
		try {
			getOrders(
				accessor === 'seller'
					? user?.type === 'team'
						? user?.teamId
						: user?.additionalData._id
					: user?.type === 'team'
					? user?.teamId
					: user?._id,
				accessor,
				sellerType,
				buyerType,
			).then((response) => {
				setOrders(response.orders);
			});
		} catch (error) {
			console.log(error);
		}
	}, [
		user?._id,
		accessor,
		user?.type,
		user?.additionalData?._id,
		user?.teamId,
		buyerType,
		sellerType,
	]);

	const handleFullfill = async (id, points) => {
		try {
			await axiosClient
				.put(`/order/fullfill/${id}`, {
					points,
				})
				.then((res) => {
					fetchOrders();
					toast.success(res.data.msg, {
						position: 'top-center',
						autoClose: 3000,
						closeOnClick: true,
						draggable: true,
					});
					fetchOrders();
				});
		} catch (error) {
			console.log(error);
		}
	};

	const handlePaymentConfirmation = async (id) => {
		try {
			await axiosClient.put(`/order/confirmPayment/${id}`).then((res) => {
				fetchOrders();
				toast.success(res.data.msg, {
					position: 'top-center',
					autoClose: 3000,
					closeOnClick: true,
					draggable: true,
				});
				fetchOrders();
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	return (
		<div className='col-span-4 flex flex-col gap-8'>
			{viewType === 'list' && (
				<>
					<div className='flex justify-between items-center py-4 sticky top-[85px] bg-white'>
						<h2 className='text-2xl font-bold'>Orders</h2>
					</div>
					<div className='flex flex-wrap'>
						{/* make table of 4 cols, with title buyer, Totalpoints, actions, viewDetails */}
						<table className='w-full'>
							<thead className='text-lg text-gray-700 uppercase bg-slate-300 sticky top-[150px]'>
								<tr className='text-left'>
									<th className='px-2 py-4 text-center'>
										{accessor === 'buyer' ? 'Seller' : 'Buyer'}
									</th>
									<th className='px-2 py-4 text-center'>Level</th>
									<th className='px-2 py-4 text-center'>Total Points</th>
									{accessor !== 'buyer' && (
										<th className='px-2 py-4 text-center'>Actions</th>
									)}
									<th className='px-2 py-4 text-center'>View Details</th>
								</tr>
							</thead>

							<tbody>
								{!!orders?.length &&
									orders.map((item, index) => (
										<>
											<tr
												key={item._id}
												className={`'text-left ${
													index % 2 === 0 ? 'bg-white' : 'bg-slate-100'
												} border-b-2 border-slate-400'`}
											>
												<td className='px-2 py-4 text-center'>
													{accessor === 'buyer' ? item.seller : item.buyer}
												</td>
												<td className='px-2 py-4 text-center capitalize'>

													{accessor === 'buyer'
														? item.sellerCompensationLevel?.replace('_', ' ')
														: item.buyerCompensationLevel?.replace('_', ' ')}
														{accessor === 'buyer'
															? ' (' + item.sellerType + ') '
															: ' (' + item.buyerType + ') '}
												</td>
												<td className='px-2 py-4 text-center'>
													{item.totalPoints}
												</td>

												{accessor !== 'buyer' && (
													<td className='px-2 py-4 text-center flex gap-3 items-center justify-center'>
														<button
															className={`px-3 py-2 rounded-lg text-sm text-white font-[500]
											${
												item.fullfilled
													? 'bg-green-500 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-500'
													: 'bg-yellow-500 hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-yellow-500'
											}
												`}
															onClick={() =>
																handleFullfill(item._id, item.totalPoints)
															}
															disabled={
																item.fullfilled || !item.paymentConfirmed
															}
														>
															{item.fullfilled ? 'Fullfilled' : 'Fullfill'}
														</button>
														<button
															className={`px-3 py-2 rounded-lg text-sm text-white font-[500]
											${
												item.paymentConfirmed
													? 'bg-green-500 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-500'
													: 'bg-purple-500 hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-purple-500'
											}
												`}
															onClick={() =>
																handlePaymentConfirmation(item._id)
															}
															disabled={item.paymentConfirmed}
														>
															{item.paymentConfirmed
																? 'Payment Confirmed'
																: 'Confirm Payment'}
														</button>
													</td>
												)}
												{console.log(
													item.fullfilled || !item.paymentConfirmed,
													'$$$$$$$$$$',
													item.totalPoints,
												)}
												<td className='px-2 py-4 text-center bg'>
													<button
														className='bg-orange-500 px-3 py-2 rounded-lg text-sm text-white font-[500] hover:bg-orange-600'
														onClick={() => setViewType(item._id)}
													>
														<LuArrowRightFromLine size={20} />
													</button>
												</td>
											</tr>
										</>
									))}
							</tbody>
						</table>
					</div>
				</>
			)}

			{viewType !== 'list' && (
				<OrderDetails
					orderId={viewType}
					setViewType={() => setViewType('list')}
					sellerType={sellerType}
					buyerType={buyerType}
				/>
			)}
		</div>
	);
};

export default OrdersList;
