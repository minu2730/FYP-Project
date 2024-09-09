import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import SubscriptionsTable from '../components/SubscriptionsTable';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const SuperAdminDashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user?.isAdmin) navigate('/user');
	}, [user, navigate]);

	return (
		<>
			<AdminNav name={'Admin Dashboard'} />
			<SubscriptionsTable />
		</>
	);
};

export default SuperAdminDashboard;
