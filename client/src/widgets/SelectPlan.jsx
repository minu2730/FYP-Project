import { useAuth } from "../contexts/AuthContext";

const SelectPlan = () => {
  const {user} = useAuth();

  return (
		<div className='bg-white shadow-md rounded py-6 max-w-md mx-auto items-center flex-co'>
			{user?.type === 'team' && user?.additionalData.companyId === '' ? (
				<>
					<span>
						You dont have a parental company please schedule a meeting for your
						compensation plan requirments
					</span>
					<iframe
						src='https://calendly.com/mlmmanagement400/mlm-management-dicussion'
						width='448'
						height='450'
						allowfullscreen=''
					></iframe>
				</>
			) : (
				<>
					Your plan is registered to{' '}
					{user?.additionalData?.name && (
						<span className='font-bold'>{user?.additionalData?.name}</span>
					)}{' '}
				
				</>
			)}
			{Object.keys(user).length > 0 && (
				<iframe
					src='https://calendly.com/mlmmanagement400/mlm-management-dicussion'
					width='448'
					height='450'
					allowfullscreen=''
				></iframe>
			)}
			<div className='w-full flex justify-center items-center'>
				<button
					onClick={() =>
						user?.additionalData.companyId
							? window.open('/team')
							: window.open('/company')
					}
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default SelectPlan;
