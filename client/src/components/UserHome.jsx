import Box from '../widgets/Box';
import { useAuth } from '../contexts/AuthContext';

const UserHome = () => {
	const { user } = useAuth();
	return (
		<div className='col-span-4'>
			<div className='flex flex-col md:flex-row text-center gap-11 mx-auto'>
				<Box title='Down Members' number={user?.members?.length} />
				<Box title='Total Sale' number={user?.totalSale} />
				<Box title='Personal Income' number={user?.personalIncome} />
				<Box title='Downline Income' number={user?.downlineIncome} />
			</div>
		</div>
	);
};

export default UserHome;
