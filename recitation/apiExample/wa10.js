// Selectors for the interactive elements
const quoteBtn = document.querySelector('#js-new-quote');
const tweetBtn = document.querySelector('#js-tweet');
const quoteText = document.querySelector('#js-quote-text');
const authorText = document.querySelector('#js-author-text');
const tagsText = document.querySelector('#js-tags-text');

// API endpoint
const endpoint = "https://quoteslate.vercel.app/api/quotes/random";

// Object to store the current quote details
let current = {
  quote: "",
  author: "",
  tags: []
};

// Event listeners
quoteBtn.addEventListener('click', getNewQuote);
tweetBtn.addEventListener('click', tweetQuote);

// Function to fetch a new quote from the API
async function getNewQuote() {
  // Disable buttons and show loading state
  quoteBtn.disabled = true;
  tweetBtn.disabled = true;
  quoteText.textContent = "Loading...";
  authorText.textContent = "";
  tagsText.textContent = "";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();

    // Store quote details in the 'current' object
    current.quote = json.quote;
    current.author = json.author;
    current.tags = json.tags;

    // Display the new quote
    displayQuote();

  } catch (err) {
    console.log(err);
    quoteText.textContent = "Failed to get new quote. Please try again.";
    authorText.textContent = "";
  } finally {
    // Re-enable the 'New Quote' button regardless of success or failure
    quoteBtn.disabled = false;
  }
}

// Function to display the current quote on the page
function displayQuote() {
  quoteText.textContent = `"${current.quote}"`;
  authorText.textContent = `— ${current.author}`;
  
  // Format tags as hashtags and display them
  if (current.tags && current.tags.length > 0) {
    tagsText.textContent = current.tags.map(tag => `#${tag}`).join(' ');
  } else {
    tagsText.textContent = "";
  }

  // Re-enable the 'Tweet' button now that there is a quote to tweet
  tweetBtn.disabled = false;
}

// Function to handle the 'Tweet' button click (The Extension)
function tweetQuote() {
  // This function now just opens the Twitter homepage.
  const tweetUrl = `https://twitter.com`;
  
  // Open the Twitter home page in a new tab
  window.open(tweetUrl, '_blank');
}

// Load a quote automatically when the page opens
document.addEventListener('DOMContentLoaded', getNewQuote);