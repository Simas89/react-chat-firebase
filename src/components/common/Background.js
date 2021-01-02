import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const Wrap = styled.div`
	z-index: -1;
	position: fixed;
	background-color: ${(p) => p.theme.palette.background};
	height: 100vh;
	width: 100vw;
	.section {
		position: fixed;
		position: absolute;
		height: 100vh;
		width: 105vw;
	}
`;

const transition = {
	type: 'spring',
	stiffness: 220,
	mass: 5,
	get init() {
		return {
			type: this.type,
			stiffness: this.stiffness,
			mass: this.mass,
			damping: 105,
		};
	},
	get anim() {
		return {
			type: this.type,
			stiffness: this.stiffness,
			mass: this.mass,
			delay: 0.6,
			damping: 55,
		};
	},
};

const right1 = {
	initial: {
		x: '125vw',
		transition: transition.init,
	},
	animate: {
		x: '1%',
		transition: transition.anim,
	},
};
const right2 = {
	initial: {
		x: '105vw',
		transition: transition.init,
	},
	animate: {
		x: '5%',
		transition: transition.anim,
	},
};
const right3 = {
	initial: {
		x: '105vw',
		transition: transition.init,
	},
	animate: {
		x: '10%',
		transition: transition.anim,
	},
};
// const right4 = {
// 	initial: {
// 		x: '105vw',
// 		transition: transition.init,
// 	},
// 	animate: {
// 		x: '20%',
// 		transition: transition.anim,
// 	},
// };
const left1 = {
	initial: {
		x: '-125vw',
		transition: transition.init,
	},
	animate: {
		x: '-6%',
		transition: transition.anim,
	},
};
const left2 = {
	initial: {
		x: '-105vw',
		transition: transition.init,
	},
	animate: {
		x: '-5%',
		transition: transition.anim,
	},
};
const left3 = {
	initial: {
		x: '-105vw',
		transition: transition.init,
	},
	animate: {
		x: '-10%',
		transition: transition.anim,
	},
};

export const Background = () => {
	const [mode, setMode] = React.useState(true);
	const location = useLocation();
	const theme = useTheme();

	React.useEffect(() => {
		setMode(location.pathname.split('/')[2]);
	}, [location]);
	return (
		<Wrap className="section">
			<motion.div
				className="section"
				style={{ backgroundColor: theme.palette.accent.orange }}
				variants={right1}
				initial="initial"
				animate={mode === 'register' ? 'animate' : 'initial'}
			>
				<motion.div
					className="section"
					style={{ backgroundColor: theme.palette.accent.green }}
					variants={right2}
					initial="initial"
					animate={mode === 'register' ? 'animate' : 'initial'}
				>
					<motion.div
						className="section"
						style={{ backgroundColor: theme.palette.background }}
						variants={right3}
						initial="initial"
						animate={mode === 'register' ? 'animate' : 'initial'}
					></motion.div>
				</motion.div>
			</motion.div>
			<motion.div
				className="section"
				style={{ backgroundColor: theme.palette.accent.orange }}
				variants={left1}
				initial="initial"
				animate={mode === 'login' ? 'animate' : 'initial'}
			>
				<motion.div
					className="section"
					style={{ backgroundColor: theme.palette.accent.green }}
					variants={left2}
					initial="initial"
					animate={mode === 'login' ? 'animate' : 'initial'}
				>
					<motion.div
						className="section"
						style={{ backgroundColor: theme.palette.background }}
						variants={left3}
						initial="initial"
						animate={mode === 'login' ? 'animate' : 'initial'}
					></motion.div>
				</motion.div>
			</motion.div>
		</Wrap>
	);
};
