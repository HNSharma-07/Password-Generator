const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()_-+={}[];:></?";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set indicator grey initially
setIndicator("#ccc");

//set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  //below for background color of slider
  const min = inputSlider.min;
  const max = inputSlider.max;

  // width + height
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
  // percentage area formula for width + height full
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function genRandNumber() {
  return getRandInteger(0, 9);
}

function genRandLowercase() {
  return String.fromCharCode(getRandInteger(97, 122)); //ascaii a->97; z->122
}

function genRandUppercase() {
  return String.fromCharCode(getRandInteger(65, 90)); //ascaii A->60; Z->90
}

function genRandSymbol() {
  const randInd = getRandInteger(0, symbols.length);
  return symbols.charAt(randInd);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymb = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymb = true;

  if (hasUpper && hasLower && (hasNumber || hasSymb) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasSymb || hasNumber) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  // to make copied span visible
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(arr) {
  // fisher yates method (only for Array)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  let str = "";
  arr.forEach((el) => {
    str += el;
  });
  return str;
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  // special case
  if (checkCount > passwordLength) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let's start the journey :)

  // remove new password
  password = "";

  //   // first put the stuff mentioned by checkboxes
  //   if (uppercaseCheck.checked) {
  //     password += genRandUppercase;
  //   }
  //   if (lowercaseCheck.checked) {
  //     password += genRandLowercase;
  //   }
  //   if (numbersCheck.checked) {
  //     password += genRandNumber;
  //   }
  //   if (symbolsCheck.checked) {
  //     password += genRandSymbol;
  //   }

  let funcArr = [];
  if (uppercaseCheck.checked) {
    funcArr.push(genRandUppercase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(genRandLowercase);
  }
  if (numbersCheck.checked) {
    funcArr.push(genRandNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(genRandSymbol);
  }

  //   compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //   remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randInd = getRandInteger(0, funcArr.length);
    password += funcArr[randInd]();
  }

  //   shuffle the password
  password = shufflePassword(Array.from(password));

  //   display it
  passwordDisplay.value = password;
  calcStrength();
});