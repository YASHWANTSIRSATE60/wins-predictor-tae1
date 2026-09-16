document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prediction-form");
  const predictBtn = document.getElementById("predict-btn");
  const sampleBtn = document.getElementById("sample-data-btn");
  const resetBtn = document.getElementById("reset-btn");
  const statusBox = document.getElementById("status-box");

  const resultPlaceholder = document.getElementById("result-placeholder");
  const resultDisplay = document.getElementById("result-display");
  const winCount = document.getElementById("win-count");
  const winAnalysis = document.getElementById("win-analysis");

  // Sample data presets for instant classroom demo
  const sampleData = {
    runs_scored: 785,
    runs_allowed: 640,
    era: 3.65,
    batting_avg: 0.268,
    saves: 47
  };

  function showStatus(message, type = "error") {
    statusBox.textContent = message;
    statusBox.className = `status-box ${type}`;
    statusBox.classList.remove("hidden");
  }

  function hideStatus() {
    statusBox.classList.add("hidden");
    statusBox.textContent = "";
  }

  sampleBtn.addEventListener("click", () => {
    document.getElementById("runs_scored").value = sampleData.runs_scored;
    document.getElementById("runs_allowed").value = sampleData.runs_allowed;
    document.getElementById("era").value = sampleData.era;
    document.getElementById("batting_avg").value = sampleData.batting_avg;
    document.getElementById("saves").value = sampleData.saves;

    showStatus("Sample data loaded. Click 'PREDICT WINS' to run the model.", "success");
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    hideStatus();
    resultDisplay.classList.add("hidden");
    resultPlaceholder.classList.remove("hidden");
  });

  // Client-Side ML Ridge Regression Engine
  function runMLInference(r, ra, era, ba, sv) {
    const means = [720.0, 720.0, 4.09, 0.250, 39.8];
    const stds = [74.2, 74.5, 0.45, 0.026, 6.2];

    const z_r = (r - means[0]) / stds[0];
    const z_ra = (ra - means[1]) / stds[1];
    const z_era = (era - means[2]) / stds[2];
    const z_ba = (ba - means[3]) / stds[3];
    const z_sv = (sv - means[4]) / stds[4];

    const weights = [7.28, -7.25, -1.71, 0.31, 1.36];
    const intercept = 81.0;

    let rawWins = intercept + (z_r * weights[0]) + (z_ra * weights[1]) + (z_era * weights[2]) + (z_ba * weights[3]) + (z_sv * weights[4]);

    return Math.max(0, Math.min(162, Math.round(rawWins)));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideStatus();

    const rVal = document.getElementById("runs_scored").value.trim();
    const raVal = document.getElementById("runs_allowed").value.trim();
    const eraVal = document.getElementById("era").value.trim();
    const baVal = document.getElementById("batting_avg").value.trim();
    const svVal = document.getElementById("saves").value.trim();

    if (!rVal || !raVal || !eraVal || !baVal || !svVal) {
      showStatus("Please enter all required values.", "error");
      return;
    }

    const r = parseFloat(rVal);
    const ra = parseFloat(raVal);
    const era = parseFloat(eraVal);
    const ba = parseFloat(baVal);
    const sv = parseFloat(svVal);

    if (isNaN(r) || isNaN(ra) || isNaN(era) || isNaN(ba) || isNaN(sv)) {
      showStatus("Please enter valid numbers.", "error");
      return;
    }

    if (r < 200 || r > 1500 || ra < 200 || ra > 1500) {
      showStatus("Runs must be between 200 and 1500.", "error");
      return;
    }
    if (era < 1.0 || era > 10.0) {
      showStatus("ERA must be between 1.00 and 10.00.", "error");
      return;
    }
    if (ba < 0.150 || ba > 0.400) {
      showStatus("Batting Average must be between 0.150 and 0.400.", "error");
      return;
    }
    if (sv < 0 || sv > 100) {
      showStatus("Saves must be between 0 and 100.", "error");
      return;
    }

    predictBtn.disabled = true;
    predictBtn.textContent = "COMPUTING...";

    setTimeout(() => {
      const predictedWins = runMLInference(r, ra, era, ba, sv);

      let analysis = "";
      if (predictedWins >= 95) {
        analysis = "Championship Contender (Elite Tier)";
      } else if (predictedWins >= 82) {
        analysis = "Playoff Caliber Team (Winning Record)";
      } else if (predictedWins >= 72) {
        analysis = "Average / Competitive Team";
      } else {
        analysis = "Rebuilding Phase (Defensive/Offensive improvements required)";
      }

      winCount.textContent = predictedWins;
      winAnalysis.textContent = analysis;

      resultPlaceholder.classList.add("hidden");
      resultDisplay.classList.remove("hidden");

      predictBtn.disabled = false;
      predictBtn.textContent = "PREDICT WINS";

      showStatus("Prediction completed successfully.", "success");
    }, 150);
  });
});
