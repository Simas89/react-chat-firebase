import React from 'react';
import { useSelector } from 'react-redux';
import ScaleLoader from 'react-spinners/ScaleLoader';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Wrap = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const Loader = () => {
	const showIntro = useSelector((state) => state.animations.showIntro);
	return showIntro ? (
		<Wrap>
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<ScaleLoader
					height="60px"
					width="4px"
					margin="3px"
					color="white"
					loading={true}
				/>
			</motion.div>
		</Wrap>
	) : null;
};
