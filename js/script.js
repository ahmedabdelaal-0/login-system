'use strict';

/* ----------------- Variables ---------------- */
const inputUserName = document.querySelector('.form__user-name');
const inputUserEmail = document.querySelector('.form__user-email');
const inputUserPassword = document.querySelector('.form__user-password');
const allSignUpFormInputs = document.querySelectorAll(
  '.sign-up__form .input-field',
);

let usersDB = [];
let loggedInUser = '';

const userNameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/;
const userEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const userPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;

/* ----------------- Functions ---------------- */

// Get users data from the local storage
function getUsersDataFromLocalStorage() {
  if (window.localStorage.getItem('users') !== null)
    usersDB = JSON.parse(window.localStorage.getItem('users'));

  if (window.localStorage.getItem('logged-in-user') !== null)
    loggedInUser = JSON.parse(window.localStorage.getItem('logged-in-user'));
}
getUsersDataFromLocalStorage();

// Add users data to the local storage
function addUsersDataToLocalStorage() {
  window.localStorage.setItem('users', JSON.stringify(usersDB));

  window.localStorage.setItem('logged-in-user', JSON.stringify(loggedInUser));
}

function displayFormErrorMessage(inputField, message) {
  const errorFeedbackEle = inputField.nextElementSibling;

  inputField.classList.add('is-invalid');
  errorFeedbackEle.textContent = message;
  errorFeedbackEle.style.display = 'block';
}

// Validate sign up form inputs
function validateSignUpFormInput(inputField) {
  const inputValue = inputField.value.trim();
  const errorFeedbackEle = inputField.nextElementSibling;
  let regex;
  let inputIsValid = false;

  // Decide which regex to use for input validation
  if (inputField === inputUserName) {
    regex = userNameRegex;
  } else if (inputField === inputUserEmail) {
    regex = userEmailRegex;
  } else if (inputField === inputUserPassword) {
    regex = userPasswordRegex;
  }

  // Display error message if the input is invalid
  if (regex.test(inputValue) === false) {
    if (inputField === inputUserName) {
      displayFormErrorMessage(inputField, 'Please enter a valid name.');
    } else if (inputField === inputUserEmail) {
      displayFormErrorMessage(
        inputField,
        'Please enter a valid email address.',
      );
    } else if (inputField === inputUserPassword) {
      displayFormErrorMessage(inputField, 'Please enter a valid password.');
    }
  } else {
    inputIsValid = true;

    // Remove the error message
    inputField.classList.remove('is-invalid');
    errorFeedbackEle.style.display = 'none';
  }

  return inputIsValid;
}

// Check if the user is already registered
function isUserRegisteredBefore() {
  const userEmail = inputUserEmail.value.trim();
  let userIsRegistered = false;

  for (let i = 0; i < usersDB.length; i += 1) {
    if (usersDB[i].userEmail === userEmail) {
      userIsRegistered = true;
      break;
    }
  }

  return userIsRegistered;
}

// Add user to usersDB
function addUserToUsersDB() {
  const userInfo = {
    userName: inputUserName.value.trim(),
    userEmail: inputUserEmail.value.trim().toLowerCase(),
    userPassword: inputUserPassword.value.trim(),
  };

  usersDB.push(userInfo);
}

// Validate the sign in form inputs
function validateSignInForm() {
  let signInFormIsValid = false;
  const userEmail = inputUserEmail.value.trim().toLowerCase();
  const userPassword = inputUserPassword.value.trim();

  if (isUserRegisteredBefore()) {
    usersDB.forEach(userInfo => {
      if (
        userInfo.userEmail === userEmail &&
        userInfo.userPassword === userPassword
      ) {
        signInFormIsValid = true;
      }
    });
  } else {
    displayFormErrorMessage(inputUserEmail, 'This account is not registered');
  }

  return signInFormIsValid;
}

/* ------------------ Events ------------------ */

window.onload = () => {
  if (window.location.href.includes('welcome.html')) {
    if (loggedInUser !== '') {
      document.querySelector('.welcome-name').textContent =
        `👋🏽 Welcome ${loggedInUser}`;
    } else {
      window.location.href = './index.html';
    }
  }
};

// When the Log out button is clicked
document.addEventListener('click', e => {
  if (e.target.classList.contains('btn--log-out')) {
    loggedInUser = '';

    addUsersDataToLocalStorage();

    window.location.href = './index.html';
  }
});

// Validate the input on blur
allSignUpFormInputs.forEach(inputField => {
  inputField.addEventListener('blur', () => {
    validateSignUpFormInput(inputField);
  });
});

// When the sign up button is submitted
document.addEventListener('submit', e => {
  if (e.target.classList.contains('sign-up__form')) {
    e.preventDefault();

    let inputsIsValid = false;

    // Validate the user inputs
    allSignUpFormInputs.forEach(inputField => {
      inputsIsValid = validateSignUpFormInput(inputField)
        ? validateSignUpFormInput(inputField)
        : false;
    });

    if (isUserRegisteredBefore()) {
      inputsIsValid = false;

      displayFormErrorMessage(
        inputUserEmail,
        'This account is already registered',
      );
    }

    // If inputs is valid
    if (inputsIsValid) {
      addUserToUsersDB();
      addUsersDataToLocalStorage();

      // Send the user to the login page
      window.location.href = './index.html';
    }
  }
});

document.addEventListener('submit', e => {
  if (e.target.classList.contains('log-in__form')) {
    e.preventDefault();

    if (validateSignInForm()) {
      const userEmail = inputUserEmail.value.trim().toLowerCase();
      const userPassword = inputUserPassword.value.trim();

      usersDB.forEach(userInfo => {
        if (
          userInfo.userEmail === userEmail &&
          userInfo.userPassword === userPassword
        ) {
          loggedInUser = userInfo.userName;
        }
      });

      addUsersDataToLocalStorage();

      window.location.href = './welcome.html';
    }
  }
});
