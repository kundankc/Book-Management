# Book Review System - GraphQL API

### 1. Clone the repository

```bash
git clone https://github.com/kundankc/Book-Management.git
cd Book-Review/Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the Backend directory:

```env
MONGO_URI=mongodb://localhost:27017/book-review-system
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=4000

ADMIN_EMAIL=admin@bookreviews.com
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Linux/Mac
sudo systemctl start mongodb

# Or using mongod
mongod
```

### 5. Start the server

```bash

npm run dev

# or

npm start
```

The server will start at: `http://localhost:4000/api/graphql`

## GraphQL Playground

Access the GraphQL Playground at:
```
http://localhost:4000/api/graphql
```
