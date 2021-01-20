import React from 'react';
import styled from 'styled-components';
import {
	Paper,
	Typography,
	Button,
	Dialog,
	Box,
	ButtonGroup,
	Grid,
	Slider,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import ImageIcon from '@material-ui/icons/Image';
import AvatarEditor from 'react-avatar-editor';
import firebase from 'config/firebase';

const StyledPaper = styled(Paper)`
	position: relative;
	background-color: white;
	width: 500px;
	padding: 16px;

	.preview-image-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
`;

const storageRef = firebase.storage().ref();
const userRef = firebase.auth();
const usersRef = firebase.database().ref('users');

export const ModalAvatar = ({ setIsModal }) => {
	// const [file, setFile] = React.useState('');
	const [previewImage, setPreviewImage] = React.useState('');
	const [croppedImage, setCroppedImage] = React.useState('');
	const [blob, setBlob] = React.useState('');
	const [uploadedImage, setUploadedImage] = React.useState('');
	const [imgParams, setImgParams] = React.useState({
		scale: 1.1,
		rotate: 0,
	});
	const [avatarEditor, setAvatarEditor] = React.useState(null);

	React.useEffect(() => {
		const changeAvatar = () => {
			userRef.currentUser
				.updateProfile({
					photoURL: uploadedImage,
				})
				.then(() => {
					setIsModal(false);
					console.log('done');
				});
		};
		if (uploadedImage) {
			changeAvatar();
			usersRef
				.child(userRef.currentUser.uid)
				.update({ avatar: uploadedImage });
			console.log(userRef.currentUser.uid);
		}
	}, [uploadedImage, setIsModal]);

	const handleChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		if (file) {
			reader.readAsDataURL(file);
			reader.addEventListener('load', () => {
				setPreviewImage(reader.result);
				// console.log(reader.result);
			});
		}
	};

	const cropImage = () => {
		if (avatarEditor) {
			avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
				let imageUrl = URL.createObjectURL(blob);
				setCroppedImage(imageUrl);
				setBlob(blob);
				console.log(blob);
			});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const metadata = {
			contentType: 'image/jpeg',
		};
		storageRef
			.child(`avatars/user-${userRef.currentUser.uid}.png`)
			.put(blob, metadata)
			.then((snap) =>
				snap.ref
					.getDownloadURL()
					.then((downloadURL) => setUploadedImage(downloadURL))
			);
	};
	const handleClear = () => {
		setIsModal(false);
	};

	return (
		<Dialog aria-labelledby="customized-dialog-title" open>
			<StyledPaper>
				<Typography variant="h6">Change Avatar</Typography>

				<form onSubmit={handleSubmit}>
					<Box display="flex" flexDirection="column" justify="flex-end">
						<Box height="18px" />
						<Box
							display="flex"
							flexDirection="column"
							alignItems="flex-start"
						>
							<input
								style={{ display: 'none' }}
								accept="image/*"
								id="contained-button-file"
								multiple
								type="file"
								hidden
								onChange={handleChange}
							/>
							<label htmlFor="contained-button-file">
								<Button variant="outlined" component="span">
									select image
								</Button>
							</label>
						</Box>

						{previewImage && (
							<>
								<Box height="18px" />
								<Grid container>
									<Grid item xs={6}>
										<div className="preview-image-container">
											<AvatarEditor
												ref={(node) => setAvatarEditor(node)}
												image={previewImage}
												width={120}
												height={120}
												border={20}
												// color={[255, 255, 255, 0.6]} // RGBA
												scale={imgParams.scale}
												rotate={imgParams.rotate}
												borderRadius={imgParams.borderRadius}
											/>
										</div>
									</Grid>
									<Grid item xs={6}>
										<Box
											width="100%"
											height="100%"
											display="flex"
											justifyContent="center"
											alignItems="center"
										>
											{croppedImage && (
												<img
													src={croppedImage}
													alt="prifile-img"
												></img>
											)}
										</Box>
									</Grid>
								</Grid>
								<div style={{ width: '100%', padding: '0 6px' }}>
									<Typography>Scale</Typography>
									<Slider
										label="scale"
										min={0.5}
										max={2}
										step={0.1}
										value={imgParams.scale}
										onChange={(e, val) =>
											setImgParams((state) => {
												return { ...state, scale: val };
											})
										}
									/>
								</div>
								<div style={{ width: '100%', padding: '0 6px' }}>
									<Typography>Rotate</Typography>
									<Slider
										label="rotate"
										min={0}
										max={360}
										step={1}
										value={imgParams.rotate}
										onChange={(e, val) =>
											setImgParams((state) => {
												return { ...state, rotate: val };
											})
										}
									/>
								</div>
							</>
						)}

						<Box height="18px" />
						<Box display="flex" justifyContent="space-between">
							<ButtonGroup variant="text">
								<Button
									type="submit"
									autoFocus
									// variant="contained"
									color="primary"
									endIcon={<SaveIcon />}
									disabled={!Boolean(croppedImage)}
								>
									Save
								</Button>
								<Button
									onClick={cropImage}
									autoFocus
									// variant="contained"
									color="primary"
									endIcon={<ImageIcon />}
									disabled={!Boolean(previewImage)}
								>
									Preview
								</Button>
							</ButtonGroup>
							<Button autoFocus onClick={handleClear} color="primary">
								Cancel
							</Button>
						</Box>
					</Box>
				</form>
			</StyledPaper>
		</Dialog>
	);
};
