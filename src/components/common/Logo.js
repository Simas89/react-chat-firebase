import React from 'react';
import { motion } from 'framer-motion';

import styled from 'styled-components';

const StyledDiv = styled.div`
	/* border: 1px solid white; */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const MotionStyledDiv = motion.custom(StyledDiv);

export const Logo = () => {
	const [stage, setStage] = React.useState(1);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			setStage(0);
			clearTimeout(timeout);
		}, 4000);

		return () => clearTimeout(timeout);
	}, []);
	const variants = {
		initial: {
			opacity: 0,
			scale: 1,
		},
		visible: {
			opacity: 1,
			scale: 1,

			transition: {
				delay: 1,
				duration: 1.5,
			},
		},

		hidden: {
			opacity: 0,
			scale: 0.8,
			y: 5,
			transition: {
				duration: 0.3,
			},
		},
	};
	return (
		<MotionStyledDiv
			variants={variants}
			initial="initial"
			animate={stage ? 'visible' : 'hidden'}
		>
			<img src="/logo.svg" alt="logo"></img>
		</MotionStyledDiv>
	);
};
