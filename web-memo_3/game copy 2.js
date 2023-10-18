const selectors = {
  boardContainer: document.querySelector(".board-container"),
  board: document.querySelector(".board"),
  moves: document.querySelector(".moves"),
  timer: document.querySelector(".timer"),
  start: document.querySelector(".game-info"),
  startButton: document.querySelector(".start-button"),
  win: document.querySelector(".win"),
};

const state = {
  gameStarted: false,
  isPaused: false,
  flippedCards: 0,
  totalFlips: 0,
  totalTime: 0,
  loop: null,
};

// ljudtest 1
// Deklarera isMuted som en global variabel för
let isMuted = false;

// Lägg till händelselyssnare för mute-knappen
const muteButton = document.getElementById("mute-button");

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;

  // Anger knappens ljudstatus
  muteButton.innerHTML = isMuted ? "on?🔊" : "off?🔇";

  // För att stänga av alla ljud på sidan, kan du använda följande kod
  const audioElements = document.querySelectorAll(".card-audio");

  audioElements.forEach((audio) => {
    if (isMuted) {
      audio.pause(); // Stäng av ljudet
    } else {
      // Här kollar vi om ljudet är på innan vi spelar upp det
      const parentCard = audio.parentElement.parentElement;
      if (!parentCard.classList.contains("flipped")) {
        audio.pause(); // Sätt på ljudet om kortet inte är flipped
      }
    }
  });

  // Händelselyssnare för kortklickar
  function cardClickHandler() {
    if (!isMuted) {
      const audioElement = this.querySelector(".card-audio");
      audioElement.play();
    }
    playCardSound(`card${this.getAttribute("data-card")}`);
    if (state.flippedCards < 2) {
      flipCard(this);
    }
  }

  /* test 8
  function cardClickHandler() {
    const audioElement = this.querySelector(".card-audio");
    audioElement.play();
    playCardSound(`card${this.getAttribute("data-card")}`);
    if (state.flippedCards < 2) {
      flipCard(this);
    }
  }
*/
  // Lägg till händelselyssnare för kortklickar
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", cardClickHandler);
  });

  // Lägg till följande kod för att tysta alla kort om ljudet är avstängt
  if (isMuted) {
    document.querySelectorAll(".card").forEach((card) => {
      card.removeEventListener("click", cardClickHandler);
    });
  } else {
    // Om ljudet är på igen, låt korten reagera på klickar
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", cardClickHandler);
    });
  }
});

const shuffle = (array) => {
  const clonedArray = [...array];

  for (let i = clonedArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const original = clonedArray[i];

    clonedArray[i] = clonedArray[randomIndex];
    clonedArray[randomIndex] = original;
  }
  return clonedArray;
};

const pickRandom = (array, items) => {
  const clonedArray = [...array];
  const randomPicks = [];

  for (let i = 0; i < items; i++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);

    randomPicks.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return randomPicks;
};

const generateGame = () => {
  const dimensions = selectors.board.getAttribute("data-dimension");

  if (dimensions % 2 !== 0) {
    throw new Error("The dimension of the board must be an even number.");
  }

  const loadCards = async () => {
    // Hämta den valda kategorin från localStorage
    const selectedCategory = localStorage.getItem("selectedCategory");

    let dataFile;

    if (selectedCategory === "Frukter") {
      dataFile = "data/fruits.json";
    } else if (selectedCategory === "Grönsaker") {
      dataFile = "data/vegetables.json";
    } else if (selectedCategory === "Djur") {
      dataFile = "data/animals.json";
    } else if (selectedCategory === "Maträtter") {
      dataFile = "data/dishes.json";
    }

    try {
      const response = await fetch(dataFile);
      if (!response.ok) {
        throw new Error("Kunde inte ladda kortdata.");
      }

      const jsonData = await response.json();

      const cardsData = Object.values(jsonData).slice(
        0,
        (dimensions * dimensions) / 2
      );
      const duplicatedData = cardsData.concat(cardsData);
      const shuffledData = shuffle(duplicatedData);

      const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
          ${shuffledData
            .map(
              (data, index) => `
              <div class="card" data-card="${index + 1}">
                <div class="card-front"></div>
                <div class="card-back">
                  <span class="emoji">${data.emoji}</span>
                  <p class="card-text">${data.text}</p>
                  <audio class="card-audio" src="${data.audio}"></audio>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;

      const parser = new DOMParser().parseFromString(cards, "text/html");
      selectors.board.replaceWith(parser.querySelector(".board"));

      //TEST 2, 5 UTKOM
      /* // När du laddar korten
      document.querySelectorAll(".card").forEach((card, index) => {
        const audioElement = card.querySelector(".card-audio");
        card.addEventListener("click", () => {
          //   if (!isMuted) {
          if (!isMuted && !card.classList.contains("flipped")) {
            // Kontrollera om ljudet är mutat
            audioElement.play();
          }
          playCardSound(`card${index + 1}`);
          if (state.flippedCards < 2) {
            flipCard(card);
          }
        });
      });
*/
      //TEST UTKOMMENTERAT
      /*
      // Add event listener to play audio when a card is clicked
      document.querySelectorAll(".card").forEach((card, index) => {
        const audioElement = card.querySelector(".card-audio");
        card.addEventListener("click", () => {
          audioElement.play();
          playCardSound(`card${index + 1}`);
          if (state.flippedCards < 2) {
            flipCard(card);
          }
        });
      });
*/
      // Lägg till händelselyssnare för "Spela igen" när knappen är skapad.
      document
        .getElementById("play-again-button")
        .addEventListener("click", playAgain);
    } catch (error) {
      console.error("Ett fel uppstod:", error);
    }
  };

  loadCards();
};

/*
//TEST 3
// Deklarerar knappen
const muteButton = document.getElementById("mute-button");

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;

  // Uppdatera knappens text eller ikon beroende på ljudstatus
  muteButton.textContent = isMuted ? "off?🔇" : "on?🔊";

  // Om du vill stänga av alla ljud på sidan, kan du använda följande kod
  const audioElements = document.querySelectorAll(".card-audio");

  audioElements.forEach((audio) => {
    if (isMuted) {
      audio.pause(); // Stäng av ljudet
    } else {
      audio.play(); // Sätt på ljudet
    }
  });
});
*/

//
const startGame = () => {
  if (state.isPaused) {
    state.isPaused = false;
    selectors.startButton.innerText = "Pausa";
    selectors.startButton.classList.remove("disabled");
    selectors.boardContainer.classList.remove("disabled");

    state.loop = setInterval(() => {
      state.totalTime++;
      selectors.moves.innerText = `Drag${state.totalFlips}`;
      selectors.timer.innerText = `Tid: ${state.totalTime} sek`;
    }, 1000);
  } else {
    state.gameStarted = true;
    selectors.startButton.innerText = "Pausa";

    // Remove the "flipped" class from boardContainer
    selectors.boardContainer.classList.remove("flipped");

    state.loop = setInterval(() => {
      state.totalTime++;
      selectors.moves.innerText = `Drag: ${state.totalFlips}`;
      selectors.timer.innerText = `Tid: ${state.totalTime} sek`;
    }, 1000);
  }
};

const pauseGame = () => {
  state.isPaused = true;
  clearInterval(state.loop);
  selectors.startButton.innerText = "Starta";
  selectors.boardContainer.classList.add("disabled");
};

const flipBackCards = () => {
  document.querySelectorAll(".card:not(.matched)").forEach((card) => {
    card.classList.remove("flipped");
  });
  state.flippedCards = 0;
};

const flipCard = (card) => {
  state.flippedCards++;

  if (!state.gameStarted) {
    startGame();
  }

  if (state.flippedCards <= 2) {
    card.classList.add("flipped");
  }

  //test 6
  // Lägg till ljuduppspelningskoden här
  if (!isMuted) {
    const audioElement = card.querySelector(".card-audio");
    audioElement.play();
  }

  if (state.flippedCards === 2) {
    const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
    if (flippedCards[0].innerText === flippedCards[1].innerText) {
      flippedCards[0].classList.add("matched");
      flippedCards[1].classList.add("matched");
    }

    state.totalFlips++; // Räkna när två kort har vänts
    setTimeout(() => {
      flipBackCards();
    }, 1000);
  }

  if (!document.querySelectorAll(".card:not(.flipped)").length) {
    setTimeout(() => {
      selectors.boardContainer.classList.add("flipped");
      selectors.win.innerHTML = `
                <span class="win-text">
                    Bra gjort!<br />
                    med <span class="highlight">${state.totalFlips}</span>
                    drag<br />
                    på <span class="highlight">${state.totalTime}</span>
                    sekunder
                    <div><button class="button-style" id="play-again-button" onclick="playAgain()">Spela igen</button></div>
                </span>
                `;
      clearInterval(state.loop);
    }, 1000);
  }
};

const attachEventListeners = () => {
  document.addEventListener("click", (event) => {
    const eventTarget = event.target;
    const eventParent = eventTarget.parentElement;

    if (
      !state.isPaused &&
      eventTarget.className.includes("card") &&
      !eventParent.classList.contains("flipped")
    ) {
      flipCard(eventParent);
    } else if (eventTarget.className === "start-button") {
      if (state.gameStarted) {
        if (state.isPaused) {
          startGame();
        } else {
          pauseGame();
        }
      } else {
        startGame();
      }
    }
  });
};

generateGame();
attachEventListeners();

//TEST 4
document.querySelectorAll(".card").forEach((card, index) => {
  const audioElement = card.querySelector(".card-audio");
  card.addEventListener("click", () => {
    if (!isMuted && !card.classList.contains("flipped")) {
      audioElement.play();
    }
    playCardSound(`card${index + 1}`);
    if (state.flippedCards < 2) {
      flipCard(card);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const gameType = urlParams.get("game");
  let dataFolder = urlParams.get("dataFolder") || "";

  let dataFile;
  if (gameType === "fruits") {
    dataFile = `${dataFolder}/fruits.json`;
  } else if (gameType === "vegetables") {
    dataFile = `${dataFolder}/vegetables.json`;
  } else if (gameType === "animals") {
    dataFile = `${dataFolder}/animals.json`;
  } else if (gameType === "dishes") {
    dataFile = `${dataFolder}/dishes.json`;
  }

  fetch(dataFile)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Ett fel inträffade:", error);
    });
});

//spara spelresultat
const saveGameStatistics = () => {
  const completedGames = localStorage.getItem("completedGames");
  const totalMinutes = localStorage.getItem("totalMinutes");

  localStorage.setItem(
    "completedGames",
    completedGames ? parseInt(completedGames) + 1 : 1
  );
  localStorage.setItem(
    "totalMinutes",
    totalMinutes ? parseInt(totalMinutes) + state.totalTime : state.totalTime
  );
};

//spara spelresultat
document.addEventListener("DOMContentLoaded", function () {
  const completedGamesElement = document.getElementById("completedGames");
  const totalMinutesElement = document.getElementById("totalMinutes");

  const completedGames = localStorage.getItem("completedGames") || 0;
  const totalMinutes = localStorage.getItem("totalMinutes") || 0;

  completedGamesElement.textContent = `Antal avklarade spel: ${completedGames}`;
  totalMinutesElement.textContent = `Totalt antal spelade minuter: ${totalMinutes}`;
});

const gameCompleted = () => {
  // När ett spel är slutfört, anropa saveGameStatistics() för att spara data.
  saveGameStatistics();

  // Annan kod för att hantera när spelet är klart.
};

function playAgain() {
  // Reset game-related variables
  state.gameStarted = false;
  state.isPaused = false;
  state.flippedCards = 0;
  state.totalFlips = 0;
  state.totalTime = 0;
  clearInterval(state.loop);

  // Clear the game board
  selectors.board.innerHTML = "";

  // Remove the "flipped" class from boardContainer
  selectors.boardContainer.classList.remove("flipped");

  // Re-generate a new game
  generateGame();

  // Preserve the values of completed games and total minutes
  const completedGamesElement = document.getElementById("completedGames");
  const totalMinutesElement = document.getElementById("totalMinutes");
  const completedGames = parseInt(
    completedGamesElement.textContent.split(": ")[1]
  );
  const totalMinutes = parseInt(totalMinutesElement.textContent.split(": ")[1]);

  completedGamesElement.textContent = `Antal avklarade spel: ${completedGames}`;
  totalMinutesElement.textContent = `Totalt antal spelade minuter: ${totalMinutes}`;
}

document
  .getElementById("play-again-button")
  .addEventListener("click", playAgain);
