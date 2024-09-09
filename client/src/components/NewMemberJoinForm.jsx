import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import PhoneInput from 'react-phone-number-input/input';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axiosClient from './../utils/axios.config';
import { toast } from 'react-toastify';
import { useState } from 'react';
import VerifyAccountModal from './VerifyAccountModal';

const NewMemberJoinForm = () => {
	// fetch the sponser id from the url
	const [isVerifyModalOpen, setisVerifyModalOpen] = useState(false);
	const params = new URLSearchParams(window.location.search);
	let sponserId, tocId, teamId;
	sponserId = params.get('sponserId');
	tocId = params.get('tocId'); // Make sure to use the correct parameter name
	teamId = params.get('teamId');

	const userSchema = yup.object({
		name: yup
			.string()
			.min(3, 'Must be at least 3 characters long')
			.max(15, 'Must be 15 characters or less')
			.required('Required field'),
		email: yup
			.string()
			.email('Email is invalid')
			.matches(
				/^[a-zA-Z0-9 ]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
				'Must be a valid email',
			)
			.required('Required field'),
		password: yup
			.string()
			.min(8, 'Password must be at least 8 characters')
			.required('Required field')
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/,
				'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
			),
		// id card number
		idCardNum: yup
			.string()
			.min(8, 'must be at least 8 characters')
			.required('required'),
		// address
		address: yup.string().required('Required field'),
		// phone number
		phoneNum: yup
			.string()
			.min(10, 'must be at least 10 characters')
			.required('Required field'),
		// sponser id
		sponserId: yup.string().min(8, 'Password must be at least 8 characters'),
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			password: '',
			idCardNum: '',
			address: '',
			phoneNum: '+92',
			sponserId: sponserId || '',
		},
		validationSchema: userSchema,
		onSubmit: async (values) => {
			await axiosClient
				.post('/member/addMember', { ...values, tocId, teamId })
				.then((response) => {
					toast.success(response.data?.msg, {
						position: 'top-center',
						autoClose: 3000,
						closeOnClick: true,
						draggable: true,
					});
					localStorage.setItem('id', response.data.user?._id);
					setisVerifyModalOpen(true);
				})
				.catch((error) => {
					toast.error(error.response.data.msg, {
						position: 'top-center',
						autoClose: 3000,
						closeOnClick: true,
						draggable: true,
					});
				});
		},
	});

	return (
		<div className='h-full'>
			<Navbar isLoginPage={true} />
			<div className='flex flex-1 pt-32 items-center justify-center'>
				<form
					onSubmit={formik.handleSubmit}
					className='flex w-100  flex-col gap-6 items-center justify-center bg-slate-300 rounded-lg p-8 w-[500px]'
				>
					<div className='w-full flex flex-col gap-2 items-end'>
						{formik.touched.name && formik.errors.name ? (
							<p className='text-red-500 text-lg text-bold'>
								{formik.errors.name}
							</p>
						) : null}
						<input
							className='shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg'
							label='Name'
							type='text'
							id='name'
							placeholder='Name'
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</div>
					<div className='w-full flex flex-col gap-2 items-end'>
						{formik.touched.email && formik.errors.email ? (
							<p className='text-red-500 text-lg text-bold'>
								{formik.errors.email}
							</p>
						) : null}
						<input
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							label='Email'
							type='text'
							id='email'
							placeholder='Email'
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</div>

					<div className='w-full flex flex-col gap-2 items-end'>
						{formik.touched.idCardNum && formik.errors.idCardNum ? (
							<p className='text-red-500 text-lg text-bold'>
								{formik.errors.idCardNum}
							</p>
						) : null}
						<input
							type='text'
							placeholder='ID Card Number'
							name='idCardNum'
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							value={formik.values.idCardNum}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</div>

					<div className='w-full flex flex-col gap-2 items-end'>
						{formik.touched.address && formik.errors.address ? (
							<p className='text-red-500 text-lg text-bold'>
								{formik.errors.address}
							</p>
						) : null}

						<PhoneInput
							country='PK'
							placeholder='Enter phone number'
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							value={formik.values.phoneNum}
							// onChange={formik.handleChange}
							onChange={(e) => formik.setFieldValue('phoneNum', e)}
							// onBlur={formik.handleBlur}
							required
							smartCaret
						/>
					</div>

					<div className='w-full flex flex-col gap-2 items-end'>
						{formik.touched.address && formik.errors.address ? (
							<p className='text-red-500 text-lg text-bold'>
								{formik.errors.address}
							</p>
						) : null}
						<input
							type='text'
							placeholder='Address'
							name='address'
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							value={formik.values.address}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</div>
					<div className='w-full flex flex-col gap-2 items-end'>
						{formik.touched.password && formik.errors.password ? (
							<p className='text-red-500 text-lg text-bold'>
								{formik.errors.password}
							</p>
						) : null}
						<input
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							label='Password'
							type='password'
							id='password'
							placeholder='Password'
							value={formik.values.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</div>
					<input
						type='text'
						placeholder='Sponser ID (optional)'
						name='sponserId'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						value={formik.values.sponserId}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						required
					/>
					<button type='submit' className='bg-green-500 text-white p-2 w-full'>
						Join Now
					</button>
				</form>
			</div>

			<VerifyAccountModal
				isModalOpen={isVerifyModalOpen}
				setIsModalOpen={setisVerifyModalOpen}
			/>
			<Footer />
		</div>
	);
};

export default NewMemberJoinForm;
