const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

let index;

let loop = true;

// array of song objects
const songList = [
  {
    name: "Gelo Ew Ki Bu",
    link: "assets/gelo-ew-ki-bu.mp3",
    artist: "Aram Tigran",
    image: "assets/aram-tigran.jpeg",
  },
  {
    name: "Gitme Kal",
    link: "assets/yara-bere-icindeyim.mp3",
    artist: "Hira-i Zerdust",
    image: "assets/hirai.jpeg",
  },
  {
    name: "Aramam",
    link: "assets/aramam.mp3",
    artist: "Ibrahim Tatlises",
    image: "assets/ibrahim-tatlises.jpeg",
  },
  {
    name: "Ax Eman",
    link: "assets/ax-eman.mp3",
    artist: "Rewsan Celiker",
    image: "assets/rewsan-celiker.jpeg",
  },
  {
    name: "Dinle",
    link: "assets/dinle.mp3",
    artist: "Mahsun Kirmizigul",
    image: "assets/mahsun.jpeg",
  },
];

// set the currently playing song
const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
    currentProgress.style.width =
      ((audio.currentTime / audio.duration) * 100).toFixed(2) + "%";
  };

  playListContainer.classList.add("hide");

  playAudio();
};

// play the currently selected song
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

// pause the currently selected song
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// play the next song in the playlist
const nextSong = () => {
  if (loop) {
    if (index == songList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }

    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songList.length);
    setSong(randIndex);
  }

  playAudio();
};

// play the previous song in the playlist
const prevSong = () => {
  if (index > 0) {
    index -= 1;
  } else {
    index = songList.length - 1;
  }
  setSong(index);
  playAudio();
};

// format time in minutes and seconds
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// toggle repeat button
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

// toggle shuffle button
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
  } else {
    shuffleButton.classList.add("active");
    loop = false;
  }
});

// update the current time every second
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    ((audio.currentTime / audio.duration) * 100).toFixed(2) + "%";
}, 1000);

// show the playlist
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

// hide the playlist
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

// initialize the playlist
const initializePlaylist = () => {
  for (let i in songList) {
    playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songList[i].name}
            </span>
            <span id="playlist-song-artist-album">
                ${songList[i].artist}
            </span>
        </div>
        </li>`;
  }
};

// update the progress bar when the user clicks on it
progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;

  let coordEnd = event.clientX;

  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progress * 100 + "%";

  audio.currentTime = progress * audio.duration;

  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// update the current time when the audio time changes
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

// play the next song when the audio ends
audio.onended = () => {
  nextSong();
};

// add event listeners to the next and previous buttons
nextButton.addEventListener("click", nextSong);

prevButton.addEventListener("click", prevSong);

pauseButton.addEventListener("click", pauseAudio);

playButton.addEventListener("click", playAudio);

// initialize the player
window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlaylist();
};
