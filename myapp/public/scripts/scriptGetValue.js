const form = document.getElementById("carValueForm");
const modelInput = document.getElementById("model");
const yearInput = document.getElementById("year");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const resultContainer = document.getElementById("resultContainer");
const resultContent = document.getElementById("resultContent");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const model = modelInput.value.trim();
  const year = parseInt(yearInput.value);

  if (!model) {
    showError("Please enter a car model.");
    return;
  }

  if (!year || isNaN(year)) {
    showError("Please enter a valid year.");
    return;
  }

  await submitForm(model, year);
});

clearBtn.addEventListener("click", () => {
  modelInput.value = "";
  yearInput.value = "";
  hideResult();
  modelInput.focus();
});

async function submitForm(model, year) {
  setLoading(true);

  try {
    const response = await fetch("/api/v1/getValue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, year }),
    });

    const data = await response.json();

    if (response.ok && data.car_value !== undefined) {
      showSuccess(data.car_value, model, year);
    } else {
      showError(data.error || "An error occurred while calculating the car value.");
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
    submitBtn.innerHTML = "Calculate Value";
    submitBtn.disabled = false;
    form.classList.remove("loading");
  }
}

function showSuccess(carValue, model, year) {
  const breakdown = calculateBreakdown(model, year);

  resultContent.innerHTML = `
                <div class="car-value">$${carValue.toLocaleString()}</div>
                <div><strong>Model:</strong> ${model}</div>
                <div><strong>Year:</strong> ${year}</div>
                <div class="calculation-breakdown">
                    <strong>Calculation Breakdown:</strong><br>
                    Letters in "${model}": ${breakdown.letters}<br>
                    Letter values sum: ${breakdown.letterSum}<br>
                    Formula: (${
                      breakdown.letterSum
                    } * 100) + ${year} = <strong>$${carValue.toLocaleString()}</strong>
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

function calculateBreakdown(model, year) {
  const letters = model.toUpperCase().replace(/[^A-Z]/g, "");
  let sum = 0;

  for (let char of letters) {
    sum += char.charCodeAt(0) - 64;
  }

  return {
    letters: letters,
    letterSum: sum,
  };
}

// Auto-focus on the model input when page loads
window.addEventListener("load", () => {
  modelInput.focus();
});

// Add some example data on double-click for quick testing
modelInput.addEventListener("dblclick", () => {
  const examples = ["Civic", "BMW", "Camry", "Tesla", "Ford"];
  modelInput.value = examples[Math.floor(Math.random() * examples.length)];
});

yearInput.addEventListener("dblclick", () => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 5, currentYear - 10];
  yearInput.value = years[Math.floor(Math.random() * years.length)];
});
