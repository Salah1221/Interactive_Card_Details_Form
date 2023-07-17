let cardNum = document.getElementById("number");
let cardNumInd = document.querySelector(".id-nb");
let cardName = document.getElementById("name");
let cardNameInd = document.querySelector(".card-name");
let month = document.getElementById("month");
let year = document.getElementById("year");
let dateInd = document.querySelector(".card-date");
let cvc = document.getElementById("cvc");
let cvcInd = document.querySelector(".back-card div");
let allInputs = document.querySelectorAll('input[type="text"]');
let inputWrappers = document.querySelectorAll(".input-wrapper");
let formInputs = document.querySelector(".form-inputs");
let formSubmitted = document.querySelector(".form-submitted");
let invMessageBoxes = document.querySelectorAll(".invalid");
let button = document.querySelector("button");

let isEmpty = [true, true, true, true, true];
let isValid = [false, false, false, false, false];

const removeSpaces = (e) => {
  let inputValue = e.target.value;
  inputValue = inputValue.split(" ").join("");
  e.target.value = inputValue;
  return inputValue;
};

const updateDateValue = (e, i) => {
  let dateValue = removeSpaces(e);
  let dateIndArr = dateInd.textContent.split("/");
  dateIndArr[i] = "0".repeat(2 - dateValue.length) + dateValue;
  dateInd.textContent = dateIndArr.join("/");
};

const showOrHideMsgBox = (el, isE, isV, invalidMessage) => {
  if (isE) {
    el.textContent = `Can't be blank`;
    el.classList.remove("disable");
  } else if (!isV) {
    el.textContent = invalidMessage;
    el.classList.remove("disable");
  } else {
    if (!el.classList.contains("disable")) el.classList.add("disable");
  }
};

const inputValidation = () => {
  let invalidMessage = "Wrong format, numbers only";
  invMessageBoxes.forEach((el) => {
    switch (el.previousElementSibling.id) {
      case "month-and-year-wrapper":
        isEmpty[2] = month.value === "";
        isEmpty[3] = year.value === "";
        isValid[2] = +month.value > 0 && +month.value <= 12;
        isValid[3] = +year.value >= 0;
        let isE = isEmpty[2] || isEmpty[3];
        let isV = isValid[2] && isValid[3];
        invalidMessage = `Invalid ${
          !isValid[2] && !isValid[3]
            ? "month and year"
            : !isValid[2]
            ? "month"
            : "year"
        }`;
        showOrHideMsgBox(el, isE, isV, invalidMessage);
        break;
      case "name-wrapper":
        isEmpty[0] = cardName.value === "";
        isValid[0] = !cardName.value.match(/\d|_|\W/g);
        invalidMessage = "Invalid name, letters only";
        showOrHideMsgBox(el, isEmpty[0], isValid[0], invalidMessage);
        break;
      case "cvc-wrapper":
        isEmpty[4] = cvc.value === "";
        isValid[4] = +cvc.value >= 100 && +cvc.value <= 999;
        showOrHideMsgBox(el, isEmpty[4], isValid[4], invalidMessage);
        break;
      case "id-wrapper":
        isEmpty[1] = cardNum.value === "";
        isValid[1] =
          cardNum.value.length === 19 &&
          (cardNum.value.match(/\d/g) ?? ["?"]).join("") ===
            cardNum.value.split(" ").join("");
        showOrHideMsgBox(el, isEmpty[1], isValid[1], invalidMessage);
        break;
    }
  });
  inputWrappers.forEach((inputWrapper, i) => {
    if (isEmpty[i] || !isValid[i]) inputWrapper.classList.add("invalid-input");
    else inputWrapper.classList.remove("invalid-input");
  });
};

window.onload = () => {
  cardNum.value = "";
  cardName.value = "";
  month.value = "";
  year.value = "";
  cvc.value = "";
};

cardName.addEventListener("input", (e) => {
  cardNameInd.textContent = e.target.value || "Jane Appleseed";
});

cardNum.addEventListener("input", (e) => {
  let num = removeSpaces(e);
  let numInd = num + "0".repeat(16 - num.length);
  numInd = numInd.match(/.{4}/g).join(" ");
  cardNumInd.textContent = numInd;
  if (num.length === 16) e.target.value = numInd;
});

month.addEventListener("input", (e) => updateDateValue(e, 0));
year.addEventListener("input", (e) => updateDateValue(e, 1));

cvc.addEventListener("input", (e) => {
  let cvcValue = removeSpaces(e);
  cvcInd.textContent = "0".repeat(3 - cvcValue.length) + cvcValue;
  console.log((cvc.value.match(/\d/g) ?? ["???"]).join("") === cvc.value);
});

allInputs.forEach((el, i) => {
  el.onfocus = () => {
    inputWrappers[i].classList.add("focus-input");
  };
  el.onblur = () => {
    inputWrappers[i].classList.remove("focus-input");
  };
  el.addEventListener("input", () => {
    inputWrappers[i].classList.remove("invalid-input");
    invMessageBoxes[i >= 3 ? i - 1 : i].classList.add("disable");
  });
});

button.addEventListener("click", (e) => {
  inputValidation();
  if (
    isEmpty[0] + isEmpty[1] + isEmpty[2] + isEmpty[3] + isEmpty[4] === 0 &&
    isValid[0] * isValid[1] * isValid[2] * isValid[3] * isValid[4] === 1
  ) {
    formInputs.style.height = formInputs.clientHeight + "px";
    formInputs.classList.add("disappear");
    document.documentElement.style.setProperty(
      "--minimize-height",
      formSubmitted.scrollHeight + "px"
    );
    setTimeout(() => {
      e.target.textContent = "Continue";
      formInputs.classList.add("disable");
      formSubmitted.classList.remove("hidden");
      formSubmitted.classList.add("appear");
    }, 900);
  }
});
