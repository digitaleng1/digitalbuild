/**
 * File utility functions for handling file operations
 */

/**
 * Format file size in bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file icon class based on file type
 * @param fileType - MIME type or file extension
 * @returns CSS icon class name
 */
export const getFileIcon = (fileType: string): string => {
	const type = fileType.toLowerCase();

	// PDF files
	if (type.includes('pdf') || type === '.pdf') {
		return 'mdi mdi-file-pdf-box text-danger';
	}

	// Image files
	if (type.includes('image') || ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(type)) {
		return 'mdi mdi-file-image text-primary';
	}

	// Word documents
	if (type.includes('word') || type.includes('msword') || ['.doc', '.docx'].includes(type)) {
		return 'mdi mdi-file-word text-info';
	}

	// CAD files
	if (['.dwg', '.dxf', 'application/dwg', 'application/dxf'].includes(type)) {
		return 'mdi mdi-file-cad text-warning';
	}

	// Excel files
	if (type.includes('excel') || type.includes('spreadsheet') || ['.xls', '.xlsx'].includes(type)) {
		return 'mdi mdi-file-excel text-success';
	}

	// Default
	return 'mdi mdi-file-document text-secondary';
};

/**
 * Validate if file type is allowed
 * @param file - File object
 * @param allowedTypes - Array of allowed MIME types or extensions
 * @returns true if valid, false otherwise
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
	const fileName = file.name.toLowerCase();
	const fileType = file.type.toLowerCase();

	return allowedTypes.some((type) => {
		if (type.startsWith('.')) {
			// Extension check
			return fileName.endsWith(type);
		}
		// MIME type check
		return fileType === type || fileType.startsWith(type);
	});
};

/**
 * Validate if file size is within limit
 * @param file - File object
 * @param maxSizeInBytes - Maximum allowed size in bytes
 * @returns true if valid, false otherwise
 */
export const validateFileSize = (file: File, maxSizeInBytes: number): boolean => {
	return file.size <= maxSizeInBytes;
};

/**
 * Get file extension from filename
 * @param fileName - Name of the file
 * @returns File extension (e.g., ".pdf")
 */
export const getFileExtension = (fileName: string): string => {
	const lastDot = fileName.lastIndexOf('.');
	if (lastDot === -1) return '';
	return fileName.substring(lastDot).toLowerCase();
};

/**
 * Allowed file types for bid request attachments
 */
export const ALLOWED_BID_ATTACHMENT_TYPES = [
	'application/pdf',
	'image/jpeg',
	'image/png',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'.pdf',
	'.jpg',
	'.jpeg',
	'.png',
	'.doc',
	'.docx',
	'.dwg',
	'.dxf'
];

/**
 * Maximum file size for bid request attachments (10 MB)
 */
export const MAX_BID_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Get human-readable file type description
 * @param fileType - MIME type or extension
 * @returns Description string
 */
export const getFileTypeDescription = (fileType: string): string => {
	const type = fileType.toLowerCase();

	if (type.includes('pdf') || type === '.pdf') return 'PDF Document';
	if (type.includes('image') || ['.jpg', '.jpeg', '.png'].includes(type)) return 'Image';
	if (type.includes('word') || type.includes('msword') || ['.doc', '.docx'].includes(type)) return 'Word Document';
	if (['.dwg', '.dxf'].includes(type)) return 'CAD Drawing';
	if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel Spreadsheet';

	return 'Document';
};
