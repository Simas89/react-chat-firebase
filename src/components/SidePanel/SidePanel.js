import React from 'react';
import styled from 'styled-components';
import UserPanel from 'components/SidePanel/UserPanel';
import Channels from 'components/SidePanel/Channels';

const Wrap = styled.div`
	background-color: ${(p) => p.theme.palette.primary.main};
	padding: 10px;
	height: 100%;
`;

const SidePanel = () => {
	return (
		<Wrap>
			<UserPanel />
			<Channels />
		</Wrap>
	);
};

export default SidePanel;
