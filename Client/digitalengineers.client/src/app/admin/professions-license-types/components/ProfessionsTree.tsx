import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ProfessionRow from './ProfessionRow';
import type { ProfessionManagementDto, ProfessionTypeManagementDto, LicenseRequirement } from '@/types/lookup';

interface ProfessionsTreeProps {
	professions: ProfessionManagementDto[];
	professionTypes: ProfessionTypeManagementDto[];
	licenseRequirements: Map<number, LicenseRequirement[]>;
	onLoadLicenseRequirements: (professionTypeId: number) => Promise<LicenseRequirement[]>;
	onEditProfession: (profession: ProfessionManagementDto) => void;
	onDeleteProfession: (profession: ProfessionManagementDto) => void;
	onAddProfessionType: (profession: ProfessionManagementDto) => void;
	onEditProfessionType: (professionType: ProfessionTypeManagementDto) => void;
	onDeleteProfessionType: (professionType: ProfessionTypeManagementDto) => void;
	onAddLicenseRequirement: (professionType: ProfessionTypeManagementDto) => void;
	onEditLicenseRequirement: (professionType: ProfessionTypeManagementDto, requirement: LicenseRequirement) => void;
	onDeleteLicenseRequirement: (professionType: ProfessionTypeManagementDto, requirement: LicenseRequirement) => void;
}

const ProfessionsTree: React.FC<ProfessionsTreeProps> = ({ 
	professions, 
	professionTypes,
	licenseRequirements,
	onLoadLicenseRequirements,
	onEditProfession, 
	onDeleteProfession,
	onAddProfessionType,
	onEditProfessionType,
	onDeleteProfessionType,
	onAddLicenseRequirement,
	onEditLicenseRequirement,
	onDeleteLicenseRequirement,
}) => {
	const [expandedProfessionIds, setExpandedProfessionIds] = useState<Set<number>>(new Set());
	const [expandedTypeIds, setExpandedTypeIds] = useState<Set<number>>(new Set());

	const toggleProfession = useCallback((professionId: number) => {
		setExpandedProfessionIds(prev => {
			const newSet = new Set(prev);
			if (newSet.has(professionId)) {
				newSet.delete(professionId);
			} else {
				newSet.add(professionId);
			}
			return newSet;
		});
	}, []);

	const toggleProfessionType = useCallback((typeId: number) => {
		setExpandedTypeIds(prev => {
			const newSet = new Set(prev);
			if (newSet.has(typeId)) {
				newSet.delete(typeId);
			} else {
				newSet.add(typeId);
				if (!licenseRequirements.has(typeId)) {
					onLoadLicenseRequirements(typeId);
				}
			}
			return newSet;
		});
	}, [licenseRequirements, onLoadLicenseRequirements]);

	const professionTypesMap = useMemo(() => {
		const map = new Map<number, ProfessionTypeManagementDto[]>();
		professionTypes.forEach(pt => {
			const existing = map.get(pt.professionId) || [];
			existing.push(pt);
			map.set(pt.professionId, existing);
		});
		// Sort by displayOrder within each profession
		map.forEach((types, key) => {
			map.set(key, types.sort((a, b) => a.displayOrder - b.displayOrder));
		});
		return map;
	}, [professionTypes]);

	const sortedProfessions = useMemo(() => 
		[...professions].sort((a, b) => a.displayOrder - b.displayOrder),
		[professions]
	);

	// Auto-expand first profession on initial load
	useEffect(() => {
		if (professions.length > 0 && expandedProfessionIds.size === 0) {
			setExpandedProfessionIds(new Set([professions[0].id]));
		}
	}, [professions]);

	if (professions.length === 0) {
		return (
			<div className="text-center text-muted py-5">
				<i className="mdi mdi-folder-open-outline" style={{ fontSize: '3rem' }}></i>
				<p className="mt-2">No professions found</p>
			</div>
		);
	}

	return (
		<div className="professions-tree">
			{sortedProfessions.map((profession) => (
				<ProfessionRow
					key={profession.id}
					profession={profession}
					professionTypes={professionTypesMap.get(profession.id) || []}
					licenseRequirements={licenseRequirements}
					isExpanded={expandedProfessionIds.has(profession.id)}
					expandedTypeIds={expandedTypeIds}
					onToggle={() => toggleProfession(profession.id)}
					onToggleType={toggleProfessionType}
					onEdit={() => onEditProfession(profession)}
					onDelete={() => onDeleteProfession(profession)}
					onAddType={() => onAddProfessionType(profession)}
					onEditType={onEditProfessionType}
					onDeleteType={onDeleteProfessionType}
					onAddRequirement={onAddLicenseRequirement}
					onEditRequirement={onEditLicenseRequirement}
					onDeleteRequirement={onDeleteLicenseRequirement}
				/>
			))}
		</div>
	);
};

export default ProfessionsTree;
