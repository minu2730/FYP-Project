import { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';
import Products from '../components/Products';
import Team from '../components/Team';
import Training from '../components/Training';
import axios from 'axios';
import OrdersList from '../components/OrdersList';

const navigation = [
	{ id: '1', name: 'Home' },
	{ id: '2', name: 'Product' },
	{ id: '3', name: 'Orders' },
	{ id: '4', name: 'Training' },
];

const TeamDashboard = () => {
	const [navigate, setNavigator] = useState('1');
	const [teamData, setTeamData] = useState('');

	useEffect(() => {
		const teamId = localStorage.getItem('id');

		const fetchTeamData = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3001/team/${teamId}`,
				);
				setTeamData(response.data);
			} catch (error) {
				console.error('Error fetching team data:', error);
			}
		};

		fetchTeamData();
	}, []);

	const navigationHandler = (index) => {
		setNavigator(index);
	};

	return (
		<>
			<AdminNav name={teamData.teamName} />
			<div className='bg-white shadow-md rounded px-8 py-6 max-w-full mx-auto h-full text-black'>
				<div className='grid grid-cols-1 md:grid-cols-6 gap-10'>
					<div className='bg-white text-black shadow-md rounded  text-center md:col-span-1'>
						<div className=' flex flex-col gap-3  md:grid grid-rows-5 md:gap-20 my-10'>
							{navigation.map((nav) => (
								<div
									key={nav.id}
									id={nav.id}
									className={`cursor-pointer ${
										navigate === nav.id
											? 'text-orange-500 font-bold'
											: 'text-black'
									}`}
									onClick={() => navigationHandler(nav.id)}
								>
									<h2>{nav.name}</h2>
								</div>
							))}
						</div>
					</div>
					<div className='md:col-span-5'>
						{navigate === '1' && <Team />}
						{navigate === '2' && <Products />}
						{navigate === '3' && <OrdersList accessor='seller' />}
						{navigate === '4' && <Training />}
					</div>
				</div>
			</div>
		</>
	);
};

export default TeamDashboard;
