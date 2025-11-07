## Auth

- POST /auth/register
	- Body: { email: string, password: string, displayName: string }
	- Response: User

- POST /auth/login
	- Body: { email: string, password: string }
	- Response: { token: string }

## Users

- GET /users/me
	- Headers: Authorization: Bearer <idToken>
	- Response: User

- PUT /users/me
	- Headers: Authorization: Bearer <idToken>
	- Body: { displayName?: string }
	- Response: User

- POST /users/me/saved-events
	- Headers: Authorization: Bearer <idToken>
	- Body: { eventId: string }
	- Response: User (con savedEvents actualizado)

- DELETE /users/me/saved-events/:eventId
	- Headers: Authorization: Bearer <idToken>
	- Response: User (con savedEvents actualizado)

User shape:

```
{
	uid: string,
	email: string,
	displayName: string,
	friends: string[],
	attendingEvents?: string[],
	savedEvents?: string[]
}
```

## Plans

- POST /plans
	- Headers: Authorization: Bearer <idToken>
	- Body: { eventId: string, invitedContacts: string[] }
	- Response: Plan

- GET /plans/me
	- Headers: Authorization: Bearer <idToken>
	- Response: Plan[]

Plan shape:

```
{
	id: string,
	eventId: string,
	createdBy: string,
	invitedFriends: number,
	status: 'active' | 'cancelled',
	invitedContacts?: string[]
}
```

