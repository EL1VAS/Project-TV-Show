//You can edit ALL of the code here
function populateEpisodeSelector(episodes) {
  const select = document.getElementById("episode-select");

  for (let i = 0; i < episodes.length; i++) {
    const episode = episodes [i];

    const option = document.createElement("option");

    const episodeCode = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number
      .toString()
      .padStart(2, "0")}`;

    option.textContent = `${episodeCode} - ${episode.name}`;
    option.value = episode.id;

    select.appendChild(option);
  }
}

function setup() {
  const allEpisodes = getAllEpisodes(); //Get the array
  populateEpisodeSelector(allEpisodes);
  makePageForEpisodes(allEpisodes);
  onEpisodeSelect(); // Pass array to the function
}

function makePageForEpisodes(episodeList) {
  // Receive it as an episode list
  const rootElem = document.getElementById("root"); // Access the root in html
  rootElem.textContent = ""; // Initially keep context to empty
  for (let i = 0; i < episodeList.length; i++) {
    const episode = episodeList[i]; // Each episode in the iteration

    const episodeCard = document.createElement("div"); // Main episode card
    episodeCard.className = "episode-card";

    const episodeCode = document.createElement("h2"); // Title of episode
    episodeCode.textContent = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`; // Title display with season and episode number padded with a 0 in front
    episodeCode.className = "episode-title";

    const episodeImage = document.createElement("img"); // Image of the episode
    episodeImage.src = episode.image.medium.replace(/^http:/, "https:"); // Displays the medium image, changing http to https sop it can pass the lighthouse test of best practices
    episodeImage.className = "episode-img";
    episodeImage.setAttribute("alt", `Episode ${episodeCode}`);

    const episodeDescription = document.createElement("p"); // Description of the episode
    episodeDescription.innerHTML = episode.summary; // Displays the summary of the episode without the <p><\p> characters showing
    episodeDescription.className = "episode-summary";

    episodeCard.appendChild(episodeCode); // Appended the title,
    episodeCard.appendChild(episodeImage); // image and
    episodeCard.appendChild(episodeDescription); // summary to the episode card

    rootElem.appendChild(episodeCard); // Appended episode card to root element
  }
}

function onEpisodeSelect() {
  const select = document.getElementById("episode-select");

  select.addEventListener("change", function (event) {
    const selectId = event.target.value;
    const allEpisodes = getAllEpisodes();

    if (selectId === "") {
      makePageForEpisodes(allEpisodes);
      return;
    }
    const selectEpisode = allEpisodes.filter(function (episode) {
      return episode.id == selectId;
    });
    makePageForEpisodes(selectEpisode);
  })
}

window.onload = setup;
