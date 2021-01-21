import React from 'react';
import { Avatar, Box, Divider, Typography } from '@material-ui/core';

export const ChannelInfo = ({ createdBy, details }) => {
	return (
		<Box display="flex" flexDirection="column">
			<Typography variant="body1" color="textPrimary">
				<b>Created by:</b>
			</Typography>
			<Box display="flex" alignItems="flex-end">
				<Avatar
					style={{
						height: '70px',
						width: '70px',
						margin: '4px 8px 4px 0 ',
					}}
					alt={createdBy.name}
					src={createdBy.avataer}
				/>
				<Typography variant="h6" color="textPrimary">
					{createdBy.name}
				</Typography>
			</Box>
			<Divider />
			<Typography variant="body1" color="textPrimary">
				<b>Description:</b>
			</Typography>
			<Typography variant="body1" color="textPrimary">
				{details}
			</Typography>
		</Box>
	);
};
