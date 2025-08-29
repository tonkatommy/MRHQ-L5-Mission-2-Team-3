const form = document.getElementById("riskForm");
const claimHistoryInput = document.getElementById("claimHistory");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const resultContainer = document.getElementById("resultContainer");
const resultContent = document.getElementById("resultContent");

// Keywords for highlighting
const keywords = ["crash", "scratch", "bump", "smash", "collide"];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const claimHistory = claimHistoryInput.value.trim();
  if (!claimHistory) {
    showError("Please enter your claim history.");
    return;
  }

  await submitForm(claimHistory);
});

clearBtn.addEventListener("click", () => {
  claimHistoryInput.value = "";
  hideResult();
  claimHistoryInput.focus();
});

async function submitForm(claimHistory) {
  setLoading(true);

  try {
    const response = await fetch("/api/v1/getRiskRating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ claimHistory }),
    });

    const data = await response.json();

    if (response.ok && data.riskRating !== undefined) {
      showSuccess(data.riskRating, claimHistory);
    } else {
      showError(data.error || "An error occurred while processing your request.");
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
    submitBtn.innerHTML = '<span class="spinner"></span>Processing...';
    submitBtn.disabled = true;
    form.classList.add("loading");
  } else {
    submitBtn.innerHTML = "Get Risk Rating";
    submitBtn.disabled = false;
    form.classList.remove("loading");
  }
}

function showSuccess(riskRating, claimHistory) {
  const riskLevel = getRiskLevel(riskRating);
  const detectedKeywords = findKeywords(claimHistory);

  resultContent.innerHTML = `
                <div class="risk-rating ${riskLevel.class}">${riskRating}/5</div>
                <div><strong>Risk Level:</strong> ${riskLevel.text}</div>
                ${
                  detectedKeywords.length > 0
                    ? `
                    <div class="keywords-detected">
                        <strong>Keywords detected:</strong> ${detectedKeywords.join(", ")} 
                        <small>(${detectedKeywords.length} occurrence${
                        detectedKeywords.length !== 1 ? "s" : ""
                      })</small>
                    </div>
                `
                    : '<div class="keywords-detected"><strong>No risk keywords detected</strong></div>'
                }
            `;

  resultContainer.className = "result-container show";
}

function showError(message) {
  resultContent.innerHTML = `<strong>Error:</strong> ${message}`;
  resultContainer.className = "result-container show error";
}

function hideResult() {
  resultContainer.className = "result-container";
}

function getRiskLevel(rating) {
  if (rating >= 4) return { text: "High Risk", class: "high" };
  if (rating >= 3) return { text: "Medium Risk", class: "medium" };
  return { text: "Low Risk", class: "low" };
}

function findKeywords(text) {
  const found = [];
  const lowerText = text.toLowerCase();

  keywords.forEach((keyword) => {
    const matches = lowerText.match(new RegExp(keyword, "g")) || [];
    for (let i = 0; i < matches.length; i++) {
      found.push(keyword);
    }
  });

  return found;
}

// Auto-focus on the textarea when page loads
window.addEventListener("load", () => {
  claimHistoryInput.focus();
});
