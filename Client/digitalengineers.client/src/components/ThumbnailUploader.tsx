import { useCallback, useEffect, useRef, useState } from 'react';

interface ThumbnailUploaderProps {
	value: File[];
	onChange: (files: File[]) => void;
	maxSize?: number; // in MB
	acceptedTypes?: string[];
	height?: string;
}

const ThumbnailUploader = ({
	value,
	onChange,
	maxSize = 5,
	acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
	height = '200px',
}: ThumbnailUploaderProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (value[0]) {
			const url = URL.createObjectURL(value[0]);
			setPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		} else {
			setPreviewUrl(null);
		}
	}, [value]);

	const handleFiles = useCallback(
		(files: FileList | null) => {
			if (!files || files.length === 0) return;

			const file = files[0];

			if (!acceptedTypes.includes(file.type)) {
				alert(`Please upload an image file (${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')})`);
				return;
			}

			if (file.size > maxSize * 1024 * 1024) {
				alert(`Image size must be less than ${maxSize}MB`);
				return;
			}

			onChange([file]);
		},
		[onChange, maxSize, acceptedTypes]
	);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			handleFiles(e.dataTransfer.files);
		},
		[handleFiles]
	);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFiles(e.target.files);
		},
		[handleFiles]
	);

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleRemove = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onChange([]);
		},
		[onChange]
	);

	const acceptString = acceptedTypes.join(',');

	return (
		<div
			className={`thumbnail-uploader border rounded text-center position-relative ${
				isDragging ? 'border-primary bg-light' : 'border-dashed'
			}`}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onClick={handleClick}
			style={{
				cursor: 'pointer',
				height: height,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
				background: previewUrl ? 'transparent' : undefined,
			}}
		>
			{previewUrl ? (
				<>
					<img
						src={previewUrl}
						alt="Thumbnail preview"
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
					<button
						type="button"
						className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
						onClick={handleRemove}
						style={{ zIndex: 10 }}
					>
						<i className="mdi mdi-close"></i>
					</button>
				</>
			) : (
				<div className="p-2">
					<i className="mdi mdi-image-outline fs-2 text-muted d-block"></i>
					<small className="text-muted d-block mt-1">Click or drag image</small>
					<small className="text-muted d-block">Max {maxSize}MB</small>
				</div>
			)}

			<input
				ref={fileInputRef}
				type="file"
				accept={acceptString}
				onChange={handleFileInputChange}
				style={{ display: 'none' }}
			/>
		</div>
	);
};

export default ThumbnailUploader;
