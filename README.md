# Delivery & Inventory Manager – Kalayil Latex and Traders

A simple React Native + Supabase-powered delivery management and inventory tracking app built for Kalayil Latex and Traders.

This system supports basic operations like recording deliveries and updating centralized inventory counts, with clear logic based on delivery type and client type.

## 🌟 Overview

This system helps you manage inventory by logging deliveries and automatically adjusting stock levels based on business rules. It runs entirely on Supabase with a dedicated Android app built using Expo.

## 🚀 Features

- 📱 Android build using React Native + Expo
- 🧠 Smart inventory logic powered by Supabase functions and triggers
- ✅ No authentication, login-free experience
- 📦 Auto-updating inventory when delivery entries are added, updated, or removed

## 🧠 Business Rules

| `clients.type` | `delivery.type` | Inventory Effect  |
| -------------- | --------------- | ----------------- |
| `client`       | `collect`       | ➕ Increase stock |
| `distributor`  | `supply`        | ➖ Decrease stock |

## ⚙️ Logic Summary

The inventory value is updated automatically through a Postgres trigger function:

If client.type = 'client' and delivery.type = 'collect' → Increase inventory

If client.type = 'distributor' and delivery.type = 'supply' → Decrease inventory

## 🛠 Built With

- [React Native (Expo)](https://expo.dev/) — for building the Android mobile app
- [Supabase](https://supabase.com/) — as the backend-as-a-service (database + triggers + realtime)
- PostgreSQL triggers for smart logic execution

## 📱 Start the Expo Project

```bash
npm install
npx expo start
```

## 🤖 Build for Android

```bash
npx expo run

# Or use EAS build for production-ready APK
eas build --platform android --profile preview --local
```

## 🗃️ Table Structure

### `clients`

| Column       | Type      | Description                      |
| ------------ | --------- | -------------------------------- |
| `id`         | UUID      | Primary key                      |
| `name`       | Text      | Name of the client               |
| `type`       | Text      | Either `client` or `distributor` |
| `created_at` | Timestamp | Auto-generated                   |

### `deliveries`

| Column       | Type      | Description                  |
| ------------ | --------- | ---------------------------- |
| `id`         | UUID      | Primary key                  |
| `userId`     | UUID      | Foreign key to `clients.id`  |
| `quantity`   | Integer   | Quantity of delivery         |
| `type`       | Text      | Either `collect` or `supply` |
| `created_at` | Timestamp | Auto-generated               |

### `inventory`

| Column       | Type      | Description            |
| ------------ | --------- | ---------------------- |
| `id`         | Integer   | Primary key            |
| `quantity`   | Integer   | Current stock quantity |
| `updated_at` | Timestamp | Last updated time      |

## 🔮 Future Plans

- Low-stock notifications
- Offline sync support
- Role-based dashboard views
- Export delivery reports
- Backup & Restore Data
- Year and month wise reports and filtering

## 👨‍💻 Maintained by

[Anandu Reghu](https://github.com/anandureghu)
