import { initialDecks as decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

let form = null;
let submitBtn = null;
let textarea = null;

/**
 * Converts a string to a URL-safe slug.
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
 * Enables the New Deck form submit button.
 */
function disableSubmitBtn() {
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.removeAttribute("disabled");
  }
}

function initNewDeckForm() {
  form = document.querySelector("#new-deck-form");

  if (!form) {
    return;
  }

  submitBtn = form.querySelector(".new-deck-view__submit-btn");
  textarea = form.querySelector(".new-deck-view__textarea");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const submittedData = Object.fromEntries(formData);

    const jsonData = JSON.parse(submittedData["deck-json"]);
    const selectedColor = submittedData["deck-color"] || submittedData.color;
    const color = normalizeColor(selectedColor);
    const id = `${slugify(jsonData.name)}-${Date.now()}`;

    const newDeck = {
      id,
      color,
      name: jsonData.name,
      cards: jsonData.cards,
    };

    decks.push(newDeck);

    window.location.hash = `#deck/${id}`;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNewDeckForm, { once: true });
} else {
  initNewDeckForm();
}

export {
  disableSubmitBtn,
  slugify,
  normalizeColor,
};