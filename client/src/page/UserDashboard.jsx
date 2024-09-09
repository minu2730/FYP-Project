import { useState } from 'react';
import AdminNav from '../components/AdminNav';
import UserHome from '../components/UserHome';
import JoinRef from '../components/JoinRef';
import Training from '../components/Training';
import Products from '../components/Products';
import CartItems from '../components/CartItems';
import OrdersList from '../components/OrdersList';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
	{ id: '1', name: 'Home' },
	{ id: '2', name: 'Join' },
	{ id: '3', name: 'Shop' },
	{ id: '4', name: 'Cart' },
	{ id: '5', name: 'Orders' },
	{ id: '6', name: 'Training' },
];

const UserAdmin = () => {
	const [navigate, setNavigator] = useState('1');
	const { user } = useAuth();

	const navigationHandler = (index) => {
		setNavigator(index);
	};

	return (
		<div>
			<AdminNav name='User 1' />
			<div className='bg-white shadow-md rounded px-8 py-6 max-w-full mx-auto h-full pb-16 text-black'>
				<div className='flex flex-col   md:grid grid-cols-6 gap-10'>
					<div className='bg-white text-black shadow-md rounded h-auto md:h-full text-center md:col-span-1'>
						<div className=' flex flex-col gap-3 md:grid grid-rows-5 md:gap-20 my-10 top-[143px]'>
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
					{navigate === '1' && (
						<>
							<div className='col-span-5'>
								<UserHome />
							</div>
						</>
					)}
					{navigate === '2' && (
						<div className='col-span-5'>
							{user?.compensationLevel !== 'preferred_customer' ? (
								<JoinRef />
							) : (
								<div className='w-full h-full flex items-center justify-center'>
									<h1 className='text-xl font-bold'>
										Preferred customer can`t add membres to their downline
									</h1>
								</div>
							)}
						</div>
					)}
					{navigate === '3' && (
						<div className='col-span-5'>
							{user?.type !== 'company' ? (
								<Products buyable />
							) : (
								<div className='w-full h-full flex items-center justify-center'>
									<h1 className='text-xl font-bold'>
										Company owner can't buy items
									</h1>
								</div>
							)}
						</div>
					)}
					{navigate === '4' && (
						<div className='col-span-5'>
							{user?.type !== 'company' ? (
								<CartItems />
							) : (
								<div className='w-full h-full flex items-center justify-center'>
									<h1 className='text-xl font-bold'>
										Company owner can't have cart items
									</h1>
								</div>
							)}
						</div>
					)}
					{navigate === '5' && (
						<div className='col-span-5'>
							{user?.type !== 'company' ? (
								<OrdersList />
							) : (
								<div className='w-full h-full flex items-center justify-center'>
									<h1 className='text-xl font-bold'>
										Company owner cannot have orders
									</h1>
								</div>
							)}
						</div>
					)}
					{navigate === '6' && (
						<>
							<div className='col-span-5'>
								<Training editable={false} />
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserAdmin;
