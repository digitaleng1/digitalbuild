import httpClient from '@/common/helpers/httpClient';
import type { CreateLicenseRequest, LicenseRequest, ResubmitLicenseRequest, ReviewLicenseRequest } from '@/types/licenseRequest';

class LicenseRequestService {
	async createLicenseRequest(data: CreateLicenseRequest): Promise<LicenseRequest> {
		const formData = new FormData();
		formData.append('professionTypeId', data.professionTypeId.toString());
		formData.append('licenseTypeId', data.licenseTypeId.toString());
		formData.append('state', data.state);
		formData.append('issuingAuthority', data.issuingAuthority);
		formData.append('issueDate', data.issueDate);
		formData.append('expirationDate', data.expirationDate);
		formData.append('licenseNumber', data.licenseNumber);
		formData.append('file', data.file);

		const result = await httpClient.post<LicenseRequest>('/api/licenses/requests', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return result as LicenseRequest;
	}

	async resubmitLicenseRequest(
		specialistId: number,
		licenseTypeId: number,
		professionTypeId: number,
		data: ResubmitLicenseRequest
	): Promise<LicenseRequest> {
		const formData = new FormData();
		formData.append('state', data.state);
		formData.append('issuingAuthority', data.issuingAuthority);
		formData.append('issueDate', data.issueDate);
		formData.append('expirationDate', data.expirationDate);
		formData.append('licenseNumber', data.licenseNumber);
		if (data.file) {
			formData.append('file', data.file);
		}

		const result = await httpClient.put<LicenseRequest>(
			`/api/licenses/requests/${specialistId}/${licenseTypeId}/${professionTypeId}/resubmit`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return result as LicenseRequest;
	}

	async getMyLicenseRequests(): Promise<LicenseRequest[]> {
		const data = await httpClient.get<LicenseRequest[]>('/api/licenses/requests/me');
		return data as LicenseRequest[];
	}

	async getPendingLicenseRequests(): Promise<LicenseRequest[]> {
		const data = await httpClient.get<LicenseRequest[]>('/api/licenses/requests/pending');
		return data as LicenseRequest[];
	}

	async getLicenseRequestById(id: number): Promise<LicenseRequest> {
		const data = await httpClient.get<LicenseRequest>(`/api/licenses/requests/${id}`);
		return data as LicenseRequest;
	}

	async approveLicenseRequest(id: number, data: ReviewLicenseRequest): Promise<LicenseRequest> {
		const result = await httpClient.put<LicenseRequest>(`/api/licenses/requests/${id}/approve`, data);
		return result as LicenseRequest;
	}

	async rejectLicenseRequest(id: number, data: ReviewLicenseRequest): Promise<LicenseRequest> {
		const result = await httpClient.put<LicenseRequest>(`/api/licenses/requests/${id}/reject`, data);
		return result as LicenseRequest;
	}

	async deleteLicenseRequest(id: number): Promise<void> {
		await httpClient.delete(`/api/licenses/requests/${id}`);
	}
}

export default new LicenseRequestService();
