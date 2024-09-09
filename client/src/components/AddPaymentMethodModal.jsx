import { Box, Modal } from '@mui/material';
import { useState } from 'react';
import axiosClient from '../utils/axios.config';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

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

const AddPaymentMethodModal = ({ editable = true }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [bankName, setBankName] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [accountName, setAccountName] = useState('');
	const { user } = useAuth();

	const onClick = () => {
		axiosClient
			.post('/paymentDetails/add', {
				bankName: bankName,
				accountName: accountName,
				accountNumber: accountNumber,
				tocId: user?.tocId,
			})
			.then((res) => {
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

	useEffect(() => {
		axiosClient
		.get(`/paymentDetails/`, {
					params: {
						tocId: editable ? user?.additionalData?._id : user?.tocId,
					},
				})
				.then((response) => {
					setBankName(response.data.paymentDetails.bankName);
					setAccountNumber(response.data.paymentDetails.accountNumber);
					setAccountName(response.data.paymentDetails.accountName);
				})
				.catch((error) => {
					console.log(error);
				});
	}, [user?.additionalData?._id, user?.tocId, editable]);

	return (
		<>
			<button
				className='text-lg font-bold hover:bg-orange-800 hover:bg-opacity-20 py-2 px-4 rounded-lg cursor-pointer'
				onClick={() => setIsModalOpen(true)}
			>
				Payment Details
			</button>
			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box sx={style} className='rounded-2xl border-orange-400 border-2 p-8'>
					<form
						className='flex flex-col gap-5 w-full items-center'
						onSubmit={(e) => {
							e.preventDefault();
							onClick();
						}}
					>
						<div className='flex flex-col gap-2 w-full'>
							<label className='text-md text-black'>Bank Name</label>
							<input
								required
								type='text'
								className='border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400'
								value={bankName}
								onChange={(e) => setBankName(e.target.value)}
								readOnly={!editable}
							/>
						</div>

						<div className='flex flex-col gap-2 w-full'>
							<label className='text-md text-black'>Account Holder Name</label>
							<input
								required
								type='text'
								className='border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400'
								value={accountName}
								onChange={(e) => setAccountName(e.target.value)}
								readOnly={!editable}
							/>
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<label className='text-md text-black'>Account Number</label>
							<input
								required
								type='text'
								className='border-2 border-gray-300 p-2 w-full rounded-md outline-none focus:border-blue-400'
								value={accountNumber}
								onChange={(e) => setAccountNumber(e.target.value)}
								readOnly={!editable}
							/>
						</div>
						{editable && (
							<button
								className='bg-blue-500 hover:bg-blue-700 mt-3 text-white font-bold py-2 px-4 rounded w-max focus:outline-none focus:shadow-outline'
								type='submit'
							>
								Submit
							</button>
						)}
					</form>
				</Box>
			</Modal>
		</>
	);
};

export default AddPaymentMethodModal;
