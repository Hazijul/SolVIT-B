# 🏆 **Parko – Smart Parking, Smarter Travel** 🚗  
## Deployed (Specially for Mobile) [HERE 🔗](https://parko-user.vercel.app/)  
### **Developed by Team 20 | SolVIT Hackathon Submission**  

🔗 **Forked from** [devankit57/parko](https://github.com/devankit57/parko)  

--- 

## 🚀 **Overview**  

**Parko** is an **AI-powered smart parking and travel management system** designed to revolutionize urban mobility. It provides:  

💯 **Real-time parking availability** 📍  
💳 **Automated reservation & payments** 💳  
🔑 **QR-based entry/exit verification** 🔑  
📊 **AI-generated travel plans** 📺  
📱 **Seamless user experience** 📱  

By integrating **Next.js, MongoDB, Razorpay, and AI**, Parko makes urban travel more **efficient, secure, and sustainable.** 🌱  

---

## 🎯 **Problem Statement**  

🚦 **Urban parking is inefficient** – Finding a spot is time-consuming, leading to congestion.  
🕵️ **Manual systems are slow & error-prone** – Traditional parking lacks automation.  
🗓️ **Travel planning is chaotic** – Poor route management wastes time & fuel.  

### ✅ **Parko solves this by providing:**  
✔️ **Smart parking management** with live updates.  
✔️ **AI-powered travel planning** for optimal routes.  
✔️ **Automated, secure payments** & digital invoicing.  
✔️ **Scalability for smart cities, events & corporate spaces.**  

---

## 🔥 **Key Features**  

### 🚗 **Smart Parking Management**  
✔️ **Find & reserve parking** in real-time.  
✔️ **QR-based verification** for secure entry/exit.  
✔️ **View invoices & make instant payments.**  

### 🤖 **AI-Powered Travel Planning**  
✔️ **Generate optimized itineraries** based on user inputs.  
✔️ **Reduce travel time & fuel consumption.**  
✔️ **Store & retrieve past travel plans.**  

### 💳 **Seamless Digital Payments**  
✔️ **Integrated with Razorpay** for smooth transactions.  
✔️ **Instant invoice generation** for a hassle-free experience.  
✔️ **Secure and automated checkout process.**  

### 🔒 **API Security**  
✔️ **Responses are AES-356 encrypted** ensuring **secure data transmission.**  
✔️ **Environment Variables are used** to keep sensitive credentials safe.  
✔️ **Protected endpoints** prevent unauthorized access.  

### 📲 **User-Friendly Dashboard**  
✔️ **Intuitive UI** with easy navigation.  
✔️ **Real-time notifications & updates.**  
✔️ **Mobile-first design for accessibility.**  

---

## 🛠️ **System Architecture**  

### **Frontend (Next.js & React)**  
🚀 **Built with:**  
- Next.js for **SSR & performance optimization.**  
- Tailwind CSS for **fast, responsive design.**  
- Framer Motion for **smooth animations.**  
- React-QR-Code for **QR-based security.**  

### **Backend (Node.js & MongoDB)**  
🛠️ **Tech stack includes:**  
- **Next.js API routes** for handling user requests.  
- **MongoDB with Mongoose** for efficient data storage.  
- **Next-Auth for authentication** (Google Sign-In).  

### **Payments (Razorpay Integration)**  
💰 **Payment flow:**  
1. User generates an **invoice** for parking.  
2. Payment is processed via **Razorpay checkout.**  
3. **QR Code is generated** for exit verification.  

### **AI Module (Travel Planning)**  
🤓 **AI-Generated Plans**  
- Accepts user input (destination, duration, notes).  
- Returns **optimized routes & travel schedules.**  
- Plans are **stored & retrieved for future reference.**  

---

## 📞 **Parking Handler Side Application**  

🔗 **Admin Panel:** [parko-handler.vercel.app](https://parko-handler.vercel.app)  
🔐 **Credentials:**  
- **Username:** admin  
- **Password:** admin123  

This is used to **manage parking slots, user entries, and transaction verifications.**  

---

## 📚 **Directory Structure**  

```
/PARKO-USER
├── models
├── pages
│   ├── api
│   │   ├── auth
│   │   │   └── [...nextauth].js
│   │   ├── invoices.js
│   │   ├── parking.js
│   │   ├── razorpay.js
│   │   ├── travel-history.js
│   │   ├── travel-plan.js
│   │   └── verify-payment.js
│   ├── dashboard.js
│   └── index.js
├── public
├── styles
├── utils
│   └── db.js
├── README.md
└── tailwind.config.js
```

---

## 📷 **Project Screenshots**  

### **Parko Features**
![Parko Features](Images/5.png)


### **Mobile UI Screenshots**  
![Mobile Dashboard](Images/6.png)
![Mobile Payment](Images/7.png)

### **Parko**  
![Parko](Images/8.png)


---

## 🌟 **Why Parko Should Win?**  

🔥 **AI + Smart Parking = Innovation** – A unique blend of AI-driven travel planning & real-time parking.  
💰 **Digital Transformation** – Automating payments, reservations & verification.  
🚀 **Scalable & Future-Ready** – Usable by **governments, corporations & smart cities.**  
🌱 **Sustainability Impact** – Reducing **fuel waste & emissions.**  

💡 **Smart Parking, Smarter Travel – Parko is ready to transform urban mobility!** 🚀  

---

## 💎 **Final Thoughts**  
> 🚀 **Parko is not just an idea; it’s a revolution in smart mobility.**  
> **Vote for innovation. Vote for impact. Vote for Parko!** 🌍🏆  

---

