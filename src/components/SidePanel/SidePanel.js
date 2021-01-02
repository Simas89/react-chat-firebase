import React from 'react';
import styled from 'styled-components';
import UserPanel from 'components/SidePanel/UserPanel';

const Wrap = styled.div`
	background-color: ${(p) => p.theme.palette.accent.blueGrey};
	height: 100%;
`;

const SidePanel = () => {
	return (
		<Wrap>
			<UserPanel />
		</Wrap>
	);
};

export default SidePanel;
