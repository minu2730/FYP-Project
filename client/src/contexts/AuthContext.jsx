import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axios.config';
import { useLocalStorage } from 'react-use';

const AuthContext = createContext();

const getUserDetails = async () => {
	try {
		const { data } = await axiosClient.get(`/auth/me`);
		return data;
	} catch (error) {
		console.log(error);
	}
};

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [user, setUser] = useLocalStorage('user', null);

	const refetchUser = useCallback(() => {
		if (!user?._id) return;
		getUserDetails(user?._id).then((response) => {
			localStorage.setItem('user', JSON.stringify(response?.user));
			setUser(response.user);
		});
	}, [user?._id, setUser]);

	useEffect(() => {
		if (!user?._id) return;
		refetchUser();
	}, [refetchUser, user?._id]);

	const handleLogin = useCallback(
		async (shouldNavigate, ...data) => {
			const localData = data[0];

			getUserDetails(localData._id).then((response) => {
				localStorage.setItem('user', JSON.stringify(response.user));
				setUser(response.user);
				if (shouldNavigate) {
					if (response.user?.isAdmin) {
						navigate('/admin');
					} else if (response.user?.type === 'member') {
						navigate('/user');
					} else if (response.user?.type === 'team') {
						navigate('/team');
					} else if (response.user?.type === 'company') {
						navigate('/company');
					}
				}
			});
		},
		[navigate, setUser],
	);


	const handleLogout = useCallback(() => {
		navigate('/login');
		setUser(null);
		localStorage.removeItem('user');
		localStorage.removeItem('token');
	}, [navigate, setUser]);

	const data = useMemo(
		() => ({
			user,
			isLoggedIn: Boolean(user),
			handleLogin,
			handleLogout,
			refetchUser,
		}),
		[user, handleLogout, refetchUser, handleLogin],
	);

	return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
