const triviaBtn = document.querySelector('#js-new-quote');
const answerBtn = document.querySelector('#js-tweet');
const questionText = document.querySelector('#js-quote-text');
const answerText = document.querySelector('#js-answer-text');

const endpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

let current = {
  question: "",
  answer: ""
};

triviaBtn.addEventListener('click', newTrivia);
answerBtn.addEventListener('click', newAnswer);

async function newTrivia() {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();

    current.question = json['question'];
    current.answer = json['answer'];

    displayTrivia(current.question);
  } catch (err) {
    console.log(err);
    alert('Failed to get new trivia');
  }
}

function displayTrivia(question) {
  questionText.textContent = question;
  answerText.textContent = ""; // hide answer until button is clicked
}

function newAnswer() {
  answerText.textContent = current.answer;
}

// Load a trivia question automatically when the page opens
document.addEventListener('DOMContentLoaded', newTrivia);
