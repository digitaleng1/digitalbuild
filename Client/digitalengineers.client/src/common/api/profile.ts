import HttpClient from '@/common/helpers/httpClient';

function ProfileService() {
	return {
		profile: () => {
			return HttpClient.get('/profile');
		},
	};
}

export default ProfileService();
