import streamlit as st
import pandas as pd
import numpy as np
from datetime import timedelta, datetime
from statsmodels.tsa.arima.model import ARIMA
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate("hospital-resource-manage-2b21e-firebase-adminsdk-fbsvc-e2bfc7430f.json")  # Replace with your Firebase key file path
    firebase_admin.initialize_app(cred)

db = firestore.client()

@st.cache_data
def load_resource_data():
    df = pd.read_csv("hospital_resources.csv")
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.sort_values("Date")
    return df

@st.cache_data
def load_arrival_data():
    df = pd.read_csv("patient_arrivals.csv")
    df["date"] = pd.to_datetime(df["date"]).dt.date
    return df

resources_df = load_resource_data()
arrivals_df = load_arrival_data()
latest = resources_df.iloc[-1].copy()

total_beds = 100
initial_resources = {
    "icu": int(latest["ICU_Available"]),
    "mri": int(latest["MRI_In_Use"]),
    "general": total_beds - int(latest["Bed_Occupancy_Rate"]),
    "ventilators": int(latest["Ventilators_In_Use"])
}
if "resource_state" not in st.session_state:
    st.session_state.resource_state = initial_resources.copy()
if "queue" not in st.session_state:
    st.session_state.queue = []

if st.button("🔁 Reset Queue & Resources"):
    try:
        # Delete all documents from the "patients" collection in Firestore
        patients_ref = db.collection("patients")
        docs = patients_ref.stream()
        for doc in docs:
            doc.reference.delete()
        st.success("All patient data removed from Firebase.")
    except Exception as e:
        st.error(f"Failed to delete data from Firebase: {e}")

    # Reset the queue and resources
    st.session_state.queue = []
    st.session_state.resource_state = initial_resources.copy()
    st.success("System reset successfully.")

st.title("🏥 Smart Hospital Resource Management Dashboard")

# Resource Display
st.subheader("📊 Current Hospital Resource Status")
res = st.session_state.resource_state
st.metric("ICU Beds", f"{res['icu']}")
st.metric("General Beds", f"{res['general']}")
st.metric("MRI Usage", f"{res['mri']}")
st.metric("Ventilators", f"{res['ventilators']}")

# Patient Registration
st.header("📝 Register New Patient")
with st.form("patient_form"):
    name = st.text_input("Name")
    age = st.number_input("Age", 0, 120, 30)
    problem = st.text_area("Describe the problem")
    urgency = st.selectbox("Urgency Level", ["Low", "Medium", "High"])
    if urgency == "Medium":
        resource_choice = st.radio("Allocate to:", ["ICU", "General", "Ventilator"])
    else:
        resource_choice = None
    submit = st.form_submit_button("Submit")

# Queue Handling
if submit:
    msg = ""
    if urgency == "High":
        # Allocate ICU
        if st.session_state.resource_state["icu"] > 0:
            st.session_state.resource_state["icu"] -= 1
            msg += "✅ ICU allocated. "
        else:
            msg += "⚠ ICU not available. "

        # Allocate MRI
        if st.session_state.resource_state["mri"] < 10:
            st.session_state.resource_state["mri"] += 1
            msg += "MRI used. "
        else:
            msg += "⚠ MRI not available. "

        # Allocate Ventilator
        if st.session_state.resource_state["ventilators"] > 0:
            st.session_state.resource_state["ventilators"] -= 1
            msg += "Ventilator allocated. "
        else:
            msg += "⚠ Ventilator not available. "

    elif urgency == "Medium":
        if resource_choice == "ICU":
            if st.session_state.resource_state["icu"] > 0:
                st.session_state.resource_state["icu"] -= 1
                msg = f"✅ ICU bed allocated to {name}"
            else:
                msg = f"⚠ ICU not available"
        elif resource_choice == "General":
            if st.session_state.resource_state["general"] > 0:
                st.session_state.resource_state["general"] -= 1
                msg = f"✅ General ward bed allocated to {name}"
            else:
                msg = f"⚠ General ward beds not available"
        elif resource_choice == "Ventilator":
            if st.session_state.resource_state["ventilators"] > 0:
                st.session_state.resource_state["ventilators"] -= 1
                msg = f"✅ Ventilator allocated to {name}"
            else:
                msg = f"⚠ Ventilators not available"

    else:  # Low urgency
        if st.session_state.resource_state["general"] > 0:
            st.session_state.resource_state["general"] -= 1
            msg = f"✅ General ward bed allocated to {name}"
        else:
            msg = f"⚠ No general ward beds available"

    # Add patient to the queue
    patient = {
        "name": name,
        "age": age,
        "problem": problem,
        "urgency": urgency,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    st.session_state.queue.append(patient)

    # Sort queue by urgency: High > Medium > Low
    urgency_rank = {"High": 0, "Medium": 1, "Low": 2}
    st.session_state.queue.sort(key=lambda x: urgency_rank[x["urgency"]])

    # Save patient data to Firebase Firestore
    try:
        # Add patient to Firestore and store the document ID
        doc_ref = db.collection("patients").add(patient)
        patient["firestore_id"] = doc_ref[1].id  # Store Firestore document ID
        st.success(f"{name} added to the queue and saved to Firebase.")
    except Exception as e:
        st.error(f"Failed to save patient data to Firebase: {e}")

    st.info(msg)
    st.rerun()  # Force a rerun to update the UI immediately

# Patient Queue
st.header("📋 Current Patient Queue")
avg_time = {"High": 10, "Medium": 20, "Low": 30}

# Always sort before displaying
urgency_rank = {"High": 0, "Medium": 1, "Low": 2}
st.session_state.queue.sort(key=lambda x: urgency_rank[x["urgency"]])

if st.session_state.queue:
    for i, patient in enumerate(st.session_state.queue):
        wait = 0 if i == 0 else sum([avg_time[p["urgency"]] for p in st.session_state.queue[:i]])
        eta = datetime.now() + timedelta(minutes=wait)
        col1, col2 = st.columns([4, 1])
        with col1:
            st.markdown(
                f"{i+1}. {patient['name']} (Age {patient['age']})\n"
                f"- Problem: {patient['problem']}\n"
                f"- Urgency: {patient['urgency']}\n"
                f"- Estimated Admission: ⏰ *{eta.strftime('%H:%M:%S')}* ({wait} mins)"
            )
        with col2:
            if st.button(f"✅ Complete {patient['name']}", key=f"done_{i}"):
                try:
                    # Delete the patient from Firebase Firestore
                    patient_id = patient.get("firestore_id")  # Get the Firestore document ID
                    if patient_id:
                        db.collection("patients").document(patient_id).delete()
                        st.success(f"{patient['name']} removed from Firebase.")
                    else:
                        st.error("Patient Firestore ID not found.")
                except Exception as e:
                    st.error(f"Failed to delete patient from Firebase: {e}")

                # Remove the patient from the queue
                st.session_state.queue.pop(i)
                st.rerun()
else:
    st.info("No patients in queue.")

# Urgency Chart
st.subheader("👥 Queue Urgency Mix")
if st.session_state.queue:
    urgency_df = pd.DataFrame(st.session_state.queue)
    urgency_chart = urgency_df["urgency"].value_counts().reset_index()
    urgency_chart.columns = ["Urgency", "Count"]
    st.bar_chart(urgency_chart.set_index("Urgency"))

# Forecasting
st.header("📈 Forecasting: Beds & Occupancy")

# ARIMA Forecast
st.subheader("🔮 ARIMA: Bed Occupancy Forecast (7 Days)")
ts = resources_df.set_index("Date")["Bed_Occupancy_Rate"].resample("D").mean().interpolate()
arima_model = ARIMA(ts, order=(3, 1, 2)).fit()
arima_forecast = arima_model.forecast(steps=7)
st.line_chart(arima_forecast)

# XGBoost Forecasts
st.subheader("🔮 Estimated Beds Predicted by the ML Model")
arrivals_df["dayofweek"] = pd.to_datetime(arrivals_df["date"]).dt.dayofweek
arrivals_df["trend"] = np.arange(len(arrivals_df))
X = arrivals_df[["dayofweek", "trend"]]
y = arrivals_df["patients_queued"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
model = XGBRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Monthly Forecast
future_30 = pd.DataFrame({
    "dayofweek": [(datetime.today() + timedelta(days=i)).weekday() for i in range(30)],
    "trend": np.arange(len(arrivals_df), len(arrivals_df) + 30)
})
future_30["predicted_beds"] = np.round(model.predict(future_30)).astype(int)
future_30["date"] = [datetime.today().date() + timedelta(days=i) for i in range(30)]

# Show predicted numbers for next 7 days
st.markdown("*Predicted Beds (Next 7 Days):*")
for i in range(7):
    st.write(f"{future_30.iloc[i]['date']}: 🛏 {future_30.iloc[i]['predicted_beds']} beds")

st.markdown("### 📅 Monthly Forecast (Next 30 Days)")
st.line_chart(future_30.set_index("date")["predicted_beds"])

# Yearly Forecast
future_365 = pd.DataFrame({
    "dayofweek": [(datetime.today() + timedelta(days=i)).weekday() for i in range(365)],
    "trend": np.arange(len(arrivals_df), len(arrivals_df) + 365)
})
future_365["predicted_beds"] = np.round(model.predict(future_365)).astype(int)
future_365["date"] = [datetime.today().date() + timedelta(days=i) for i in range(365)]
future_365["month"] = pd.to_datetime(future_365["date"]).dt.to_period("M")
monthly_avg = future_365.groupby("month")["predicted_beds"].mean().round().astype(int).reset_index()

st.markdown("### 📆 Yearly Forecast (Avg. Monthly Beds)")
st.line_chart(monthly_avg.set_index("month"))