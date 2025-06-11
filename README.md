
# 🧾 Visitor Registration System

A full-stack MERN (MongoDB, Express, React, Node.js) application to manage visitor records.  
It captures the visitor's **name**, **reason for visit**, **photo** (via webcam), and **digital signature**.

---

## 📁 Project Structure

```

your-project/
├── backend/        # Node.js + Express + MongoDB
├── frontend/       # React.js with TailwindCSS + Webcam + Signature Pad

````

---

## 🛠️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org)
- [MongoDB Compass](https://www.mongodb.com/products/compass) for DB GUI
- [Git](https://git-scm.com)
- (Optional) [Postman](https://www.postman.com) for API testing
 
---

## 🚀 How to Run This Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
````

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
```

### Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/visitor-db
 
```

### Start MongoDB Server

```bash
mongod
```

### Run the Backend Server

```bash
npm start
# or if using nodemon
npx nodemon server.js
```

> Server runs on: [http://localhost:5000](http://localhost:5000)

---

## 🎨 Frontend Setup

```bash
cd ../frontend
npm install
```

### Run the Frontend

```bash
npm start
```

> App will open at: [http://localhost:3000](http://localhost:3000)
in browser you are using.
---

## 💡 Features

* 📋 Register visitor with name & reason
* 📸 Capture photo using webcam
* ✍️ Collect digital signature
* 🧾 Store all data to MongoDB
 
---

 
## 🤝 Contributing

To contribute:

1. Fork this repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Added feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request

---
 

 
