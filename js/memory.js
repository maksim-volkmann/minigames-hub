const cards = document.querySelectorAll(".memory-card");
let hasFlippedCard = false;
let lockBoard = false;
let firstCard;
let secondCard;

cards.forEach((card) => card.addEventListener("click", flipCard));

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  checkForMatch();
}

const checkForMatch = () => {
  let isMatch = firstCard.dataset.tool === secondCard.dataset.tool;
  isMatch ? disableCards() : unflipCards();
};

const disableCards = () => {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
};

const unflipCards = () => {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 700);
};

const resetBoard = () => {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
  winCondition();
};

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

const winCondition = () => {
  const contains = Object.values(cards).every((card) =>
    card.classList.contains("flip")
  );
  if (contains) {
    const h1 = document.querySelector("h1");
    h1.innerHTML = "Win! Click to restart";
  }
};
