import React from 'react';
import { Table } from 'react-bootstrap';
import LicenseRequestRow from './LicenseRequestRow';
import type { LicenseRequest } from '@/types/licenseRequest';

interface LicensesTableProps {
	licenseRequests: LicenseRequest[];
	isLoading: boolean;
	onViewDetails: (license: LicenseRequest) => void;
	onActionSuccess: () => void;
}

const LicensesTable = React.memo<LicensesTableProps>(
	({ licenseRequests, isLoading, onViewDetails, onActionSuccess }) => {
		if (isLoading) {
			return (
				<div className="text-center py-5">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			);
		}

		if (licenseRequests.length === 0) {
			return (
				<div className="text-center py-5">
					<i className="uil uil-clipboard-blank font-48 text-muted mb-3" />
					<p className="text-muted">No pending license requests</p>
				</div>
			);
		}

		return (
			<div className="table-responsive">
				<Table hover className="mb-0">
					<thead className="table-light">
						<tr>
							<th>Specialist</th>
							<th>License Type</th>
							<th>State</th>
							<th>Submitted</th>
							<th className="text-end">Actions</th>
						</tr>
					</thead>
					<tbody>
						{licenseRequests.map((license) => (
							<LicenseRequestRow
								key={`${license.specialistId}-${license.licenseTypeId}`}
								license={license}
								onViewDetails={onViewDetails}
								onActionSuccess={onActionSuccess}
							/>
						))}
					</tbody>
				</Table>
			</div>
		);
	}
);

LicensesTable.displayName = 'LicensesTable';

export default LicensesTable;
