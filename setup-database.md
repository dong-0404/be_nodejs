# Database Setup Guide for ShoeStore

## 1. MySQL Workbench Setup

### Create Database

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Run the following SQL to create the database:

```sql
CREATE DATABASE shoestore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Create User (Optional)

```sql
CREATE USER 'shoestore_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON shoestore_db.* TO 'shoestore_user'@'localhost';
FLUSH PRIVILEGES;
```

## 2. Environment Configuration

### Create .env file

1. Copy `env-template.txt` to `.env`:

```bash
cp env-template.txt .env
```

2. Update the following values in `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root                    # or your MySQL username
PASSWORD_DB=your_mysql_password # your MySQL password
DB_NAME=shoestore_db

# JWT Secret (generate a secure random string)
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_at_least_32_characters
```

### Common MySQL Connection Settings:

**For local MySQL:**

```env
DB_HOST=localhost
DB_USER=root
PASSWORD_DB=your_password
DB_NAME=shoestore_db
```

**For MySQL Workbench default connection:**

```env
DB_HOST=127.0.0.1
DB_USER=root
PASSWORD_DB=your_password
DB_NAME=shoestore_db
```

**For XAMPP/WAMP:**

```env
DB_HOST=localhost
DB_USER=root
PASSWORD_DB=
DB_NAME=shoestore_db
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Run Migrations

```bash
# Run all migrations
npx sequelize-cli db:migrate

# Check migration status
npx sequelize-cli db:migrate:status
```

## 5. Seed Database

```bash
# Run all seeders
npx sequelize-cli db:seed:all

# Run specific seeder
npx sequelize-cli db:seed --seed 20241224042400-seed-users.js
```

## 6. Verify Setup

### Check Tables in MySQL Workbench

You should see these tables created:

- Users
- Roles
- UserRoles
- Categories
- Brands
- Products
- ProductCategories
- ProductImages
- ProductVariants
- Reviews
- Wishlists
- WishlistItems
- Carts
- CartItems
- Addresses
- PaymentMethods
- Orders
- OrderItems
- OrderAddresses
- Notifications
- Banners

### Test Data

- Admin user: `admin@shoestore.com` / `admin123`
- Test customer: `customer@test.com` / `customer123`
- 6 sample products with variants
- Sample categories and brands
- Sample reviews and wishlists

## 7. Start the Server

```bash
npm start
```

The server should start on `http://localhost:3000`

## Troubleshooting

### Connection Issues

1. Make sure MySQL server is running
2. Check your MySQL credentials in `.env`
3. Verify database exists: `SHOW DATABASES;`
4. Check user permissions: `SHOW GRANTS FOR 'your_user'@'localhost';`

### Migration Issues

```bash
# Reset database (WARNING: This will delete all data)
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Port Issues

If port 3000 is busy, change PORT in `.env`:

```env
PORT=3001
```
