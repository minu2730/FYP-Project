import { useEffect, useState } from 'react';
import axiosClient from '../utils/axios.config';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
	const [teamsData, setTeamsData] = useState([]);
	const { user } = useAuth();

	useEffect(() => {
		const fetchCompanyData = async () => {
			try {
				const response = await axiosClient.get(
					`/company/getTeamsDetails/${user?.additionalData._id}`,
				);
				setTeamsData(response.data.teams);
			} catch (error) {
				console.error('Error fetching company data:', error);
			}
		};

		fetchCompanyData();
	}, [user?.additionalData._id]);
	return (
		<div className='col-span-4'>
			<div className='my-6 font-extrabold'>
				<h2 className='text-xl font-extrabold'>Teams</h2>
			</div>

			<table className='w-full'>
				<thead className='text-sm text-gray-700 uppercase bg-slate-300  top-[150px]'>
					<tr className='text-left'>
						<th className='px-2 py-4 text-center'>Team</th>
						<th className='px-2 py-4 text-center'>Owner</th>
						<th className='px-2 py-4 text-center'>Owner Level</th>
						<th className='px-2 py-4 text-center'>Members</th>
						<th className='px-2 py-4 text-center'>Total Sale</th>
					</tr>
				</thead>
				<tbody>
					{teamsData?.map((team, index) => (
						<tr
							key={team._id}
							className={`'text-left ${
								index % 2 === 0 ? 'bg-white' : 'bg-slate-100'
							} border-b-2 border-slate-400'`}
						>
							<td className='px-2 py-4 text-center'>{team.name}</td>
							<td className='px-2 py-4 text-center'>{team.userId.name}</td>
							<td className='px-2 py-4 text-center capitalize'>
								{team.userId.compensationLevel.replace('_', ' ')}
							</td>
							<td className='px-2 py-4 text-center'>{team.members?.length}</td>
							<td className='px-2 py-4 text-center'>{team.userId?.totalSale}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Home;
