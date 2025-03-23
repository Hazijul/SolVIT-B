from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import joblib
import pandas as pd
from pymongo import MongoClient
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load models and transformers
severity_model = joblib.load("severity_model.pkl")
severity_transformer = joblib.load("severity_transformer.pkl")

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/?retryWrites=true&w=majority&appName=Prarabdh")
db = client["UrbanEye"]
collection = db["CivicIssue"]

@app.route("/priority-list", methods=["GET"])
def get_priority_list():
    try:
        # Fetch complaints from MongoDB
        complaints = list(collection.find())
        
        # Convert ObjectId to string
        for complaint in complaints:
            complaint["_id"] = str(complaint["_id"])
        
        df = pd.DataFrame(complaints)
        
        # Check if required columns exist
        if "Complaint_Category" not in df or "Public_Sentiment_Score" not in df or "Complaint_Text" not in df:
            return jsonify({"error": "Missing required columns in dataset"}), 400

        # Preprocess input data
        X_severity = df[["Complaint_Category", "Public_Sentiment_Score"]]
        X_transformed = severity_transformer.transform(X_severity)
        
        # Predict severity scores
        df["Predicted_Severity_Score"] = severity_model.predict(X_transformed)
        
        # Sort complaints by predicted severity in descending order
        priority_list = df.sort_values(by="Predicted_Severity_Score", ascending=False)
        
        # Convert to JSON response
        response = priority_list[["_id", "Complaint_Category", "Public_Sentiment_Score", "Complaint_Text", "Predicted_Severity_Score"]].to_dict(orient="records")
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
