import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthRoute = ({ children }) => {
	const { isLoggedIn, user } = useAuth();

	console.log(isLoggedIn, '##');

	if (
		isLoggedIn &&
		user &&
		user?.subscriptionId &&
		user?.subscriptionId.active === false
	) {
		return (
			<div className='relative'>
				<div className='absolute top-[85px] left-0 w-full h-full bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm z-50'></div>

				<div className='relative z-10 overflow-hidden'>{children}</div>
			</div>
		);
	} else {
		if (!isLoggedIn) {
			return <Navigate to='/' />;
		}

		return children;
	}
};

export default AuthRoute;
