//You can edit ALL of the code here

function setup() {
  const allEpisodes = getAllEpisodes(); //Get the array
  makePageForEpisodes(allEpisodes); // Pass array to the function
}

function makePageForEpisodes(episodeList) {
  // Receive it as an episode list
  const rootElem = document.getElementById("root"); // Access the root in html
  rootElem.textContent = ""; // Initially keep context to empty
  for (let i = 0; i < episodeList.length; i++) {
    const episode = episodeList[i];
    const episodeCard = document.createElement("div"); // Main episode caard
    const episodeTitle = document.createElement("h2"); // Title of episode
    const episodeImage = document.createElement("img"); // Image of the episode
    const episodeDescription = document.createElement("article"); // Description of the episode
  }
}

window.onload = setup;
