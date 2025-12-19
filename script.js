//You can edit ALL of the code here

// dropdown function - fills the menu with all episodes information
function populateEpisodeSelector(episodes) {
  const select = document.getElementById("episode-select");

  for (let i = 0; i < episodes.length; i++) {
    const episode = episodes[i];
    // add new elements to our dropdown menu
    const option = document.createElement("option");

    //created the ep code
    const episodeCode = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

    //option elements: set the text shown in the dropdown,
    //store the episode is as value and add the option to
    // the selected element (add it to the dropdown menu)
    option.textContent = `${episodeCode} - ${episode.name}`;
    option.value = episode.id;
    select.appendChild(option);
  }
}

function setup() {
  const allEpisodes = getAllEpisodes(); //Get the array
  populateEpisodeSelector(allEpisodes); // adds the episodes to the dropdown menu
  makePageForEpisodes(allEpisodes);
  onEpisodeSelect(); // Pass array to the function
  onSearchInput(); // live search functionality
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
    episodeCode.textContent = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`; // Title display with season and episode number padded with a 0 in front
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

// live search functionality to the search input
function onSearchInput() {
  const searchInput = document.getElementById("search-input");

  //listen for user typing in the search box
  searchInput.addEventListener("input", function (event) {
    //get the input and makes it lowercase
    const searchTerm = event.target.value.toLowerCase();
    const allEpisodes = getAllEpisodes();

    // filters by name of summary
    const filteredEpisodes = allEpisodes.filter(function (episode) {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      );
    });
    makePageForEpisodes(filteredEpisodes); // display only the matching result

    //update the episode count
    const count = document.getElementById("episode-count");
    count.textContent = `Showing ${filteredEpisodes.length} episodes`;
  });
}

// selecting episode from dropdown menu
function onEpisodeSelect() {
  const select = document.getElementById("episode-select");

  select.addEventListener("change", function (event) {
    // get the selected episode
    const selectId = event.target.value;
    const allEpisodes = getAllEpisodes();

    // if the option ALL EPISODES is selected, it shows all episodes
    if (selectId === "") {
      makePageForEpisodes(allEpisodes);
      return;
    }
    const selectEpisode = allEpisodes.filter(function (episode) {
      return episode.id == selectId;
    });
    makePageForEpisodes(selectEpisode); // only shows selected episode
  });
}

window.onload = setup;
