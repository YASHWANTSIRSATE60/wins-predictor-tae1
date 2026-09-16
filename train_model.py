import os
import numpy as np
import joblib
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

def train_and_save_model():
    print("=" * 60)
    print("Training ML Model for Wins Prediction (TAE-1)")
    print("=" * 60)

    # 1. Synthesize statistical sports regression dataset (1200 team seasons)
    np.random.seed(42)
    n_samples = 1200

    runs_scored = np.random.normal(720, 75, n_samples).clip(550, 950)
    runs_allowed = np.random.normal(720, 75, n_samples).clip(550, 950)
    era = (runs_allowed / 162.0 * 0.92) + np.random.normal(0, 0.2, n_samples)
    era = era.clip(2.80, 5.80)
    batting_avg = (runs_scored / 3000.0) + np.random.normal(0.01, 0.008, n_samples)
    batting_avg = batting_avg.clip(0.220, 0.295)
    saves = 0.05 * runs_scored - 0.03 * runs_allowed + np.random.normal(25, 6, n_samples)
    saves = np.round(saves.clip(20, 60))

    run_differential = runs_scored - runs_allowed
    wins = (
        81.0
        + 0.098 * run_differential
        - 3.8 * (era - 4.10)
        + 0.22 * (saves - 40)
        + np.random.normal(0, 2.5, n_samples)
    )
    wins = np.round(wins.clip(45, 115))

    X = np.column_stack([runs_scored, runs_allowed, era, batting_avg, saves])
    y = wins

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = Ridge(alpha=1.0)
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"✓ Model Trained Successfully!")
    print(f"✓ R² Score             : {r2:.4f}")
    print(f"✓ Mean Absolute Error  : {mae:.2f} wins")

    os.makedirs("model", exist_ok=True)
    joblib.dump(model, "model/model.pkl")
    joblib.dump(scaler, "model/scaler.pkl")
    print(f"✓ Saved artifacts to 'model/model.pkl' & 'model/scaler.pkl'")
    print("=" * 60)

if __name__ == "__main__":
    train_and_save_model()
