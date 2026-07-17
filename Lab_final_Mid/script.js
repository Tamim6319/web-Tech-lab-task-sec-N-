// ===== University Club Membership Registration - Validation Script =====

// Track failed submission attempts (used for the password lockout rule)
let failedAttempts = 0;
const MAX_ATTEMPTS = 3;

// Grab elements once using getElementById / querySelector
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const categorySelect = document.getElementById('category');
const reasonInput = document.getElementById('reason');

// Regular expressions used for validation
const nameRegex = /^[A-Za-z]+$/;                              // alphabets only
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;               // basic valid email format
const passwordRegex = /^(?=.*[\W_]).{8,}$/; // min 8 chars, at least 1 special character

// Helper: show an error message under a field and mark it invalid
function showError(inputEl, errorId, message) {
  document.getElementById(errorId).textContent = message;
  inputEl.classList.add('invalid');
}

// Helper: clear error message and invalid styling
function clearError(inputEl, errorId) {
  document.getElementById(errorId).textContent = '';
  inputEl.classList.remove('invalid');
}

// ---- Individual field validators ----

function validateName(inputEl, errorId, label) {
  const value = inputEl.value.trim();
  if (value === '') {
    showError(inputEl, errorId, `${label} is required.`);
    return false;
  }
  if (!nameRegex.test(value)) {
    showError(inputEl, errorId, `${label} must contain alphabets only.`);
    return false;
  }
  clearError(inputEl, errorId);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (value === '') {
    showError(emailInput, 'emailError', 'Email address is required.');
    return false;
  }
  if (!emailRegex.test(value)) {
    showError(emailInput, 'emailError', 'Please enter a valid email address.');
    return false;
  }
  clearError(emailInput, 'emailError');
  return true;
}

function validatePassword() {
  const value = passwordInput.value;

  // If account is locked, block validation entirely
  if (failedAttempts >= MAX_ATTEMPTS) {
    showError(passwordInput, 'passwordError', 'Account locked after 3 failed attempts. Please try again later.');
    return false;
  }

  if (value === '') {
    showError(passwordInput, 'passwordError', 'Password is required.');
    return false;
  }
  if (!passwordRegex.test(value)) {
    showError(
      passwordInput,
      'passwordError',
      'Password needs at least 8 characters and 1 special character.'
    );
    return false;
  }
  clearError(passwordInput, 'passwordError');
  return true;
}

function validateGender() {
  const genderChecked = document.querySelector('input[name="gender"]:checked');
  const errorEl = document.getElementById('genderError');
  if (!genderChecked) {
    errorEl.textContent = 'Please select one gender option.';
    return false;
  }
  errorEl.textContent = '';
  return true;
}

function validateClubs() {
  const clubsChecked = document.querySelectorAll('input[name="clubs"]:checked');
  const errorEl = document.getElementById('clubsError');
  if (clubsChecked.length === 0) {
    errorEl.textContent = 'Select at least one club.';
    return false;
  }
  errorEl.textContent = '';
  return true;
}

function validateCategory() {
  const value = categorySelect.value;
  if (value === '') {
    showError(categorySelect, 'categoryError', 'Please choose a valid club category.');
    return false;
  }
  clearError(categorySelect, 'categoryError');
  return true;
}

function validateReason() {
  const value = reasonInput.value.trim();
  if (value === '') {
    showError(reasonInput, 'reasonError', 'This field is required.');
    return false;
  }
  if (value.length < 20) {
    showError(reasonInput, 'reasonError', `Minimum 20 characters required (currently ${value.length}).`);
    return false;
  }
  clearError(reasonInput, 'reasonError');
  return true;
}

// ---- Live validation as the user types/selects (optional but nice UX) ----
firstNameInput.addEventListener('input', () => validateName(firstNameInput, 'firstNameError', 'First name'));
lastNameInput.addEventListener('input', () => validateName(lastNameInput, 'lastNameError', 'Last name'));
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);
categorySelect.addEventListener('change', validateCategory);
reasonInput.addEventListener('input', validateReason);

// ---- Form submission ----
form.addEventListener('submit', function (e) {
  e.preventDefault(); // stop default page reload/submission

  // Lockout check happens first
  if (failedAttempts >= MAX_ATTEMPTS) {
    submitBtn.disabled = true;
    successMessage.textContent = '';
    showError(passwordInput, 'passwordError', 'Too many failed attempts. Form is locked.');
    return;
  }

  const isFirstNameValid = validateName(firstNameInput, 'firstNameError', 'First name');
  const isLastNameValid = validateName(lastNameInput, 'lastNameError', 'Last name');
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isGenderValid = validateGender();
  const isClubsValid = validateClubs();
  const isCategoryValid = validateCategory();
  const isReasonValid = validateReason();

  const allValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPasswordValid &&
    isGenderValid &&
    isClubsValid &&
    isCategoryValid &&
    isReasonValid;

  if (allValid) {
    // Success: reset attempt counter and show confirmation
    failedAttempts = 0;
    successMessage.textContent = 'Registration submitted successfully!';
    form.reset();
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  } else {
    // Failed attempt: count it (mainly relevant to the password lock rule)
    failedAttempts++;
    successMessage.textContent = '';

    const remaining = MAX_ATTEMPTS - failedAttempts;
    if (remaining > 0) {
      showError(passwordInput, 'passwordError',
        (document.getElementById('passwordError').textContent || '') +
        ` (${remaining} attempt${remaining === 1 ? '' : 's'} left before lock)`
      );
    } else {
      submitBtn.disabled = true;
      showError(passwordInput, 'passwordError', 'Account locked after 3 failed attempts.');
    }
  }
});
