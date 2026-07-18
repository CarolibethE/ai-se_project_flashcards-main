import { initialDecks as decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit-btn");

const errorModal = document.querySelector("#error-modal");
const errorModalCloseBtn = errorModal.querySelector(".modal__close-btn");
const errorMessage = errorModal.querySelector(".modal__error");

/**
 * Converts a string into a URL-safe slug.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a lowercase six-digit hex color with a leading "#".
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) {
    return "#64d583";
  }

  const hex = color.startsWith("#") ? color.slice(1) : color;

  if (!HEX_DIGITS.test(hex)) {
    return "#64d583";
  }

  return `#${hex.toLowerCase()}`;
}

/**
 * Checks that the deck name is a string between 2 and 80 characters.
 *
 * @param {*} name
 * @returns {string|null}
 */
function validateName(name) {
  if (
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 80
  ) {
    return null;
  }

  return name;
}

/**
 * Parses a JSON string without crashing the application.
 *
 * @param {string} jsonString
 * @returns {object|null}
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Displays the error modal with a helpful message.
 *
 * @param {string} message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorModal.classList.add("modal_visible");
}

/**
 * Enables the New Deck submit button.
 */
function disableSubmitBtn() {
  submitBtn.disabled = false;
}

errorModalCloseBtn.addEventListener("click", () => {
  errorModal.classList.remove("modal_visible");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const submittedData = Object.fromEntries(formData);

  const jsonData = parseJSON(submittedData["deck-json"]);

  if (!jsonData) {
    showError(
      "The deck JSON is invalid. Check the formatting and try again."
    );
    return;
  }

  const name = validateName(jsonData.name);

  if (!name) {
    showError(
      "The deck name must be a string between 2 and 80 characters."
    );
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("The cards field must be an array.");
    return;
  }

  const colorValue = normalizeColor(submittedData.color);

  if (typeof jsonData.color ==="string") {
    if (jsonData.color.toLowerCase() !== colorValue) {
        showError(
            "The color in the JSON doesn't match the selected color. Please make them match or remove the color field from the JSON."
        );
        return;
    }
  }
  const id = `${slugify(name)}-${Date.now()}`;

  const newDeck = {
    id,
    color: colorValue,
    name,
    cards: jsonData.cards,
  };

  decks.push(newDeck);

  window.location.hash = `deck/${id}`;
});

export { disableSubmitBtn };