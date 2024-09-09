import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import loginpic from '../assets/loginpic.png';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../utils/axios.config';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import VerifyAccountModal from '../components/VerifyAccountModal';
import { Link } from 'react-router-dom';
// import GoogleSignIn from "../components/GoogleSignIn";

const Login = () => {
	const [type, setType] = useState('member');
	const { handleLogin } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isVerifyModalOpen, setisVerifyModalOpen] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};
	// Function to handle regular login
	const submitHandler = async (e) => {
		e.preventDefault();

		await axiosClient
			.post('/auth/login', {
				email,
				password,
				type,
			})
			.then((response) => {
				handleLogin(true, response.data.user);
				localStorage.setItem('token', response.data.token);
				toast.success('Login Successful', {
					position: 'top-center',
					autoClose: 3000,
					closeOnClick: true,
					draggable: true,
				});
			})
			.catch((error) => {
				if (error.response.status === 409) {
					setisVerifyModalOpen(true);
					localStorage.setItem('id', error.response.data.user?._id);
				}
				toast.error(error.response.data.msg, {
					position: 'top-center',
					autoClose: 5000,
					closeOnClick: true,
					draggable: true,
				});
			});
	};

	//fuction to handle google sign in response
	const handleGoogleSignIn = (googleEmail) => {
		//use the same login function as above but with googleEmail

		console.log('Google Sign-In successful. Email:', googleEmail);
	};

	return (
		<>
			<Navbar isLoginPage={true} />
			<form
				onSubmit={submitHandler}
				className="flex flex-col min-h-screen justify-center items-center"
			>
				<div className='w-full max-w-md shadow-2xl rounded-xl text-center hover:shadow-2xl transition-shadow duration-500 p-5'>
					<img
						src={loginpic}
						alt=''
						className='rounded-full w-32 h-32 mx-auto'
					/>
					<div className='flex flex-col items-center justify-center'>
						<TextField
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-4/5 my-2'
							name='email'
							id='email'
							label='Email '
							variant='standard'
						/>
						<TextField
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-4/5 my-2'
							name='password'
							id='password'
							label='Password '
							variant='standard'
							type={showPassword ? 'text' : 'password'}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={toggleShowPassword}>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<div className='w-full flex items-end justify-end pr-10 pb-4'>
							<a href='/forget-password'>Forgot password?</a>
						</div>
						<div className='flex items-center justify-center my-2'>
							<input
								onChange={() => setType('member')}
								className='m-2'
								type='radio'
								name='userType'
								value='member'
								checked={type === 'member'}
							/>
							<label htmlFor=''>Member</label>
							<input
								onChange={() => setType('team')}
								className='m-2'
								type='radio'
								name='userType'
								value='team'
								checked={type === 'team'}
							/>
							<label htmlFor=''>Team</label>
							<input
								onChange={() => setType('company')}
								className='m-2'
								type='radio'
								name='userType'
								value='company'
								checked={type === 'company'}
							/>
							<label htmlFor=''>Company</label>
						</div>

						<button
							className="w-4/5 my-2 transition-all bg-green-500 hover:bg-green-600 text-white py-3 text-center text-lg rounded"
							type='submit'
						>
							Login
						</button>

						<p className='mt-7'>
							Don't have an account?{' '}
							<Link to='/register' className='text-blue-500 hover:underline'>
								Sign up
							</Link>
						</p>

						{/* <GoogleSignIn onGoogleSignIn={handleGoogleSignIn} /> */}
					</div>
				</div>
				{/* <GoogleSignIn onGoogleSignIn={handleGoogleSignIn} userType={type} /> */}
			</form>
			<VerifyAccountModal
				isModalOpen={isVerifyModalOpen}
				setIsModalOpen={setisVerifyModalOpen}
			/>
		</>
	);
};

export default Login;







