document.getElementById("fruit-game_1").addEventListener("click", () => {
  // Spara användarens val (t.ex. "Frukter") i localStorage eller genom att skicka som en parameter till game.html.
  localStorage.setItem("selectedCategory", "Frukter");

  // Navigera till game.html.
  window.location.href = "game.html?game=fruits&dataFolder=data";
});

document.getElementById("vegetables-game_1").addEventListener("click", () => {
  localStorage.setItem("selectedCategory", "Grönsaker");
  window.location.href = "game.html?game=vegetables&dataFolder=data";
});

document.getElementById("animals-game_1").addEventListener("click", () => {
  localStorage.setItem("selectedCategory", "Djur");
  window.location.href = "game.html?game=animals&dataFolder=data";
});

document.getElementById("dishes-game_1").addEventListener("click", () => {
  localStorage.setItem("selectedCategory", "Maträtter");
  window.location.href = "game.html?game=dishes&dataFolder=data";
});

//spara spelresultat
document.addEventListener("DOMContentLoaded", function () {
  const completedGamesElement = document.getElementById("completedGames");
  const totalMinutesElement = document.getElementById("totalMinutes");

  const completedGames = localStorage.getItem("completedGames") || 0;
  const totalMinutes = localStorage.getItem("totalMinutes") || 0;

  completedGamesElement.textContent = `Antal avklarade spel: ${completedGames}`;
  totalMinutesElement.textContent = `Totalt antal spelade minuter: ${totalMinutes}`;
});
