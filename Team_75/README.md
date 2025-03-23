# 🌆 UrbanEye: Civic Issue Prioritization System

![UrbanEye Banner](path-to-banner-image-or-url) <!-- Add a project banner here -->

---

## 📌 Problem Statement
Cities face numerous civic issues like *potholes, broken streetlights, water leakage, and garbage accumulation.* Authorities often struggle to prioritize which complaints to resolve first due to limited resources, leading to **delayed responses** and **inefficient issue management**.

---

## 💡 Solution: UrbanEye
UrbanEye is a *Flask & Node.js-powered civic issue prioritization system* that leverages *Machine Learning* to classify and rank civic complaints based on *severity* and *public sentiment*.

### 🔑 Key Features
- 🚦 **Automated Complaint Prioritization**: ML models rank complaints by severity.
- 😠 **Sentiment Analysis**: Understands urgency through public sentiment.
- 📊 **Real-time Data Processing**: Fetches and processes complaints dynamically.
- 🔗 **Seamless Integration**: Works with **MongoDB, Flask, and Node.js**.

---

## 🧠 ML Model Details
UrbanEye's core strength lies in its *Machine Learning models*, which:
1. **Understand Complaints**: Classify issues like potholes, garbage, and water leaks.
2. **Analyze Sentiment**: Detect emotions like frustration or anger in complaint text.
3. **Predict Severity**: Assign severity scores using historical data.
4. **Rank Issues**: Sort complaints by urgency for efficient resolution.

### 🛠 Models Used
| Model                  | Purpose                    | Technology       |
|------------------------|---------------------------|------------------|
| **Severity Prediction** | Predicts issue severity   | Regression       |
| **Sentiment Analysis**  | Analyzes complaint text   | Classification   |
| **Data Preprocessing**  | Encodes & scales features | OneHotEncoder, StandardScaler |

---

## 🔄 Project Workflow
1. **Users** submit complaints via the frontend.
2. The **Node.js server** handles authentication and sends data to **MongoDB**.
3. The **Flask server** processes complaints, applies ML models, and assigns severity scores.
4. The **priority list** is displayed on the frontend for authorities to act upon.

---

## 🛠 Technology Stack
| Component      | Technology           |
|---------------|----------------------|
| **Frontend**   | React.js             |
| **Backend**    | Node.js (Express.js) |
| **Database**   | MongoDB (Cloud Atlas) |
| **ML Models**  | Scikit-learn         |
| **Authentication** | JWT               |
| **Deployment** | AWS/GCP              |

---

## ⚙ Installation & Setup Guide

### Prerequisites
- **Node.js** (v16+)
- **Python** (3.8+)
- **MongoDB Atlas Account**
- **Virtual Environment (venv)** for Python

### 🔧 Backend (Node.js)
```bash
cd backend
npm install
node server2.js
```
### 🧠 Machine Learning Service (Flask)
```bash
cd backend/services
python -m venv venv
source venv/bin/activate   # On Windows use venv\Scripts\activate
pip install -r requirements.txt
python flask_api.py
```
## 🌟 Conclusion

UrbanEye provides an AI-powered solution for prioritizing civic complaints. By leveraging Machine Learning and Sentiment Analysis, it ensures authorities address the most severe issues first, improving city management and citizen satisfaction.

## 🤝 Contributors
- **Prarabdh Soni** (23BSA10021) [Team Lead] - Backend Development
- **Muskan Srivastav** (23BCE10014)- Backend Development
- **Pragalbh Sharma** (23BCE11286)- Machine Learning Integration
- **Shorya Pathak** (23BCE10194)- Machine Learning Integration
- **Umanshi Goyal** (23BCE11633)- Frontend and UI
- **Vraj Shah** (23BCE11796)- Frontend Development
