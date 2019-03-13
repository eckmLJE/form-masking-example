// State

var formState = {
  country: ""
};

// Selectors

function getForm() {
  return document.querySelector("form");
}

function getInputs() {
  return document.querySelectorAll("input");
}

function getCountrySelect() {
  return document.querySelector("#country");
}

function getZipInput() {
  return document.querySelector("#zip");
}

function getZipInputCA() {
  return document.querySelector("#zipCA");
}

function getAllZipInputs() {
  return document.querySelectorAll(".zip");
}

function getTelInput() {
  return document.querySelector("#tel");
}

function getDateInput() {
  return document.querySelector("#date");
}

function getSuccess() {
  return document.querySelector("#success");
}

// Listeners

function addCountryListener() {
  getCountrySelect().addEventListener("change", handleSelectCountry);
}

function addSubmitListener() {
  getForm().addEventListener("submit", handleSubmit);
}

function addListeners() {
  addCountryListener();
  addSubmitListener();
}

// Event Handlers

function handleSelectCountry(e) {
  var country = e.currentTarget.value;
  setCountry(country);
}

function handleSubmit(e) {
  e.preventDefault();
  validateForm();
}

// Submit Validation

function validateForm() {
  getForm().classList.add("was-validated");
  console.log("submission successful");
  var success = getSuccess();
  success.textContent = "SUCCESS";
  setTimeout(function() {
    success.textContent = "";
  }, 3000);
}

// Form

function setCountry(country) {
  formState.country = country;
  getInputs().forEach(function(input) {
    input.value = "";
    input.disabled = !country;
  });
  country ? formatInputs(country) : resetZips();
}

// Inputs & Validation

function formatInputs(country) {
  hideAndDisableZips();
  switch (country) {
    case "US":
      var zipInput = getZipInput();
      zipInput.classList.remove("hidden");
      zipInput.disabled = false;
      formatUS(zipInput, country);
      break;
    case "CA":
      var zipInput = getZipInputCA();
      zipInput.classList.remove("hidden");
      zipInput.disabled = false;
      formatCA(zipInput, country);
      break;
    case "MX":
      var zipInput = getZipInput();
      zipInput.classList.remove("hidden");
      zipInput.disabled = false;
      formatMX(zipInput, country);
      break;
    default:
      console.log("Country not found.");
      break;
  }
}

function formatUS(zipInput, country) {
  zipInput.pattern = "[0-9]{5}"; // validation
  zipInput.maxLength = "5";
  zipInput.placeholder = "US ZIP Code";
  telCleave.setPhoneRegionCode(country);
}

function formatCA(zipInput, country) {
  zipInput.pattern = "[A-Za-z][1-9][A-Za-z][ -][1-9][A-Za-z][1-9]"; // validation
  zipInput.maxLength = "7";
  zipInput.placeholder = "CA Postal Code";
  telCleave.setPhoneRegionCode(country);
}

function formatMX(zipInput, country) {
  zipInput.pattern = "[0-9]{5}";
  zipInput.maxLength = "5";
  zipInput.placeholder = "MX Postal Code";
  telCleave.setPhoneRegionCode(country);
}

function hideAndDisableZips() {
  getAllZipInputs().forEach(function(ele) {
    ele.classList.add("hidden");
    ele.disabled = true;
    ele.placeholder = "Postal Code";
  });
}

function resetZips() {
  hideAndDisableZips();
  var zipInput = getZipInput();
  zipInput.classList.remove("hidden");
  zipInput.placeholder = "Postal Code";
}

// Custom onInput Validation

getDateInput().addEventListener("input", validateDate);

function validateDate() {
  var inputMonth = parseInt(dateCleave.getRawValue().slice(0, 2));
  var inputYear = parseInt(dateCleave.getRawValue().slice(2));
  var today = new Date();
  today.getFullYear() > inputYear
    ? getDateInput().setCustomValidity("Expiry must be in the future.")
    : today.getMonth() + 1 > inputMonth
    ? getDateInput().setCustomValidity("Expiry must be in the future.")
    : getDateInput().setCustomValidity("");
}

getTelInput().addEventListener("input", validateTel);

function validateTel() {
  var telInputValue = getTelInput().value.replace(/-/g, "");
  var processedTel = processTel(telInputValue);
  processedTel.length === 10
    ? getTelInput().setCustomValidity("")
    : getTelInput().setCustomValidity("Please enter valid telephone.");
}

function processTel(telInputValue) {
  return telInputValue[0] === "1"
    ? telInputValue.slice(1, 11)
    : telInputValue.slice(0, 10);
}

// Cleave

var zipCleaveCA = new Cleave("#zipCA", {
  blocks: [3, 3],
  delimiter: "-",
  uppercase: true
});

var zipCleave = new Cleave("#zip", {
  numeral: true,
  numeralDecimalScale: 0,
  delimiter: "",
  numeralPositiveOnly: true,
  stripLeadingZeroes: false
});

var telCleave = new Cleave("#tel", {
  phone: true,
  phoneRegionCode: "US",
  delimiter: "-"
});

var dateCleave = new Cleave("#date", {
  date: true,
  datePattern: ["m", "Y"]
});

// Init

function initialize() {
  addListeners();
}

initialize();
