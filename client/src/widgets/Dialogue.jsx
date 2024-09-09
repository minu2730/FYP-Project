import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Edit } from '@mui/icons-material';

export default function Dialogue({ type, color, icon }) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button
				endIcon={icon}
				style={{
					padding: ' 0.5rem 1rem',
					color: 'white',
					borderRadius: '0.25rem',
					backgroundColor: color,
				}}
				onClick={handleClickOpen}
			></Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{type + ' '} Subscription</DialogTitle>
				<DialogContent>
					<DialogContentText>{type + ' '} the Subscription</DialogContentText>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						label='Name'
						type='text'
						fullWidth
						variant='standard'
					/>
					<TextField
						autoFocus
						margin='dense'
						id='description'
						label='description'
						type='text'
						fullWidth
						variant='standard'
					/>
					<TextField
						autoFocus
						margin='dense'
						id='price'
						label='price'
						type='text'
						fullWidth
						variant='standard'
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleClose}>{type}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
