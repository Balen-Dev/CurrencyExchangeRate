const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"), 
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");


for (let i = 0; i < dropList.length; i++) {
  // Selecting USD & IQD as default currencies
  for (currency_code in country_code) {
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } 
    else if (i == 1) {
      selected = currency_code == "IQD" ? "selected" : "";
    }

    // Creating the optionTags from the country-list object
    let optionTag = ` <option value="${currency_code}" ${selected}>${currency_code}</option>`;

    // Inserting options tag into select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", e => {
    loadFlag(e.target); // Changing flags according to user's choice
  });
}

// Load the correct flags
function loadFlag(element) {
  for (code in country_code) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://www.countryflags.io/${country_code[code]}/flat/64.png`;
    }
  }
}

// Instantly calculating the exchange rate after the document has loaded 
window.addEventListener("load", () => {
  getExchangeRate(); // Function call
});

//Listening for click events on the button
getButton.addEventListener("click", e => {
  e.preventDefault(); // Prevents form from submitting
  getExchangeRate(); // Function call
});

// Making the swap icon functional
const swapIcon =  document.querySelector(".drop-list .icon");
swapIcon.addEventListener("click", () => {

  // Swap takes place
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;

  // Load correct flags
  loadFlag(fromCurrency);
  loadFlag(toCurrency);

  // Load new exchange rate
  getExchangeRate();
})

async function getExchangeRate() {
  // It is crucial that we declare this variable outside of the try scope
  let exchangeRateTxt = document.querySelector(".exchange-rate");
  
 try {
    // Grabbing necessary elements from the DOM
  const amount = document.querySelector(".amount input");
  let amountVal = amount.value;

  // If user enters 0 or leaves it blank we will replace it with 1 by default
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }

  // Reseting the exchange rate
  exchangeRateTxt.innerText = "Calculating...";

  // Calling the API and storing the response in a variable
  let URL = `https://v6.exchangerate-api.com/v6/c33ebdd27f82ed799d48786c/latest/${fromCurrency.value}`;

  let request = await fetch(URL);
  let response = await request.json();
  
  let exchangeRate = response.conversion_rates[toCurrency.value];

  let totalExchangeRate = (amountVal * exchangeRate).toFixed(2); 

  exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
 }
 catch {
   exchangeRateTxt.innerText = "Something went wrong, please try again!"
 }
}
