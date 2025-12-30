//You can edit ALL of the code here

//At lvl 300 I have decided to clean the code for a better feature use and easy reading
//const API_URL = "https://api.tvmaze.com/shows/82/episodes";

let allEpisodes = []; // Added to hold our fetched data, full list
let filteredEpisodes = []; // Episodes currently shown, so the functions below alters this list rather than the allEpisodes one

const SHOWS_API_URL = "https://api.tvmaze.com/shows";

let allShows = []; // stores all fetched shows
let episodesCache = {}; // to not fetch the same URL twice

window.onload = function () {
  // Moved it up
  const rootElem = document.getElementById("root");
  rootElem.textContent = "Loading shows...";

  fetch(SHOWS_API_URL)
  .then((response) => response.json())
  .then((data) => {
    allShows = data;
    populateShowSelector(allShows);
    rootElem.textContent = "Please select a show";
    onShowSelect();
  })
  .catch((error) => {
    rootElem.textContent = "Error loading shows";
    console.error(error);
  });
  /*const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading-message";
  loadingDiv.textContent = "Loading episodes...";
  rootElem.appendChild(loadingDiv);

  fetch(API_URL)
    .then(function (response) {
      // returns the response as a json file
      return response.json();
    })
    .then(function (data) {
      allEpisodes = data; // Fills the empty array in our global scope
      filteredEpisodes = allEpisodes; // At this moment we aren't filtering
      rootElem.textContent = ""; // Clear loading text
      setup(); // Now we run all functions with the data that we fetced and filled the empty array
    })
    .catch(function (error) {
      rootElem.textContent = "Error loading episodes, please try again later.";
      console.error(error);
    });*/
};

function setup() {
  // Moved after the fetch function
  makePageForEpisodes(filteredEpisodes); // First loads the cards

  //update the episode count
  const count = document.getElementById("episode-count");
  count.textContent = `Showing ${filteredEpisodes.length} out of ${allEpisodes.length} episodes`;

  populateEpisodeSelector(allEpisodes); // adds the episodes to the dropdown menu once
  onEpisodeSelect(); // Filters by episode later
  onSearchInput(); // live search functionality later
}

function populateShowSelector(shows) {
  const showSelect = document.getElementById("show-select");
  showSelect.textContent = "";

  // sort alphabetically, not case sensitive
  const sortedShows = shows.sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a show";
  showSelect.appendChild(defaultOption);

  for (let show of sortedShows) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  }
}

function onShowSelect() {
  const showSelect = document.getElementById("show-select");

  showSelect.addEventListener("change", function (event) {
    const showId = event.target.value;

    // reset controls
    document.getElementById("episode-select").innerHTML =
    '<option value="">All episodes</option>';
    document.getElementById("search-input").value = "";

    if (!showID) {
      document.getElementById("root").textContent = "Please select a show";
      return;
    }
    // If episodes already fetched, reuse
    if (episodesCache[showId]) {
      loadEpisodes(episodesCache[showId]);
      return;
    }
    // otherwise fetch episodes
    const episodesURL = ´https://api.tvmaze.com/shows/${showId}/episodes´;

    fetch(episodesURL)
    .then((response)=> response.json())
    .then((episodes) => {
      episodesCache[showId] = episodes; // cache result
      loadEpisodes(episodes);
    })
    .catch((error)=>{
      document.getElementById("root").textContent =
        "Error loading episodes";
      console.error(error);
    });
  });
}

function loadEpisodes(episodes) {
  allEpisodes = episodes;
  filteredEpisodes = episodes;

  setup(); // reuses everything already built
}
function makePageForEpisodes(episodeList) {
  // Receive it as an episode list
  const rootElem = document.getElementById("root"); // Access the root in html
  rootElem.textContent = ""; // Initially keep context to empty

  for (let i = 0; i < episodeList.length; i++) {
    const episode = episodeList[i]; // Each episode in the iteration

    const episodeCard = document.createElement("div"); // Main episode card
    episodeCard.className = "episode-card"; // For styling
    episodeCard.id = `episode-${episode.id}`; //

    const episodeCode = document.createElement("h2"); // Title of episode
    episodeCode.textContent = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`; // Title display with season and episode number padded with a 0 in front
    episodeCode.className = "episode-title";

    const episodeImage = document.createElement("img"); // Image of the episode
    episodeImage.src = episode.image.medium.replace(/^http:/, "https:"); // Displays the medium image, changing http to https sop it can pass the lighthouse test of best practices
    episodeImage.className = "episode-img"; // For styling
    episodeImage.setAttribute("alt", `Episode ${episodeCode.textContent}`);
    episodeImage.setAttribute("width", "210"); // Added this for better performance
    episodeImage.setAttribute("height", "118");

    const episodeDescription = document.createElement("p"); // Description of the episode
    episodeDescription.innerHTML = episode.summary; // Displays the summary of the episode without the <p><\p> characters showing
    episodeDescription.className = "episode-summary";

    episodeCard.appendChild(episodeCode); // Appended the title,
    episodeCard.appendChild(episodeImage); // image and
    episodeCard.appendChild(episodeDescription); // summary to the episode card

    rootElem.appendChild(episodeCard); // Appended episode card to root element
  }
}

// dropdown function - fills the menu with all episodes information
function populateEpisodeSelector(episodes) {
  const select = document.getElementById("episode-select");

  for (let i = 0; i < episodes.length; i++) {
    const episode = episodes[i];
    const option = document.createElement("option"); // Adds new elements to our dropdown menu

    const episodeCode = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

    option.textContent = `${episodeCode} - ${episode.name}`;
    option.value = episode.id;
    select.appendChild(option);
  }
}

// selecting episode from dropdown menu
function onEpisodeSelect() {
  const select = document.getElementById("episode-select");

  select.addEventListener("change", function (event) {
    // get the selected episode
    const selectedId = event.target.value;

    // Reset search box
    document.getElementById("search-input").value = "";

    // if the option ALL EPISODES is selected, it shows all episodes
    if (selectedId === "") {
      filteredEpisodes = allEpisodes;
      makePageForEpisodes(filteredEpisodes);

      //update the episode count
      const count = document.getElementById("episode-count");
      count.textContent = `Showing ${filteredEpisodes.length} out of ${allEpisodes.length} episodes`;
      return;
    }

    const selectedEpisode = allEpisodes.filter(function (episode) {
      return episode.id == selectedId;
    });

    filteredEpisodes = selectedEpisode;
    makePageForEpisodes(filteredEpisodes); // only shows selected episode

    //update the episode count
    const count = document.getElementById("episode-count");
    count.textContent = `Showing ${filteredEpisodes.length} out of ${allEpisodes.length} episodes`;
    return;
  });
}

// live search functionality to the search input
function onSearchInput() {
  const searchInput = document.getElementById("search-input");

  //listen for user typing in the search box
  searchInput.addEventListener("input", function (event) {
    const searchTerm = event.target.value.toLowerCase(); //get the input and makes it lowercase

    // Reset dropdown to "All episodes"
    document.getElementById("episode-select").value = "";

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
    count.textContent = `Showing ${filteredEpisodes.length} out of ${allEpisodes.length} episodes`;
  });
}
