const form = document.getElementById("discountForm");
const ageInput = document.getElementById("age");
const experienceInput = document.getElementById("experience");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const resultContainer = document.getElementById("resultContainer");
const resultContent = document.getElementById("resultContent");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const age = parseInt(ageInput.value);
  const experience = parseFloat(experienceInput.value);

  if (!age || age < 16 || age > 100) {
    showError("Please enter a valid age (16-100).");
    return;
  }

  if (experience === null || experience === undefined || experience < 0 || experience > 60) {
    showError("Please enter valid driving experience (0-60 years).");
    return;
  }

  await calculateDiscount(age, experience);
});

clearBtn.addEventListener("click", () => {
  ageInput.value = "";
  experienceInput.value = "";
  hideResult();
  ageInput.focus();
});

async function calculateDiscount(age, experience) {
  setLoading(true);

  try {
    const response = await fetch("/getDiscount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ age, experience }),
    });

    const data = await response.json();

    if (response.ok && data.discount !== undefined) {
      showSuccess(data.discount, age, experience);
    } else {
      showError(data.error || "An error occurred while calculating the discount.");
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
    submitBtn.innerHTML = "Calculate Discount";
    submitBtn.disabled = false;
    form.classList.remove("loading");
  }
}

function showSuccess(discount, age, experience) {
  const breakdown = calculateBreakdown(age, experience);

  resultContent.innerHTML = `
                <div class="discount-display">
                    <div class="discount-value">${discount}%</div>
                    <div class="discount-badge">Total Discount: ${discount}%</div>
                </div>
                <div class="breakdown-container">
                    <div class="breakdown-card">
                        <div class="breakdown-title">Age Discount</div>
                        <div class="breakdown-value">+${breakdown.ageDiscount}%</div>
                        <div class="breakdown-desc">${getAgeDescription(age)}</div>
                    </div>
                    <div class="breakdown-card">
                        <div class="breakdown-title">Experience Discount</div>
                        <div class="breakdown-value">+${breakdown.experienceDiscount}%</div>
                        <div class="breakdown-desc">${getExperienceDescription(experience)}</div>
                    </div>
                </div>
                <div class="calculation-breakdown">
                    <strong>Calculation Breakdown:</strong><br>
                    Age: ${age} years → ${breakdown.ageDiscount}% discount<br>
                    Experience: ${experience} years → ${breakdown.experienceDiscount}% discount<br>
                    <strong>Total Discount: ${breakdown.ageDiscount}% + ${
    breakdown.experienceDiscount
  }% = ${discount}%</strong>
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

function calculateBreakdown(age, experience) {
  let ageDiscount = 0;
  let experienceDiscount = 0;

  if (age >= 25) {
    ageDiscount += 5;
    if (age >= 40) {
      ageDiscount += 5;
    }
  }

  if (experience >= 5) {
    experienceDiscount += 5;
    if (experience >= 10) {
      experienceDiscount += 5;
    }
  }

  return {
    ageDiscount,
    experienceDiscount,
  };
}

function getAgeDescription(age) {
  if (age >= 40) return "40+ years (mature driver)";
  if (age >= 25) return "25-39 years (experienced)";
  return "Under 25 (young driver)";
}

function getExperienceDescription(experience) {
  if (experience >= 10) return "10+ years (highly experienced)";
  if (experience >= 5) return "5-9 years (experienced)";
  return "Under 5 years (new driver)";
}

function quickFill(age, experience) {
  ageInput.value = age;
  experienceInput.value = experience;
}

// Auto-focus on the age input when page loads
window.addEventListener("load", () => {
  ageInput.focus();
});

// Add validation to prevent negative values
ageInput.addEventListener("input", () => {
  if (ageInput.value < 0) ageInput.value = 0;
});

experienceInput.addEventListener("input", () => {
  if (experienceInput.value < 0) experienceInput.value = 0;
});
