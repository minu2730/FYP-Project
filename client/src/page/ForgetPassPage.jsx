import { useState } from 'react';
import axiosClient from '../utils/axios.config';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ForgetPassPage = () => {
  const [email, setEmail] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axiosClient.post('/auth/forget-password', { email });
			toast.success(res.data.msg, {
				position: 'top-center',
				autoClose: 3000,
				hideProgressBar: true,
				closeOnClick: true,
			});
		} catch (err) {
			toast.error(err.response.data.msg, {
				position: 'top-center',
				autoClose: 3000,
				hideProgressBar: true,
				closeOnClick: true,
			});
		}
		// setEmail('');
	};

	return (
		<>
			<Navbar isLoginPage={true} />
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="w-[400px] bg-white shadow-2xl rounded-xl text-center border-orange-400 border-2 hover:shadow-2xl transition-shadow duration-500 p-8">
					<h1 className="text-2xl font-medium text-slate-800 mb-6 drop-shadow-lg">
						Forgot Password
					</h1>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-6"
					>
						<input
							label="Email"
							className="p-3 border-2 border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
							placeholder="Email"
							type="email"
							id="email"
							value={email}
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
						<button
							type="submit"
							className="p-3 mt-4 text-md font-medium text-white bg-slate-600 border border-slate-600 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
						>
							Send Email
						</button>
					</form>
				</div>
			</div>
			
		</>
	);
};

export default ForgetPassPage;
