// --- 1. Get Elements ---
// (These names are from your example)
const triviaBtn = document.querySelector('#js-new-quote');
const answerBtn = document.querySelector('#js-tweet');
const questionText = document.querySelector('#js-quote-text');
const answerText = document.querySelector('#js-answer-text');

// --- 2. API Endpoint ---
const endpoint = "https://zenquotes.io/api/random";

// --- 3. Global variable to store quote ---
// (We'll store 'quote' and 'author' instead of 'question' and 'answer')
let current = {
  quote: "",
  author: ""
};

// --- 4. Event Listeners ---
triviaBtn.addEventListener('click', newQuote);
answerBtn.addEventListener('click', showAuthor);

// --- 5. Get New Quote Function ---
async function newQuote() {
  // Show loading message
  questionText.textContent = "Loading...";
  answerText.textContent = "";
  
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();

    // *** KEY CHANGE IS HERE ***
    // ZenQuotes returns an ARRAY with ONE object in it.
    // So, we use json[0] to get the first item.
    // Then we use '.q' for the quote and '.a' for the author.
    current.quote = json[0]['q'];
    current.author = json[0]['a'];

    // Call display function
    displayQuote(current.quote);

  } catch (err) {
    console.log(err);
    alert('Failed to get new quote');
  }
}

// --- 6. Display Quote Function ---
// (This is your 'displayTrivia' function, renamed)
function displayQuote(quote) {
  questionText.textContent = quote;
  answerText.textContent = ""; // Hide author until button is clicked
}

// --- 7. Show Author Function ---
// (This is your 'newAnswer' function, renamed)
function showAuthor() {
  answerText.textContent = `- ${current.author}`;
}

// --- 8. Initial Load ---
// Load a quote automatically when the page opens
document.addEventListener('DOMContentLoaded', newQuote);