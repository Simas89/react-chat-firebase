import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
	text-decoration: none;
	color: ${(p) => p.theme.palette.text.primary};
	padding: 0;
	margin: 0;

	&:focus,
	&:hover,
	&:visited,
	&:link,
	&:active {
		text-decoration: none;
	}
	&:hover {
		text-decoration: underline;
	}
`;

export default StyledLink;
