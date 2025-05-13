## Tech Issues Report Application

A simplified technical issues management system, applicable to small- and medium-size organizations.

The app has two views: **User** and **Admin**.

Admin functionalities include:
- Overall view of all tickets in the database, sorted by priority or status.
- Edit the status of each ticket.
- Change account password.

User functionalities include:
- Overall view of all tickets in the database, sorted by priority or status.
- Create new ticket.
- Change account password.

As my vision for the project is to be deployed to a server and is open to the internet, I did not add the **_Create/ Register new account_** feature as part of this app. This is because I want the system admin to have more control over the users in the system (they would have to manually add the user by sending POST request to the server, which can be automated by writing a small script using the pre-set secret API key).

The environment file must include:
- DATABASE_URL (for database connection)
- JWT_KEY (for authentication)
- API_KEY (for authentication route, prevent unauthenticated users from accessing the api route and crawl data)
- BASE_URL (for api routing)

Want to test the app out? Use the following login credentials!
Demo Link: [https://issues-report.vercel.app/](https://issues-tracker-tau.vercel.app/)

THIS APP IS OPEN TO THE INTERNET, SO PLEASE WATCH OUT WHAT YOU COMMENT!!

**For User view:**
- _Username:_ testUser1
- _Password:_ testUs3r1!@$

**For Admin view:**
- _Username:_ testAdmin1
- _Password:_ testAdm1n!

## Previews
![CleanShot 2025-05-12 at 20 34 30@2x](https://github.com/user-attachments/assets/4d42a05c-fa11-4c60-b4ea-e600b71b5c55)
![CleanShot 2025-05-12 at 20 35 14@2x](https://github.com/user-attachments/assets/35c60b0b-8299-435e-8b8c-c3d75e94c38c)
![CleanShot 2025-05-12 at 20 35 33@2x](https://github.com/user-attachments/assets/bb33c92b-55ed-4ccb-8319-94b3b02d4b59)
![CleanShot 2025-05-12 at 20 36 20@2x](https://github.com/user-attachments/assets/8bc90d02-6a32-4b6b-af6c-e2711cdec1a4)


