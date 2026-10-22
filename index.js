// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

// Your code here!

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

async function fetchWeatherAlerts(state) {
  try {
    const response = await fetch(
      `https://api.weather.gov/alerts/active?area=${state}`,
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    displayAlerts(data);
  } catch (error) {
    console.log(error.message);

    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
  } finally {
    stateInput.value = "";
    fetchButton.disabled = false;
    fetchButton.textContent = "Get Weather Alerts";
  }
}

function displayAlerts(data) {
  // Remove old results
  alertsDisplay.replaceChildren();

  // Clear old errors after a successful fetch
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  // Display the summary in the format expected by the tests
  const summary = document.createElement("h2");
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  // Display alert headlines
  const alertList = document.createElement("ul");

  if (data.features.length === 0) {
    const item = document.createElement("li");
    item.textContent = "There are currently no active weather alerts.";
    alertList.appendChild(item);
  } else {
    data.features.forEach((alert) => {
      const item = document.createElement("li");

      item.textContent = alert.properties?.headline || "No headline available";

      alertList.appendChild(item);
    });
  }

  alertsDisplay.appendChild(alertList);
}

fetchButton.addEventListener("click", () => {
  const state = stateInput.value.trim().toUpperCase();

  // Clear previous results
  alertsDisplay.replaceChildren();
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  // Validate empty input
  if (!state) {
    errorMessage.textContent = "Please enter a state abbreviation.";
    errorMessage.classList.remove("hidden");
    stateInput.value = "";
    return;
  }

  if (!/^[A-Z]{2}$/.test(state)) {
    errorMessage.textContent =
      "Please enter a valid two-letter state abbreviation.";
    errorMessage.classList.remove("hidden");
    stateInput.value = "";
    return;
  }

  fetchButton.disabled = true;
  fetchButton.textContent = "Loading...";

  fetchWeatherAlerts(state);
});
