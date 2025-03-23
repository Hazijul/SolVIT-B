import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier

strq=input("Enter Query:")
def spam_detection(strq):
    file_path = "Book1.xlsx"
    df = pd.read_excel(file_path)
    df_deduplicated = df.drop_duplicates()
    df_deduplicated = df_deduplicated[~df_deduplicated['Query'].str.match(r'^\s*[:.,;\-]*\s*$')]
    df_deduplicated.dropna(how='all', inplace=True)
    df_deduplicated.reset_index(drop=True, inplace=True)
    df_deduplicated.to_excel(file_path, index=False)

    x = df_deduplicated["Query"]  
    y = df_deduplicated["SPAM/NOT_SPAM"]  
    X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.90, random_state=42, stratify=y)
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    svm_model = SVC(kernel="linear")
    svm_model.fit(X_train_tfidf, y_train)
    
    X_transformed = vectorizer.transform([strq])
    y_pred = svm_model.predict(X_transformed)
    
    print("The Query is Spam" if y_pred[0] == "SPAM" else "The Query is not Spam")

def query_classification(strq):
    file_path1 = "final_railway_queries.xlsx"
    df2 = pd.read_excel(file_path1)
    df_deduplicated2 = df2.drop_duplicates()
    df_deduplicated2['Query'].fillna(df_deduplicated2['Query'].mode()[0], inplace=True)
    df_deduplicated2['Domain'].fillna('Unknown', inplace=True)
    df_deduplicated2 = df_deduplicated2[~df_deduplicated2['Query'].str.match(r'^\s*[:.,;\-]*\s*$')]
    df_deduplicated2.dropna(how='all', inplace=True)
    df_deduplicated2.reset_index(drop=True, inplace=True)
    df_deduplicated2.to_excel(file_path1, index=False)
    
    df_deduplicated2["Combined_Label"] = df_deduplicated2["Sub-topic"] + " | " + df_deduplicated2["Domain"]
    x1 = df_deduplicated2["Query"]
    y1 = df_deduplicated2["Combined_Label"]
    x_train1, x_test1, y_train1, y_test1 = train_test_split(x1, y1, test_size=0.90, random_state=42)
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    X_train_tfidf1 = vectorizer.fit_transform(x_train1)
    rf_model = RandomForestClassifier(n_estimators=200, random_state=42)
    rf_model.fit(X_train_tfidf1, y_train1)
    
    X_transformed = vectorizer.transform([strq])
    y_pred = rf_model.predict(X_transformed)
    print(f"Predicted Category: {y_pred[0]}")

def query_analysis(strq):
    file_path3 = "binary_categorized_words.xlsx"
    df3 = pd.read_excel(file_path3)
    df_deduplicated3 = df3.drop_duplicates()
    df_deduplicated3 = df_deduplicated3[~df_deduplicated3['Word/Query'].str.match(r'^\s*[:.,;\-]*\s*$')]
    df_deduplicated3.dropna(how='all', inplace=True)
    df_deduplicated3.reset_index(drop=True, inplace=True)
    df_deduplicated3.to_excel(file_path3, index=False)

    good_words = set(df_deduplicated3[df_deduplicated3["Good"] == 1]["Word/Query"].dropna().str.lower())
    bad_words = set(df_deduplicated3[df_deduplicated3["Bad"] == 1]["Word/Query"].dropna().str.lower())
    extreme_bad_words = set(df_deduplicated3[df_deduplicated3["Extreme Bad"] == 1]["Word/Query"].dropna().str.lower())

    def heuristic_prediction(query):
        query_words = query.lower().split()
        category_counts = {
            "Good": sum(1 for word in query_words if word in good_words),
            "Bad": sum(1 for word in query_words if word in bad_words),
            "Extreme Bad": sum(1 for word in query_words if word in extreme_bad_words)
        }
        return "Normal" if all(count == 0 for count in category_counts.values()) else max(category_counts, key=category_counts.get)
    
    print(f"Experience: {heuristic_prediction(strq)}")

def execute_all(strq):
    spam_detection(strq)
    query_classification(strq)
    query_analysis(strq)
    query_priority(strq)

def query_priority(strq):
    file_path = "boss level queries.xlsx"
    df = pd.read_excel(file_path)
    df_deduplicated = df.drop_duplicates()
    df_deduplicated.to_excel(file_path, index=False)
    
    label_mapping = {"Low": 0, "Medium": 1, "High": 2}
    df_deduplicated["Priority"] = df_deduplicated["Priority"].map(label_mapping)
    X_train, X_test, y_train, y_test = train_test_split(df_deduplicated["Query"], df_deduplicated["Priority"], test_size=0.1, random_state=42)
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train_tfidf, y_train)
    
    X_transformed = vectorizer.transform([strq])
    prediction_numeric = rf_model.predict(X_transformed)[0]
    inverse_label_mapping = {0: "Low", 1: "Medium", 2: "High"}
    print(f"Predicted Priority: {inverse_label_mapping[prediction_numeric]}")

while True:
    print("\nMenu:")
    print("1. Spam Detection")
    print("2. Query Classification")
    print("3. Query Analysis")
    print("4. Query Prioritization")
    print("5. Execute All")
    print("6. Exit")
    choice = input("Enter your choice: ")
    
    if choice == '1':
        spam_detection(strq)
    elif choice == '2':
        query_classification(strq)
    elif choice == '3':
        query_analysis(strq)
    elif choice == '4':
        query_priority(strq)
    elif choice == '5':
        execute_all(strq)
    elif choice == '6':
        print("Exiting the program.")
        break
    else:
        print("Invalid choice. Please select a valid option.")
