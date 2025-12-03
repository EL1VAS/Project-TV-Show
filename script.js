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
    const episode = episodeList[i]; // Each episode in the iteration

    const episodeCard = document.createElement("div"); // Main episode card

    const episodeCode = document.createElement("h2"); // Title of episode
    episodeCode.textContent = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`; // Title display with season and episode number padded with a 0 in front

    const episodeImage = document.createElement("img"); // Image of the episode
    episodeImage.src = episode.image.medium; // Displays the medium image

    const episodeDescription = document.createElement("p"); // Description of the episode
    episodeDescription.innerHTML = episode.summary; // Displays the summary of the episode without the <p><\p> characters showing

    episodeCard.appendChild(episodeCode); // Appended the title,
    episodeCard.appendChild(episodeImage); // image and
    episodeCard.appendChild(episodeDescription); // summary to the episode card

    rootElem.appendChild(episodeCard); // Appended episode card to root element
  }
}

window.onload = setup;
