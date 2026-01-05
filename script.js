//You can edit ALL of the code here

//At lvl 300 I have decided to clean the code for a better feature use and easy reading
//const API_URL = "https://api.tvmaze.com/shows/82/episodes";

let allEpisodes = []; // Added to hold our fetched data, full list
let filteredEpisodes = []; // Episodes currently shown, so the functions below alters this list rather than the allEpisodes one

const SHOWS_API_URL = "https://api.tvmaze.com/shows";

let allShows = []; // stores all fetched shows
let episodesCache = {}; // to not fetch the same URL twice

function showShowsView() {
  document.getElementById("shows-view").style.display = "block";
  document.getElementById("episodes-view").style.display = "none";

  // Hide episode specific controls
  document.getElementById("episode-select").style.display = "none";
  document.getElementById("search-input").style.display = "none";
  document.getElementById("episode-count").style.display = "none";
  document.getElementById("episode-select-label").style.display = "none";
}

function setupBackButton() {
  const backButton = document.getElementById("back-to-shows");

  console.log("Back button found:", backButton); // Check if button exists

  backButton.addEventListener("click", function () {
    console.log("Back button clicked!"); // Check if click is detected
    document.getElementById("show-select").value = ""; // resets the show list

    showShowsView();
  });
}

function showEpisodesView() {
  document.getElementById("shows-view").style.display = "none";
  document.getElementById("episodes-view").style.display = "block";

  // Hide episode specific controls
  document.getElementById("episode-select").style.display = "block";
  document.getElementById("search-input").style.display = "block";
  document.getElementById("episode-count").style.display = "block";
  document.getElementById("episode-select-label").style.display = "block";
}

window.onload = function () {
  // Moved it up
  const rootElem = document.getElementById("shows-root");
  rootElem.textContent = "Loading shows...";

  fetch(SHOWS_API_URL)
    .then((response) => response.json())
    .then((data) => {
      allShows = data;
      populateShowSelector(allShows);
      makePageForShows(allShows);
      showShowsView();
      onShowSelect();
      setupBackButton();
    })
    .catch((error) => {
      rootElem.textContent = "Error loading shows";
      console.error(error);
    });
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

    if (!showId) {
      showShowsView();
      return;
    }
    // If episodes already fetched, reuse
    if (episodesCache[showId]) {
      loadEpisodes(episodesCache[showId]);
      return;
    }
    // otherwise fetch episodes
    const episodesURL = `https://api.tvmaze.com/shows/${showId}/episodes`;

    fetch(episodesURL)
      .then((response) => response.json())
      .then((episodes) => {
        episodesCache[showId] = episodes; // cache result
        loadEpisodes(episodes);
      })
      .catch((error) => {
        document.getElementById("root").textContent = "Error loading episodes";
        console.error(error);
      });
  });
}

function loadEpisodes(episodes) {
  allEpisodes = episodes;
  filteredEpisodes = episodes;

  showEpisodesView();
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
    episodeImage.setAttribute("height", "300");

    const episodeDescription = document.createElement("p"); // Description of the episode
    episodeDescription.innerHTML = episode.summary; // Displays the summary of the episode without the <p><\p> characters showing
    episodeDescription.className = "episode-summary";

    episodeCard.appendChild(episodeCode); // Appended the title,
    episodeCard.appendChild(episodeImage); // image and
    episodeCard.appendChild(episodeDescription); // summary to the episode card

    rootElem.appendChild(episodeCard); // Appended episode card to root element
  }
}

//function to display all shows when the page loads, before a show gets selected
function makePageForShows(showList) {
  const rootElem = document.getElementById("shows-root");
  rootElem.textContent = "";

  for (let i = 0; i < showList.length; i++) {
    const show = showList[i];

    const showCard = document.createElement("div");
    showCard.className = "show-card";

    const showImage = document.createElement("img");
    showImage.className = "show-img";
    showImage.src = show.image
      ? show.image.medium.replace(/^http:/, "https:")
      : "";
    showImage.alt = show.name;

    const showInfo = document.createElement("div");
    showInfo.className = "show-info";

    const showTitle = document.createElement("h2");
    showTitle.textContent = show.name;

    const showSummary = document.createElement("p");
    showSummary.innerHTML = show.summary || "No description available";

    const showGenres = document.createElement("p");
    showGenres.textContent = `Genres: ${
      show.genres ? show.genres.join(", ") : "N/A"
    }`;

    const showStatus = document.createElement("p");
    showStatus.textContent = `Status: ${show.status || "N/A"}`;

    const showRating = document.createElement("p");
    showRating.textContent = `Rating: ${show.rating?.average || "N/A"}`;

    const showRuntime = document.createElement("p");
    showRuntime.textContent = `Runtime: ${
      show.runtime ? show.runtime + "min" : "N/A"
    }`;

    showInfo.appendChild(showTitle);
    showInfo.appendChild(showSummary);
    showInfo.appendChild(showGenres);
    showInfo.appendChild(showStatus);
    showInfo.appendChild(showRating);
    showInfo.appendChild(showRuntime);

    showCard.appendChild(showImage);
    showCard.appendChild(showInfo);

    showCard.style.cursor = "pointer";
    showCard.addEventListener("click", function () {
      console.log("Card clicked! Show ID:", show.id); // for debugging

      document.getElementById("show-select").value = show.id; // Update dropdown to match the selected episode
      document.getElementById("episode-select").innerHTML =
        '<option value="">All episodes</option>'; // Reset episode selector
      document.getElementById("search-input").value = ""; // Reset search box

      if (episodesCache[show.id]) {
        loadEpisodes(episodesCache[show.id]);
        return;
      }
      //Otherwise fetch episodes
      const episodesURL = `https://api.tvmaze.com/shows/${show.id}/episodes`;

      fetch(episodesURL)
        .then((response) => response.json())
        .then((episodes) => {
          episodesCache[show.id] = episodes;
          loadEpisodes(episodes);
        })
        .catch((error) => {
          document.getElementById("root").textContent =
            "Error loading episodes";
          console.error(error);
        });
    });
    rootElem.appendChild(showCard);
  }
  const count = document.getElementById("episode-count");
  count.textContent = `Showing ${showList.length} shows`;
}

// dropdown function - fills the menu with all episodes information
function populateEpisodeSelector(episodes) {
  const select = document.getElementById("episode-select");

  select.innerHTML = '<option value="">All episodes</option>';

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
