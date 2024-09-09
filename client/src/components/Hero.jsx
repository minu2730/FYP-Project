import Navbar from './Navbar';
import Button from '@mui/material/Button';
import Footer from './footer'
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background_image_white.jpg';

const Hero = () => {
	return (
		<>
			<div id='first' className='min-h-screen flex flex-col'>
				<Navbar />
				<div
					className='flex flex-col flex-1 items-center justify-center'
					style={{
						backgroundImage: `url(${backgroundImage})`,
						backgroundRepeat: 'repeat',
						width: '100%',
					}}
				>
					<div className='mb-4 p-4'>
						<h1
							className='font-bold text-4xl text-center md:text-center lg:text-6xl'
							style={{ color: 'orange' }}
						>
							<br /> <br />All in One Solution for your MLM Business
						</h1>
						<p
							className='my-8 text-lg leading-relaxed text-center md:text-center lg:text-2xl'
							style={{ color: 'orange' }}
						>
							Flow Team is the ultimate solution for managing your MLM business.
							Our innovative platform streamlines your operations, ensuring your
							success.
						</p>
					</div>
					<div
						className='shadow-lg transition-all duration-500 ease-in-out transform hover:shadow-2xl hover:shadow-orange-600 rounded-lg relative'
						style={{ width: '100%', maxWidth: '800px' }}
					>
						<iframe
							className='w-full'
							style={{ outline: 'none' }}
							height='460'
							src='https://www.youtube.com/embed/ZOoVOfieAF8?loop=1&playlist=ZOoVOfieAF8'
							title='YouTube video player'
							frameBorder='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
							allowfullscreen
						></iframe>
					</div>
					<div className='flex justify-center w-full pb-10 mt-4'>
						<Link to='/register'>
							<div className='bg-gradient-to-r from-orange-500 to-red-500 text-white border border-orange-700 rounded-full py-4 px-12 text-2xl font-bold transition-all duration-500 ease-in-out transform hover:from-red-500 hover:to-orange-500 active:from-orange-500 active:to-red-500 focus:outline-none focus:ring-4 focus:ring-orange-300 cursor-pointer'>
								Get Started
							</div>
						</Link>
					</div>
				</div>

				<div className='mt-8 bg-gray-100 p-8 rounded-lg shadow-lg mx-4'>
					<h2 className='text-2xl font-bold mb-4 text-[#f96d00]'>
						Why Flow Team?
					</h2>
					<p className='text-[#222831]'>
						Start your MLM management system For free enjoy all the incentives
						and benefits for business managements.
					</p>
				</div>
				<div className='mt-8 bg-gray-100 p-8 rounded-lg shadow-lg mx-4'>
					<h3 className='text-xl font-bold mb-2 text-[#f96d00]'>
						Additional Information:
					</h3>
					<p className='text-[#222831]'>
						You can solve all MLM related problems here.Change your life today
					</p>{' '}
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16 mx-4'>
					<div className='bg-gray-100 p-8 rounded-lg shadow-lg'>
						<h2 className='text-2xl font-bold mb-4'>Our Mission</h2>
						<p className='text-lg mb-4'>
							Our mission is to make MM industry more easy and reliable for all the we will provide the best solutio related to all managemen problems in MLM industry.
						</p>
						<Button
							style={{
								backgroundColor: '#28a745',
								color: '#fff',
								border: '1px solid #28a745',
							}}
							variant='contained'
							className='ml-4 rounded-full py-2 px-6 text-sm'
						>
							<Link to='/'>
								Learn More
							</Link>
						</Button>
					</div>
					<div className='bg-gray-100 p-8 rounded-lg shadow-lg'>
						<h2 className='text-2xl font-bold mb-4'>Our Vision</h2>
						<p className='text-lg mb-4'>
							We believe in providing the best services to our customers to manage their business in a better way.A digital platform for all your business needs to MLM industry can make this inudustry more reliable and easy to manage.
						</p>
						<Button
							style={{
								backgroundColor: '#28a745',
								color: '#fff',
								border: '1px solid #28a745',
							}}
							variant='contained'
							className='ml-4 rounded-full py-2 px-6 text-sm'
						>
							<Link to='/'>
								Learn More
							</Link>
						</Button>
					</div>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 mx-4'>
					<div className='bg-orange-100 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105'>
						<img
							src='https://cdn-icons-png.flaticon.com/512/3852/3852560.png'
							alt='dummy'
							className='mb-4 mx-auto'
							style={{
								borderRadius: '50%',
								width: '100px',
								height: '100px'
							}}
						/>
						<h3 className='text-lg font-bold mb-2'>Feature 1</h3>
						<p className='text-md'>
							Customize your compensation plan to fit your business needs. no matter you own a team or a company our solution is here for you.
						</p>
					</div>
					<div className='bg-orange-100 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105'>
						<img
							src='https://cdn-icons-png.flaticon.com/512/2857/2857523.png'
							alt='dummy'
							className='mb-4 mx-auto'
							style={{
								borderRadius: '50%',
								width: '100px',
								height: '100px'
							}}
						/>
						<h3 className='text-lg font-bold mb-2'>Feature 2</h3>
						<p className='text-md'>
							Manage all your team and Company business in one website no need for long excel sheets and complicated compansation plan calculation ! we will do it for you.
						</p>
					</div>
					<div className='bg-orange-100 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105'>
						<img
							src='https://cdn-icons-png.flaticon.com/512/1153/1153341.png'
							className='mb-4 mx-auto'
							style={{
								borderRadius: '50%',
								width: '100px',
								height: '100px'
							}}
						/>
						<h3 className='text-lg font-bold mb-2'>Feature 3</h3>
						<p className='text-md'>
							Customer your compensation plan ! even the time for Computation no time limit can stop you for achieveing the best recognition in your business ! 
						</p>
					</div>
				</div>
				<div id='outerlinks' className='text-center mt-8 mb-4 text-gray-500 mx-4'>
				</div>
			</div>
		</>
	);
};
export default Hero;
