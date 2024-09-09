import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const JoinRef = () => {
	const { user } = useAuth();

	const sponserId = user?._id ? `sponserId=${user?._id}` : '';
	const tocId = `tocId=${user?.tocId}`;
	const type = user?.type ? `type=${user?.type}` : '';
	const teamId =
		user?.type === 'team' || user?.type === 'member'
			? `teamId=${user?.teamId}`
			: '';

	const queryParams = [sponserId, tocId, type, teamId]
		.filter(Boolean)
		.join('&&');
	const val = `http://localhost:5173/memberJoin?${queryParams}`;

	return (
		<div className='max-w-md mx-auto p-8'>
			<h1 className='text-2xl font-bold mb-4'>
				Referral Joining Link Generator
			</h1>

			<div className='mb-4'>
				<label
					htmlFor='referralCode'
					className='block text-gray-700 font-bold mb-2'
				>
					Joining Link:
				</label>
				<input
					type='text'
					id='referralCode'
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					value={val}
					placeholder='Enter referral code'
					readOnly
				/>
				{/* add button to copy value to clipboard */}
				<button
					className='bg-green-500 hover:bg-green-700 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					onClick={() => {
						navigator.clipboard.writeText(val);
						toast.success('Copied to clipboard', {
							position: 'top-center',
							autoClose: 3000,
							closeOnClick: true,
							draggable: true,
						});
					}}
				>
					Copy
				</button>
			</div>
		</div>
	);
};

export default JoinRef;
