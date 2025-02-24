const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();

const prisma = new PrismaClient();

// ==========================
// 1. Middleware parse JSON
// ==========================
app.use(express.json());

// ==========================
// 2. Middleware log request
// ==========================
app.use((req, res, next) => {
  console.log(`\n--- NEW REQUEST ---`);
  console.log(`Method: ${req.method}, URL: ${req.url}`);

  // Nếu muốn log body, hãy cẩn thận với dữ liệu nhạy cảm (password).
  console.log(`Body:`, req.body);

  next(); // Cho phép request tiếp tục đến endpoint
});

// ==========================
// 3. Endpoint POST /users
// ==========================
app.post('/users', async (req, res) => {
  try {
    // Log thêm (nếu muốn)
    console.log("POST /users body:", req.body);

    const { username, password, role, name, email } = req.body;
    const user = await prisma.user.create({
      data: { username, password, role, name, email },
    });

    console.log("Created user:", user);
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Lỗi khi tạo người dùng' });
  }
});

// ==========================
// 4. Endpoint GET /users
// ==========================
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log("GET /users result:", users);
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
  }
});

// ==========================
// 5. Khởi động server
// ==========================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
