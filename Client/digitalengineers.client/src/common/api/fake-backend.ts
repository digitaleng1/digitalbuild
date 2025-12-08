import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

type User = {
	id: number;
	email?: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	role: string;
	token: string;
};

const TOKEN =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';

const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });

export default function configureFakeBackend() {
	const users: User[] = [
		{
			id: 1,
			email: 'digital-engineers@digital-engineers.com',
			username: 'Hyper',
			password: 'Hyper',
			firstName: 'Hyper',
			lastName: 'Novobid',
			role: 'Admin',
			token: TOKEN,
		},
	];

	mock.onPost('/login/').reply(function (config:any) {
		console.info('login');
		return new Promise(function (resolve, _reject) {
			setTimeout(function () {
				// get parameters from post request
				const params = JSON.parse(config.data);

				// find if any user matches login credentials
				const filteredUsers = users.filter((user) => {
					return user.email === params.email && user.password === params.password;
				});

				if (filteredUsers.length) {
					// if login details are valid return user details and fake jwt token
					const user = filteredUsers[0];
					resolve([200, user]);
				} else {
					// else return error
					resolve([401, { message: 'Email or Password is incorrect' }]);
				}
			}, 1000);
		});
	});

	mock.onPost('/register/').reply(function (config:any) {
		return new Promise(function (resolve, _reject) {
			setTimeout(function () {
				// get parameters from post request
				const params = JSON.parse(config.data);

				console.log(params.email);
				// add new users
				const [firstName, lastName] = params.name.split(' ');
				const newUser: User = {
					id: users.length + 1,
					email: params.email,
					username: firstName,
					password: params.password,
					firstName: firstName,
					lastName: lastName,
					role: 'Admin',
					token: TOKEN,
				};
				users.push(newUser);
				resolve([200, newUser]);
			}, 1000);
		});
	});

	mock.onPost('/forget-password/').reply(function (config:any) {
		return new Promise(function (resolve, _reject) {
			setTimeout(function () {
				// get parameters from post request
				const params = JSON.parse(config.data);

				// find if any user matches login credentials
				const filteredUsers = users.filter((user) => {
					return user.email === params.email;
				});

				if (filteredUsers.length) {
					// if login details are valid return user details and fake jwt token
					const responseJson = {
						message: "We've sent you a link to reset password to your registered email.",
					};
					resolve([200, responseJson]);
				} else {
					// else return error
					resolve([
						401,
						{
							message: 'Sorry, we could not find any registered user with entered email',
						},
					]);
				}
			}, 1000);
		});
	});
}
