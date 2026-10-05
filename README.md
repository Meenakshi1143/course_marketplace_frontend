# CourseMarket

A course marketplace built with React, Vite, Redux Toolkit, React Router and axios.
Browse courses, search and filter them, save favourites, and add / edit / delete your own courses.

## Run the project

Open two terminals in this folder.

```bash
# 1) install dependencies (first time only)
npm install

# 2) start the fake API (courses + users) from db.json
npx json-server db.json --port 3000

# 3) start the website
npm run dev
```

The API address is set in one place: `src/services/api.js` (`baseURL`).

## Demo login

- Email: `meena@gmail.com`
- Password: `admin123`

You can also create a new account on the Register page.

## Pages

| Route | Page | Login needed |
| --- | --- | --- |
| `/` | Home | No |
| `/login`, `/register` | Authentication | No |
| `/courses` | Course list with search, filters and sorting | Yes |
| `/courses/:id` | Course details, save, edit, delete | Yes |
| `/add-course` | Add a new course | Yes |
| `/edit-course/:id` | Edit a course | Yes |
| `/favorites` | Saved courses | Yes |
