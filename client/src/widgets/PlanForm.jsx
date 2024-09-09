import { useFormik } from 'formik';
import axiosClient from './../utils/axios.config';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';

const formSchema = yup.object({
	joinAs: yup.string().oneOf(['team', 'company']),
	name: yup.string(),
	companyWebsite: yup.string(),
	companyAddress: yup.string(),
	teamParentComany: yup.string(),
	compensationLevel: yup.string(),
});

const PlanForm = ({ onSubmit }) => {
	const { user, refetchUser } = useAuth();
	const [allCompanies, setAllCompanies] = useState([]);
	const [compansationLevels, setCompansationLevels] = useState([]);

	const getAllCompanies = async () => {
		await axiosClient
			.get('/company/getAllCompanies')
			.then((response) => {
				setAllCompanies(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		getAllCompanies();
	}, []);

	const formik = useFormik({
		initialValues: {
			type: 'team',
			name: '',
			companyWebsite: '',
			companyAddress: '',
			teamParentComany: '',
			compensationLevel: '',
		},
		validationSchema: formSchema,
		onSubmit: async (values) => {
			await axiosClient
				.post(
					`/${values.type}/add${
						values.type.charAt(0).toUpperCase() + values.type.slice(1)
					}`,
					{ ...values, userId: user?._id },
				)
				.then((response) => {
					toast.success(response.data.msg, {
						position: 'top-center',
						autoClose: 3000,
						closeOnClick: true,
						draggable: true,
					});

					refetchUser();
					onSubmit();
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

	useEffect(() => {
		if (formik.values.teamParentComany.length) {
			axiosClient
				.get(`/user/getCompansationLevels/`, {
					params: {
						tocId: formik.values.teamParentComany,
					},
				})
				.then((response) => {
					setCompansationLevels(response.data.levels);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			setCompansationLevels([]);
		}
	}, [formik.values.teamParentComany]);

	return (
		<form onSubmit={formik.handleSubmit}>
			<div className='bg-white shadow-md rounded-2xl border-orange-300 border-2 p-8 max-w-md mx-auto'>
				<h2 className='text-center text-2xl font-bold mb-6'>Join Form</h2>
				<div className='mb-4'>
					<p className='text-gray-700 font-bold mb-2'>Join as:</p>
					<label className='inline-flex items-center'>
						<input
							type='radio'
							name='type'
							value='team'
							checked={formik.values.type === 'team'}
							onChange={formik.handleChange}
							className='form-radio'
						/>
						<span className='ml-2'>Team</span>
					</label>
					<label className='inline-flex items-center ml-6'>
						<input
							type='radio'
							name='type'
							value='company'
							checked={formik.values.type === 'company'}
							onChange={formik.handleChange}
							className='form-radio'
						/>
						<span className='ml-2'>Company</span>
					</label>
				</div>

				{/*  */}
				{formik.values.type === 'team' ? (
					<div className='mb-4'>
						<label
							className='block text-gray-700 font-bold mb-2 mt-6'
							htmlFor='name'
						>
							Team Name
						</label>
						<input
							type='text'
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							placeholder='Enter team Name'
							required
						/>
						<label
							className='block text-gray-700 font-bold mb-2 mt-6'
							htmlFor='teamParentComany'
						>
							Company
						</label>
						<select
							className='border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-500 w-full'
							onChange={formik.handleChange}
							name='teamParentComany'
							value={formik.values.teamParentComany}
						>
							<option value=''>Select Company</option>
							{allCompanies?.map((company) => (
								<option key={company._id} value={company._id}>
									{company.name}
								</option>
							))}
						</select>

						{!!compansationLevels.length && (
							<>
								<label
									className='block text-gray-700 font-bold mb-2 mt-6'
									htmlFor='compensationLevel'
								>
									Compansation Level
								</label>
								<select
									className='border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-500 w-full'
									onChange={formik.handleChange}
									name='compensationLevel'
									value={formik.values.compensationLevel}
									required
								>
									<option value=''>Select Level</option>
									{compansationLevels?.map((level) => (
										<option key={level} value={level} className='capitalize'>
											{level.replace('_', ' ')}
										</option>
									))}
								</select>
							</>
						)}
					</div>
				) : (
					<div className='mb-4'>
						<label
							className='block text-gray-700 font-bold mb-2 mt-6'
							htmlFor='CompanyDetails'
						>
							Company Name
						</label>
						<input
							type='text'
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							placeholder='Enter company Name'
						/>
						<label
							className='block text-gray-700 font-bold mb-2 my-2'
							htmlFor='companyDetails'
						>
							Company URL
						</label>
						<input
							type='text'
							name='companyWebsite'
							onChange={formik.handleChange}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							value={formik.values.companyWebsite}
							placeholder='Enter company url'
						/>
						<label
							className='block text-gray-700 font-bold mb-2 my-2'
							htmlFor='companyDetails'
						>
							Company Address
						</label>
						<input
							type='text'
							name='companyAddress'
							value={formik.values.companyAddress}
							onChange={formik.handleChange}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							placeholder='Enter company Address'
						/>
					</div>
				)}
				<div className='text-center w-full mt-10'>
					<button
						className='bg-blue-600 text-white p-3 w-40 rounded-lg'
						type='submit'
						value='Done'
					>
						Submit
					</button>
				</div>
			</div>
		</form>
	);
};

export default PlanForm;
