import { Box, Modal } from '@mui/material';
import { useState } from 'react';
import axiosClient from '../utils/axios.config';
import { toast } from 'react-toastify';
import { Add, Cancel, Edit } from '@mui/icons-material';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};

const AddSubscriptionModal = ({
	details,
	price,
	active,
	haveSubscription,
	id,
	onSubmit,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [localDetails, setDetails] = useState(details);
	const [localPrice, setPrice] = useState(price);

	const onClick = () => {
		axiosClient
			.post('/subscription/add', {
				details: localDetails,
				price: localPrice,
				userId: id,
			})
			.then((res) => {
				onSubmit();
				toast.success(res.data.msg, {
					position: 'top-center',
					autoClose: 3000,
					closeOnClick: true,
					draggable: true,
				});
				setIsModalOpen(false);
			})
			.catch((error) => {
				toast.error(error.response.data.msg, {
					position: 'top-center',
					autoClose: 3000,
					closeOnClick: true,
					draggable: true,
				});
			});
	};

	const onCancel = async () => {
		axiosClient
			.put('/subscription/cancel', {
				userId: id,
			})
			.then((res) => {
				onSubmit();
				toast.success(res.data.msg, {
					position: 'top-center',
					autoClose: 3000,
					closeOnClick: true,
					draggable: true,
				});
				setIsModalOpen(false);
			})
			.catch((error) => {
				toast.error(error.response.data.msg, {
					position: 'top-center',
					autoClose: 3000,
					closeOnClick: true,
					draggable: true,
				});
			});
	};

	return (
		<>
			<div className='flex gap-4'>
				<button
					className='text-lg font-bold hover:bg-blue-800 bg-blue-400 text-white flex items-center py-1 px-2 rounded-lg cursor-pointer'
					onClick={() => setIsModalOpen(true)}
				>
					{haveSubscription ? <Edit /> : <Add />}
				</button>
				{active && (
					<button
						onClick={onCancel}
						className='text-lg font-bold hover:bg-red-600 bg-red-400 text-white flex items-center py-1 px-2 rounded-lg cursor-pointer'
					>
						<Cancel />
					</button>
				)}
			</div>
			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box sx={style} className='rounded-2xl border-orange-400 border-2 p-8'>
					<form
						className='flex flex-col gap-5 w-full items-center'
						onSubmit={(e) => {
							e.preventDefault();
							onClick();
						}}
					>
						<h2 className='text-lg font-bold'>Subscription</h2>
						<div className='flex flex-col gap-2 w-full'>
							<label className='text-md text-black'>Details</label>
							<input
								required
								type='text'
								className='border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400'
								value={localDetails}
								onChange={(e) => setDetails(e.target.value)}
							/>
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<label className='text-md text-black'>Price</label>
							<input
								required
								type='number'
								min='0'
								className='border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400'
								value={localPrice}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>
						<button
							className='bg-blue-500 hover:bg-blue-700 mt-3 text-white font-bold py-2 px-4 rounded w-max focus:outline-none focus:shadow-outline'
							type='submit'
						>
							Submit
						</button>
					</form>
				</Box>
			</Modal>
		</>
	);
};

export default AddSubscriptionModal;
