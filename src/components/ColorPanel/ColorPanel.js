import React from 'react';
import { Fab, Divider, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';

const Wrap = styled.div`
	display: flex;
	flex-direction: column;
	padding: 8px;
	background-color: ${(p) => p.theme.palette.primary.dark};
	.fab {
		background-color: ${(p) => p.theme.palette.accent.green};
		border-radius: 25%;
	}
	.MuiDivider-light {
		background-color: gray;
	}
`;

const ColorPanel = () => {
	return (
		<Wrap>
			<Grid container direction="column" spacing={1}>
				<Grid item>
					<Divider light />
				</Grid>
				<Grid item>
					<Fab
						className="fab"
						size="small"
						color="primary"
						aria-label="add"
					>
						<AddIcon />
					</Fab>
				</Grid>
				{/* <Grid item>
					<Fab
						className="fab"
						size="small"
						color="primary"
						aria-label="add"
					>
						<AddIcon />
					</Fab>
				</Grid> */}
			</Grid>
		</Wrap>
	);
};

export default ColorPanel;
