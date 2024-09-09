import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axiosClient from '../utils/axios.config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyAccountForm = ({ onSubmit }) => {
	const [isSignupSuccess, setIsSignupSuccess] = useState(false);
	const navigate = useNavigate();
	const { handleLogin } = useAuth();

	const codeSchema = yup.object({
		verificationCode: yup
			.string()
			.min(8, 'Must be at least 3 characters long')
			.max(8, 'Must be 15 characters or less')
			.required('Name is required'),
		userId: yup.string(),
	});

	const handleFormSubmit = async (values) => {
		await axiosClient
			.put('/auth/verifyAccount', values)
			.then((response) => {
				localStorage.setItem('token', response.data.token);
				setIsSignupSuccess(true);
				handleLogin(false, response.data.user, false);
				onSubmit();
        localStorage.removeItem('id');
				toast.success(response.data.msg, {
					position: 'top-center',
					autoClose: 3000,
					closeOnClick: true,
					draggable: true,
				});
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

	const formik = useFormik({
		initialValues: {
			verificationCode: '',
			userId: localStorage.getItem('id'),
		},
		validationSchema: codeSchema,
		onSubmit: handleFormSubmit,
	});

	useEffect(() => {
		if (isSignupSuccess) {
			const timeout = setTimeout(() => {
				navigate('/');
			}, 3000); // Delay of 3 seconds

			return () => clearTimeout(timeout);
		}
	}, [isSignupSuccess, navigate]);

	return (
		<form className='m-0'>
			<div className='bg-white shadow-md rounded-2xl border-orange-300 border-2 p-8 mb-4 max-w-md mx-auto my-2'>
				<h2 className='text-center text-2xl font-bold mb-6'>
					Account Verification
				</h2>
				<div>
					<div className='mb-4'>
						<div className='flex justify-between align-middle'>
							<label
								className='block text-gray-700 text-md font-bold mb-2'
								htmlFor='verificationCode'
							>
								Verification Code
							</label>
							{formik.touched.verificationCode &&
							formik.errors.verificationCode ? (
								<p className='text-red-500 text-sm'>{formik.errors.name}</p>
							) : null}
						</div>
						<input
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							label='verificationCode'
							type='text'
							id='verificationCode'
							placeholder='Enter code'
							value={formik.values.verificationCode}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</div>
					<div className='flex items-center justify-center mt-10'>
						<button
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline'
							onClick={(e) => {
								e.preventDefault();
								handleFormSubmit(formik.values);
							}}
						>
							Verify
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default VerifyAccountForm;
