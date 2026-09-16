# Predict the Number of Wins (W) using a Machine Learning Model

**TAE-1 Machine Learning Project**  
- **Student:** Yashwant Sirsate  
- **Roll No:** CM24060  
- **Department:** CSE (AI & ML)  

---

## 📌 Project Aim
This system uses team performance metrics (Runs Scored, Runs Allowed, ERA, Batting Average, and Saves) to predict the total expected regular-season wins ($W$) using a trained Ridge Linear Regression model.

---

## 🚀 Quick Setup & Run Instructions

### 1. Clone or Extract the Repository
```bash
cd wins_predictor
```

### 2. Create and Activate Virtual Environment
```bash
# On Windows:
python -m venv venv
venv\Scripts\activate

# On Mac/Linux:
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. (Optional) Retrain the Model
*Note: Pre-trained model files `model.pkl` and `scaler.pkl` are already included in the `model/` folder.*
```bash
python train_model.py
```

### 5. Launch the Web Application
```bash
python app.py
```

### 6. View Website in Browser
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 📂 Project Architecture
```text
wins_predictor/
├── train_model.py         # Trains the Ridge Regression model and exports weights
├── app.py                 # Flask server with /predict API endpoint
├── requirements.txt       # Project dependencies
├── README.md              # Project documentation
├── .gitignore             # Standard git exclusions
├── model/
│   ├── model.pkl          # Serialized trained model
│   └── scaler.pkl         # Serialized StandardScaler
├── templates/
│   └── index.html         # Single-page ML presentation UI
└── static/
    ├── css/
    │   └── style.css      # Presentation-friendly responsive CSS
    └── js/
        └── main.js        # Client validation & API communication
```
