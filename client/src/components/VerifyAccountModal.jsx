import { Box, Modal } from '@mui/material';
import VerifyAccountForm from '../widgets/VerifyAccountForm';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
  width:450
};

const VerifyAccountModal = ({ isModalOpen, setIsModalOpen }) => {

	return (
		<>
			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box sx={style} className='m-0'>
					<VerifyAccountForm onSubmit={() => {setIsModalOpen(false); window.open('/user')}} />
				</Box>
			</Modal>
		</>
	);
};

export default VerifyAccountModal;
