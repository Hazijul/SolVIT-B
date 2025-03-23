import pandas as pd
import numpy as np
import joblib
from pymongo import MongoClient
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, IsolationForest

# ------------------ Load Dataset from MongoDB ------------------
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/?retryWrites=true&w=majority&appName=Prarabdh")
db = client["UrbanEye"]
collection = db["CivicIssue"]
df = pd.DataFrame(list(collection.find()))

# ------------------ Model 1: Severity Score Prediction ------------------
severity_column_transformer = ColumnTransformer([
    ("ohe", OneHotEncoder(handle_unknown='ignore'), ["Complaint_Category"]),
    ("scaler", StandardScaler(), ["Public_Sentiment_Score"])
])

X_severity = df[["Complaint_Category", "Public_Sentiment_Score"]]
Y_severity = df["Severity_Score"]

X_severity_transformed = severity_column_transformer.fit_transform(X_severity)
X_train_s, X_test_s, Y_train_s, Y_test_s = train_test_split(X_severity_transformed, Y_severity, test_size=0.2, random_state=42)

severity_model = RandomForestRegressor(n_estimators=200, random_state=42)
severity_model.fit(X_train_s, Y_train_s)

# ------------------ Model 2: Anomaly Detection ------------------
anomaly_features = ["Historical_Frequency", "Severity_Score", "Region"]
df = df.dropna(subset=anomaly_features)

anomaly_column_transformer = ColumnTransformer([
    ("num", StandardScaler(), ["Historical_Frequency", "Severity_Score"]),
    ("cat", OneHotEncoder(handle_unknown='ignore'), ["Region"])
])

X_anomaly = anomaly_column_transformer.fit_transform(df[anomaly_features])
anomaly_model = IsolationForest(contamination=0.1, random_state=42)
anomaly_model.fit(X_anomaly)

# ------------------ Model 3: Complaint Resolution Time Prediction ------------------
resolution_features = ["Severity_Score", "Complaint_Category", "Historical_Frequency"]
target = "Estimated_Resolution_Time_Days"

df = df.dropna(subset=resolution_features + [target])

X_resolution = df[resolution_features]
y_resolution = df[target]

X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X_resolution, y_resolution, test_size=0.2, random_state=42)

resolution_column_transformer = ColumnTransformer([
    ("num", StandardScaler(), ["Severity_Score", "Historical_Frequency"]),
    ("cat", OneHotEncoder(handle_unknown='ignore'), ["Complaint_Category"])
])

resolution_model = Pipeline([
    ("preprocessor", resolution_column_transformer),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

resolution_model.fit(X_train_r, y_train_r)

# ------------------ Save Models ------------------
joblib.dump(severity_model, "severity_model.pkl")
joblib.dump(anomaly_model, "anomaly_model.pkl")
joblib.dump(resolution_model, "resolution_model.pkl")
joblib.dump(severity_column_transformer, "severity_transformer.pkl")
joblib.dump(anomaly_column_transformer, "anomaly_transformer.pkl")
joblib.dump(resolution_column_transformer, "resolution_transformer.pkl")

print("Models and transformers saved successfully!")
