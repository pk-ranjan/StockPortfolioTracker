// Initialize variables
let totalInvestment = 0.0;
let totalPortfolioValue = 0.0;
let notInvestedAmount = 0.0;
let totalShares = 0;
const sharePrices = {
  Apple: 150.0,
  Microsoft: 300.0,
  Amazon: 3000.0,
  Google: 2000.0,
  Tesla: 700.0,
};
const investedCompanies = {}; // Stores investments in companies

// Initialize share data for each company
const shareData = {
  Apple: [],
  Microsoft: [],
  Amazon: [],
  Google: [],
  Tesla: [],
};

const averageSharePrices = {
  Apple: 0.0,
  Microsoft: 0.0,
  Amazon: 0.0,
  Google: 0.0,
  Tesla: 0.0,
};

function average(array) {
  let sum = 0;
  for (const element of array) {
    sum += element;
  }
  return sum / array.length;
}

function CalculateAverage() {
  for (const company in shareData) {
    const averagePrice = average(shareData[company]);
    averageSharePrices[company] = averagePrice;
  }
}

// Function to update share prices at regular intervals
function updateSharePrices() {
  for (const company in sharePrices) {
    const minChange = 1; // Minimum price change
    const maxChange = 20; // Maximum price change
    const randomChange =
      Math.floor(Math.random() * (maxChange - minChange + 1)) + minChange;
    const changeType = Math.floor(Math.random() * 2); // 0 or 1

    console.log(`Random change: ${randomChange}`);

    if (changeType === 0) {
      // Decrease the share price
      sharePrices[company] -= randomChange;
    } else {
      // Increase the share price
      sharePrices[company] += randomChange;
    }

    const currentPrice = sharePrices[company];
    const newPrice = currentPrice + randomChange;
    sharePrices[company] = newPrice;

    // Update the share price chart data
    shareData[company].push(newPrice);
  }
  updateDisplay();
}

// Update share prices every 2 minutes (120,000 milliseconds)
setInterval(updateSharePrices, 60000);

// Function to generate a random share price
function generateRandomPrice() {
  return parseFloat((Math.random() * 10).toFixed(2));
}

function calculateTotalShareValue() {
  let totalShareValue = 0.0;
  if (totalShares === 0) {
    console.log("No shares to calculate");
    return totalShareValue;
  }
  for (const company in investedCompanies) {
    const sharePrice = sharePrices[company];
    const shares = investedCompanies[company].shares;
    totalShareValue += sharePrice * shares;
  }
  console.log(`Total share value: ${totalShareValue}`);
  return totalShareValue;
}

// Function to update the share price chart for a specific company

function buyShares() {
  const investmentAmount = parseFloat(
    document.getElementById("investmentAmount").value
  );
  if (isNaN(investmentAmount) || investmentAmount <= 0) {
    alert("Invalid investment amount.");
    return;
  }

  const selectedShare = document.getElementById("shareOptions").value;
  const sharePrice = sharePrices[selectedShare];
  const sharesToBuy = Math.floor(investmentAmount / sharePrice);
  if (sharesToBuy <= 0) {
    alert("Not enough funds to buy shares at the current price.");
    return;
  }

  const cost = sharePrice * sharesToBuy;
  totalInvestment += investmentAmount;
  //totalInvestment += cost;
  totalShares += sharesToBuy;

  // Calculate the remaining amount
  const remainingAmount = investmentAmount - cost;
  notInvestedAmount += remainingAmount;

  // Update invested companies
  if (investedCompanies[selectedShare]) {
    investedCompanies[selectedShare].investment += cost;
    investedCompanies[selectedShare].shares += sharesToBuy;
  } else {
    investedCompanies[selectedShare] = {
      investment: cost,
      shares: sharesToBuy,
    };
  }
  // Simulate share price change
  totalPortfolioValue = calculateTotalShareValue() + notInvestedAmount;
  updateDisplay();
}

function getCurrentPortfolioValue() {
  return calculateTotalShareValue() + notInvestedAmount;
}
// Function to sell shares
function sellShares() {
  const selectedShare = prompt("Enter the company name to sell shares of:");
  if (!selectedShare) {
    return;
  }

  if (!investedCompanies[selectedShare]) {
    alert(`You do not have any shares of ${selectedShare}.`);
    return;
  }

  const sharePrice = sharePrices[selectedShare];
  const sharesToSell = parseFloat(
    prompt(`Enter the number of ${selectedShare} shares to sell:`)
  );

  if (!isNaN(sharesToSell) && sharesToSell > 0) {
    if (sharesToSell <= investedCompanies[selectedShare].shares) {
      const earnings = sharePrice * sharesToSell;
      totalPortfolioValue = earnings + notInvestedAmount;
      notInvestedAmount += earnings; // Add the earnings to notInvestedAmount
      totalShares -= sharesToSell;
      investedCompanies[selectedShare].investment -= earnings;
      investedCompanies[selectedShare].shares -= sharesToSell;

      if (investedCompanies[selectedShare].shares === 0) {
        delete investedCompanies[selectedShare];
      }

      // Simulate share price change
      // const newSharePrice = generateRandomPrice();
      // sharePrices[selectedShare] = newSharePrice;
      // shareData[selectedShare].push(newSharePrice);
    } else {
      alert(`You do not have enough shares of ${selectedShare} to sell.`);
    }
  }
  updateDisplay();
}

// Function to update the display
function updateDisplay() {
  document.getElementById("totalInvestment").textContent =
    totalInvestment.toFixed(2);
  document.getElementById("notInvestedAmount").textContent =
    notInvestedAmount.toFixed(2); // Update notInvestedAmount
  document.getElementById("totalShares").textContent = totalShares;
  document.getElementById("totalPortfolioValue").textContent =
    getCurrentPortfolioValue().toFixed(2);

  // Update invested companies list
  const investedCompaniesList = document.getElementById("investedCompanies");
  investedCompaniesList.innerHTML = "";
  for (const company in investedCompanies) {
    const listItem = document.createElement("li");
    listItem.textContent = `${company}: $${investedCompanies[
      company
    ].investment.toFixed(2)} (${investedCompanies[company].shares} shares)`;
    investedCompaniesList.appendChild(listItem);
  }
  // update average share prices list
  CalculateAverage();

  const averageSharePricesList = document.getElementById("averagePrices");
  averageSharePricesList.innerHTML = "";
  for (const company in averageSharePrices) {
    const listItem = document.createElement("li");
    listItem.textContent = `${company}: $${averageSharePrices[company].toFixed(
      2
    )}`;
    averageSharePricesList.appendChild(listItem);
  }
  //update profit loss
  const profitLoss = calculatePortfolioProfitLoss();
  document.getElementById("ProfitLoss").textContent = profitLoss;
  // Update all company charts
  updateCompanyChart();
}

// Function to update the share price chart for multiple companies
function updateCompanyChart() {
  //const ctx = document.getElementById("shareChart").getContext("2d");
  const canvasId = `shareChart`;
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Check if a chart with this canvas already exists
  const existingChart = Chart.getChart(ctx);

  // If an existing chart is found, destroy it
  if (existingChart) {
    existingChart.destroy();
  }

  // Create an array to store dataset objects
  const datasets = [];

  // Iterate through each company and create a dataset for it
  for (const company in shareData) {
    if (shareData.hasOwnProperty(company)) {
      datasets.push({
        label: `${company}`,
        data: shareData[company],
        borderColor: getRandomColor(), // You can implement a function to generate random colors
        fill: false,
      });
    }
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from(
        { length: shareData[Object.keys(shareData)[0]].length },
        (_, i) => i + 1
      ),
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

// Function to generate random colors
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function main() {
  // Initialize share data for each company and update charts
  for (const company in sharePrices) {
    shareData[company].push(sharePrices[company]);
  }
  // Update the display
  updateDisplay();
}

// Function to calculate portfolio profit or loss
function calculatePortfolioProfitLoss() {
  console.log("calculatePortfolioProfitLoss");
  console.log("totalPortfolioValue", totalPortfolioValue);
  console.log("totalInvestment", totalInvestment);
  // Calculate the profit or loss
  const profitLoss = totalPortfolioValue - totalInvestment;

  // Determine if it's a profit or a loss
  const result =
    profitLoss > 0
      ? `Profit: $${profitLoss.toFixed(2)}`
      : profitLoss < 0
      ? `Loss: $${(-profitLoss).toFixed(2)}`
      : "No profit or loss";

  return result;
}

main();
