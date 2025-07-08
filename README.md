
# 🏆 User Rewards System – NestJS Backend

This project is a **modular rewards and points management system** built with **NestJS**, **MongoDB**, and **Mongoose**. It enables creation of users, assigning reward points, redeeming rewards, logging transactions, and viewing redemption history.

---

## 📁 Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB (via Mongoose)
- **Testing**: Jest
- **Package Manager**: npm

---

## 🚀 Features

- Create new users with optional initial reward points.
- Add reward points to users.
- Redeem points against available reward options.
- Track recent transactions and redemption history.
- Centralized error handling with proper status codes.
- Modular architecture with services, controllers, DTOs, and schemas.
- Unit tested using Jest.

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/rewards-system.git
cd rewards-system

# Install dependencies
npm install
```

---

## ⚙️ Environment Configuration

Create a `.env` file at the root with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/rewards-db
PORT=3000
```

---

## ▶️ Running the Server

```bash
# Start the server
npm run start:dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## ✅ Running Tests

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov
```

---

## 📚 API Endpoints

### 👤 Users

- `POST /users` – Create a new user
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "points": 100
}
```

- `GET /users` – List all users

- `PATCH /users/:userId/add-points` – Add points to user
```json
{
  "points": 50
}
```

---

### 🎁 Rewards

- `GET /rewards/:userId/points` – Get user reward points

- `POST /rewards/:userId/redeem` – Redeem reward
```json
{
  "points": 50,
  "rewardType": "voucher"
}
```

- `GET /rewards/options` – List available reward types:
```json
["cashback", "voucher", "gift"]
```

---

### 🔄 Transactions

- `GET /transactions/:userId` – Fetch recent transactions (paginated)
  - Query params: `?page=1&limit=5`

---

### 📜 Redemptions

- `GET /redemptions/:userId` – Fetch redemption history (sorted by latest)

---

## 🧪 Testing Coverage

The services covered under unit tests:

- `UsersService`
- `RewardsService`
- `RedemptionsService`
- `TransactionsService`

Test status:
✅ All passing with detailed mocks using Jest.

---

## 📁 Project Structure

```
src/
│
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dtos/
│
├── rewards/
│   ├── rewards.controller.ts
│   ├── rewards.service.ts
│
├── redemptions/
│   ├── redemptions.controller.ts
│   ├── redemptions.service.ts
│
├── transactions/
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│
├── config/
│   └── database.config.ts
│
├── main.ts
└── app.module.ts
```

---

## 📌 Notes

- Errors are standardized with proper NestJS exceptions like:
  - `BadRequestException`
  - `NotFoundException`
  - `ConflictException`

- Responses follow this structure:
```json
{
  "message": "Success message",
  "data": { ... }
}
```

---

## 👨‍💻 Author

**Md Shahid Ansari**

> Full-stack & AI Developer  
> [GitHub](https://github.com/md-shahid-ansari) • [LinkedIn](https://linkedin.com/in/md-shahid-ansari)

---