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

  form.addEventListener("submit", async (e) => {
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

    const payload = {
      runs_scored: parseFloat(rVal),
      runs_allowed: parseFloat(raVal),
      era: parseFloat(eraVal),
      batting_avg: parseFloat(baVal),
      saves: parseFloat(svVal)
    };

    if (
      isNaN(payload.runs_scored) ||
      isNaN(payload.runs_allowed) ||
      isNaN(payload.era) ||
      isNaN(payload.batting_avg) ||
      isNaN(payload.saves)
    ) {
      showStatus("Please enter valid numbers.", "error");
      return;
    }

    try {
      predictBtn.disabled = true;
      predictBtn.textContent = "COMPUTING...";

      const response = await fetch("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showStatus(data.error || "An error occurred during prediction.", "error");
        return;
      }

      winCount.textContent = data.predicted_wins;
      winAnalysis.textContent = data.analysis;

      resultPlaceholder.classList.add("hidden");
      resultDisplay.classList.remove("hidden");

      showStatus("Prediction completed successfully.", "success");

    } catch (err) {
      showStatus("Server connection error. Make sure app.py is running.", "error");
    } finally {
      predictBtn.disabled = false;
      predictBtn.textContent = "PREDICT WINS";
    }
  });
});
