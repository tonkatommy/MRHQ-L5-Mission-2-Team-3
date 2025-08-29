const form = document.getElementById("premiumForm");
const carValueInput = document.getElementById("carValue");
const riskRatingInput = document.getElementById("riskRating");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const integrateBtn = document.getElementById("integrateBtn");
const resultContainer = document.getElementById("resultContainer");
const resultContent = document.getElementById("resultContent");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const carValue = parseFloat(carValueInput.value);
  const riskRating = parseFloat(riskRatingInput.value);

  if (!carValue || carValue <= 0) {
    showError("Please enter a valid car value.");
    return;
  }

  if (!riskRating || riskRating < 1 || riskRating > 5) {
    showError("Please enter a valid risk rating (1-5).");
    return;
  }

  await calculatePremium(carValue, riskRating);
});

clearBtn.addEventListener("click", () => {
  carValueInput.value = "";
  riskRatingInput.value = "";
  hideResult();
  carValueInput.focus();
});

integrateBtn.addEventListener("click", async () => {
  // Demo integration - in real app, you'd call your other APIs
  const demoModel = "Civic";
  const demoYear = 2020;
  const demoClaimHistory = "Minor scratch last year, no other incidents.";

  setIntegrationLoading(true);

  try {
    // Simulate API calls
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulated values - replace with actual API calls
    const carValue = 6620; // From car value API
    const riskRating = 2; // From risk rating API

    carValueInput.value = carValue;
    riskRatingInput.value = riskRating;

    showSuccess(
      {
        monthly_premium: 11.0,
        yearly_premium: 132.4,
      },
      carValue,
      riskRating,
      true
    );
  } catch (error) {
    showError("Failed to integrate with other APIs.");
  } finally {
    setIntegrationLoading(false);
  }
});

async function calculatePremium(carValue, riskRating) {
  setLoading(true);

  try {
    const response = await fetch("/api/v1/getQuote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        car_value: carValue,
        risk_rating: riskRating,
      }),
    });

    const data = await response.json();

    if (response.ok && data.monthly_premium !== undefined && data.yearly_premium !== undefined) {
      showSuccess(data, carValue, riskRating, false);
    } else {
      showError(data.error || "An error occurred while calculating the premium.");
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to connect to the API. Please check if the server is running.");
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.innerHTML = '<span class="spinner"></span>Calculating...';
    submitBtn.disabled = true;
    form.classList.add("loading");
  } else {
    submitBtn.innerHTML = "Calculate Premium";
    submitBtn.disabled = false;
    form.classList.remove("loading");
  }
}

function setIntegrationLoading(isLoading) {
  if (isLoading) {
    integrateBtn.innerHTML = '<span class="spinner"></span>Integrating...';
    integrateBtn.disabled = true;
  } else {
    integrateBtn.innerHTML = "🔗 Get Values from Other APIs";
    integrateBtn.disabled = false;
  }
}

function showSuccess(data, carValue, riskRating, fromIntegration) {
  const integrationNote = fromIntegration
    ? '<div style="color: #f57c00; font-weight: 600; margin-bottom: 10px;">✨ Values auto-filled from other APIs</div>'
    : "";

  resultContent.innerHTML = `
                ${integrationNote}
                <div class="premium-display">
                    <div class="premium-card">
                        <div class="premium-label">Monthly Premium</div>
                        <div class="premium-value">$${data.monthly_premium.toLocaleString()}</div>
                    </div>
                    <div class="premium-card">
                        <div class="premium-label">Yearly Premium</div>
                        <div class="premium-value">$${data.yearly_premium.toLocaleString()}</div>
                    </div>
                </div>
                <div class="calculation-breakdown">
                    <strong>Calculation Breakdown:</strong><br>
                    Car Value: $${carValue.toLocaleString()}<br>
                    Risk Rating: ${riskRating}<br>
                    Formula: ($${carValue.toLocaleString()} × ${riskRating}) ÷ 100<br>
                    Yearly Premium: $${data.yearly_premium}<br>
                    Monthly Premium: $${data.yearly_premium} ÷ 12 = $${data.monthly_premium}
                </div>
            `;

  resultContainer.className = "result-container show";
}

function showError(message) {
  resultContent.innerHTML = `<div class="error-message">Error: ${message}</div>`;
  resultContainer.className = "result-container show error";
}

function hideResult() {
  resultContainer.className = "result-container";
}

function quickFill(carValue, riskRating) {
  carValueInput.value = carValue;
  riskRatingInput.value = riskRating;
}

// Auto-focus on the car value input when page loads
window.addEventListener("load", () => {
  carValueInput.focus();
});
