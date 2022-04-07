const searchbtn = document.querySelector(".searchbtn");
const search = document.querySelector(".search");
const form = document.querySelector(".form");
const result = document.querySelector(".container");
const pagination = document.querySelector(".pagination");
const URL = "https://api.lyrics.ovh";

// function searchSong(term) {
//   fetch(`${URL}/suggest/${term}`)
//     .then(response => response.json())
//     .then(data => console.log(data));
// }
async function searchSong(term) {
  const res = await fetch(`${URL}/suggest/${term}`);
  const data = await res.json();
  showData(data);
}

function showData(data) {
  // let output = "";
  // data.data.forEach(song => {
  //     output =
  //       output +
  //       `<li><span><strong>${song.artist.name}</strong> - ${song.title}</span>
  //        <button class ='btn' data-artist='${song.artist.name}' data-songtitle ='${song.title}'>Get Lyrics</button> </li>`;
  //   });
  //   result.innerHTML = `<ul class='songs'>${output}</ul>`;

  result.innerHTML = `
  <ul class ='songs'>
  ${data.data
    .map(
      song => `<li><span><strong>${song.artist.name}</strong> - ${song.title}</span>
  <button class ='btn' data-artist='${song.artist.name}' data-songtitle ='${song.title}'>Get Lyrics</button> </li>`
    )
    .join("")}</ul>`;

  if (data.prev || data.next) {
    pagination.innerHTML = `${
      data.prev
        ? `<button class='btn' onclick="getMoreSongs('${data.prev}')">previous</button>`
        : ""
    } ${
      data.next
        ? `<button class='btn' onclick="getMoreSongs('${data.next}')">next</button>`
        : ""
    } `;
  } else {
    pagination.innerHTML = "";
  }
}

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  //console.log(data);
  showData(data);
}

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${URL}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>`;
  pagination.innerHTML = "";
}
form.addEventListener("submit", e => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!searchTerm) {
    alert("you need to enter artist or lyrics");
  } else {
    searchSong(searchTerm);
  }
});

result.addEventListener("click", e => {
  const clickedEl = e.target;
  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-songtitle");
    getLyrics(artist, songTitle);
  }
});
// searchbtn.addEventListener("mousedown", function () {
//   search.classList.toggle("scaledown");
//   searchbtn.classList.toggle("scaledown");
// });
