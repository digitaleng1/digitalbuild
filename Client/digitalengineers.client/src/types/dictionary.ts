export interface USState {
	value: string;
	label: string;
}

export interface Profession {
	id: number;
	name: string;
	description: string;
}

export interface LicenseType {
	id: number;
	name: string;
	description: string;
	professionId: number;
}

export interface SelectedProfession {
	profession: Profession;
	licenseTypes: LicenseType[];
}
