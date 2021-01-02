import React from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import styled from 'styled-components';

const Wrap = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const Loader = () => {
	return (
		<Wrap>
			<div>
				<ScaleLoader
					height="60px"
					width="4px"
					margin="3px"
					color="white"
					loading={true}
				/>
			</div>
		</Wrap>
	);
};
