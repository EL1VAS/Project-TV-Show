//You can edit ALL of the code here

function setup() {
  const allEpisodes = getAllEpisodes(); //Get the array
  makePageForEpisodes(allEpisodes); // Pass array to the function
}

function makePageForEpisodes(episodeList) { // Receive it as an episode list
  const rootElem = document.getElementById("root"); // Access the root in html
  rootElem.textContent = ""; // Initially keep context to empty
  fot (let i = 0; i <= episodeList.length; i++) {
    const episode = episodeList[i];
    document.createElement("div");
    document.createElement("h2");
    document.createElement("img");
    document.createElement("article");
  }
}

window.onload = setup;
