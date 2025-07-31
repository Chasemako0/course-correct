<p align="center">
  <img src="assets/banner.png" alt="Course-Correct Banner" width="100%" />
</p>

<p align="center">
  <a href="https://expo.dev/">
    <img alt="Built with Expo" src="https://img.shields.io/badge/built%20with-Expo-1f2024?logo=expo&logoColor=white">
  </a>
  <a href="https://github.com/Chasemako0/course-correct/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/Chasemako0/course-correct">
  </a>
  <a href="https://github.com/Chasemako0/course-correct/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/Chasemako0/course-correct">
  </a>
  <a href="https://github.com/Chasemako0/course-correct/commits/main">
    <img alt="Last Commit" src="https://img.shields.io/github/last-commit/Chasemako0/course-correct">
  </a>
</p>

---

# Course-Correct  
A mobile productivity app for students built with React Native and Supabase.

## Overview

Course-Correct is a modular academic organizer that helps students manage notes, plan tasks, track to-dos, and practice quizzes — all in one place. Designed for clarity and simplicity, it runs on both Android and iOS using Expo.

## Features

- Secure authentication with Supabase Auth
- Course notes with tags, filters, and swipe gestures
- Task planner with recurrence and scheduling
- To-do checklist with filters and completion status
- Trivia quiz using Open Trivia DB API
- In-app academic search using Wikipedia API
- Profile editing and image upload
- Row-level security enforcement

## Technology Stack

- **Frontend:** React Native (with Expo)
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **APIs:** Open Trivia DB, Wikipedia API
- **Libraries:** React Navigation, Toast, Ionicons, DateTimePicker

## Installation

```bash
git clone https://github.com/Chasemako0/course-correct.git
cd course-correct
npm install
npx expo start
```

> Use Expo Go or an emulator to preview the app.

## Supabase Setup

### 1. Create `supabase.js`

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Then add `supabase.js` to `.gitignore`.

### 2. Create Tables in Supabase

Use the Supabase SQL Editor to run:

```sql
-- Profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Course Notes
create table course_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text,
  content text,
  tags text[],
  is_done boolean default false,
  created_at timestamp with time zone default now()
);

-- Planner Tasks
create table planner_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text,
  datetime timestamp with time zone,
  recurring text,
  created_at timestamp with time zone default now()
);

-- Todos
create table todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  content text,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
```

### 3. Enable RLS (Row-Level Security) and Set Policies

```sql
alter table profiles enable row level security;
alter table course_notes enable row level security;
alter table planner_tasks enable row level security;
alter table todos enable row level security;

create policy "Users can manage their own profile"
on profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can manage their own notes"
on course_notes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own planner tasks"
on planner_tasks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own to-do items"
on todos for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## Project Structure

```
course-correct/
├── components/
├── screens/
├── assets/
├── supabase.js          # (ignored in git)
├── .env                 # (optional)
└── App.js
```

## Environment

- Node.js v18+
- Expo CLI
- Supabase Project (Auth, DB, Storage)
- Expo Go

## Security

- API keys are kept in `supabase.js` (ignored in version control)
- All data tables are protected with Row-Level Security (RLS)
- Authentication is enforced at backend and frontend

## Contributions

Pull requests are welcome. Please open an issue to discuss any major feature changes.

## License

[MIT](LICENSE)