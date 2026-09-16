import os
import joblib
import numpy as np
from flask import Flask, render_template, request, jsonify

# Auto-train if missing
if not os.path.exists("model/model.pkl") or not os.path.exists("model/scaler.pkl"):
    import train_model
    train_model.train_and_save_model()

app = Flask(__name__)

# Load model and scaler
model = joblib.load("model/model.pkl")
scaler = joblib.load("model/scaler.pkl")

FEATURE_KEYS = ["runs_scored", "runs_allowed", "era", "batting_avg", "saves"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"success": False, "error": "Please provide input data."}), 400

        for key in FEATURE_KEYS:
            if key not in data or data[key] is None or str(data[key]).strip() == "":
                return jsonify({"success": False, "error": "Please enter all required values."}), 400

        try:
            r = float(data["runs_scored"])
            ra = float(data["runs_allowed"])
            era = float(data["era"])
            ba = float(data["batting_avg"])
            sv = float(data["saves"])
        except ValueError:
            return jsonify({"success": False, "error": "Please enter valid numeric values."}), 400

        if not (200 <= r <= 1500 and 200 <= ra <= 1500):
            return jsonify({"success": False, "error": "Runs must be between 200 and 1500."}), 400
        if not (1.0 <= era <= 10.0):
            return jsonify({"success": False, "error": "ERA must be between 1.00 and 10.00."}), 400
        if not (0.150 <= ba <= 0.400):
            return jsonify({"success": False, "error": "Batting Average must be between 0.150 and 0.400."}), 400
        if not (0 <= sv <= 100):
            return jsonify({"success": False, "error": "Saves must be between 0 and 100."}), 400

        raw_features = np.array([[r, ra, era, ba, sv]], dtype=float)
        scaled_features = scaler.transform(raw_features)

        raw_prediction = model.predict(scaled_features)[0]
        predicted_wins = int(np.clip(round(raw_prediction), 0, 162))

        if predicted_wins >= 95:
            analysis = "Championship Contender (Elite Tier)"
        elif predicted_wins >= 82:
            analysis = "Playoff Caliber Team (Winning Record)"
        elif predicted_wins >= 72:
            analysis = "Average / Competitive Team"
        else:
            analysis = "Rebuilding Phase (Defensive/Offensive improvements required)"

        return jsonify({
            "success": True,
            "predicted_wins": predicted_wins,
            "analysis": analysis,
            "message": "Prediction completed successfully."
        })

    except Exception as e:
        return jsonify({"success": False, "error": "An error occurred during prediction."}), 500

if __name__ == "__main__":
    print("\n* TAE-1 Wins Predictor Server Running")
    print("* Local URL: http://127.0.0.1:5000\n")
    app.run(debug=True, host="127.0.0.1", port=5000)
