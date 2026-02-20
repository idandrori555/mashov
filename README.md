# Mashov API Client

A TypeScript/JavaScript client for interacting with the Mashov student information system API. Retrieve grades, study groups, and behavior records programmatically.

## Features

- **Authentication** - Secure login with credentials
- **Grades** - Fetch student grades and grading events
- **Study Groups** - Retrieve enrolled study groups with teacher information
- **Behavior** - Access attendance and behavior records
- **TypeScript** - Full type definitions included

## Installation

Clone from GitHub and link with Bun:

```bash
git clone https://github.com/idandrori555/mashov.git
cd mashov
bun install
bun link
```

## Usage

```typescript
import MashovClient from 'mashov';

const client = new MashovClient({
  username: "your_username",
  password: "your_password",
  semel: 123456,
  year: 2024
});

await client.login();

// Get grades
const grades = await client.getUserGrades();
console.log(grades);

// Get study groups
const groups = await client.getGroups();
console.log(groups);

// Get behavior records
const behavior = await client.getBehavior();
console.log(behavior);

// Get session info
const session = client.getSession();
console.log(session);
```

## API

### `new MashovClient(options)`

Creates a new client instance.

| Option | Type | Description |
|--------|------|-------------|
| `username` | `string` | Your Mashov username |
| `password` | `string` | Your Mashov password |
| `semel` | `number` | School identifier |
| `year` | `number` | Academic year |

### `client.login()`

Authenticates with the Mashov API. Must be called before other API methods.

### `client.getUserGrades(): Promise<GradeList>`

Retrieves the user's grades.

**Returns:** `GradeEntry[]`

### `client.getGroups(): Promise<GroupList>`

Retrieves the user's study groups.

**Returns:** `StudyGroup[]`

### `client.getBehavior(): Promise<AttendanceList>`

Retrieves the user's behavior and attendance records.

**Returns:** `AttendanceEvent[]`

### `client.getSession(): MashovSession`

Returns the current session data.

## Types

The following types are exported:

- `UserLogin` - Login credentials interface
- `GradeEntry` - Individual grade record
- `GradeList` - Array of grade entries
- `StudyGroup` - Study group with teachers
- `GroupList` - Array of study groups
- `AttendanceEvent` - Behavior/attendance record
- `AttendanceList` - Array of attendance events

## Requirements

- Node.js 18+ or modern browser
- Valid Mashov credentials

## License

MIT
