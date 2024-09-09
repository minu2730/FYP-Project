import axios from 'axios';

let configDefault = () => {
	return {
		responseType: 'json',
		transformRequest: [
			function (data) {
				return data;
			},
		],
		transformResponse: [
			function (data) {
				return data;
			},
		],
	};
};

const axiosClient = axios.create({
	baseURL: 'http://localhost:3001',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Cache-Control': 'no-cache',
	},
	...configDefault,
});

axiosClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token === null) return config;

		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosClient.interceptors.response.use(
	(response) => {
		if (response.data.message) {
			console.log(response.data.message);
		}
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
		}

		if (error.response?.data?.length > 0) {
			error.response?.data?.forEach((message) => console.error(message));
		} else if (error.response?.data?.message) {
			console.error(error.response.data.message);
		} else if (error.message) {
			console.error(error.message);
		} else if (error.response?.data?.error) {
			console.error(error.response.data.error);
		}

		throw error;
	},
);
export default axiosClient;
