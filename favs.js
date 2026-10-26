
/* =========================================
   FAV MUSIC — INTERACTIONS
   Independent JavaScript
========================================= */

"use strict";



const musicCollection = [
    {
        title: "8 Letters",
        artist: "Why Don't We",
        cover: "cover/newcover.jpeg",
        audio: "music/8 Letters - Why Don't We [Official Music Video].mp3"
    },
    {
        title: "Stuck on You",
        artist: "Alex Crichton",
        cover: "cover/newcover.jpeg",
        audio: "music/Alex Crichton - Stuck On You.mp3"
    },
    {
        title: "What If I Call",
        artist: "Alex Crichton",
        cover: "cover/newcover.jpeg",
        audio: "music/Alex Crichton - What If I Call.mp3"
    },
    {
        title: "Bye",
        artist: "Ariana Grande",
        cover: "cover/newcover.jpeg",
        audio: "music/Ariana Grande - bye [Altare Remix] Extended Remix.mp3"
    },
    {
        title: "Isimo",
        artist: "Bleachers",
        cover: "cover/newcover.jpeg",
        audio: "music/Bleachers - Isimo.mp3"
    },
    {
        title: "Merry Christmas, Please Don't Call",
        artist: "Bleachers",
        cover: "cover/newcover.jpeg",
        audio: "music/Bleachers - Merry Christmas, Please Don't Call (Official Music Video).mp3"
    },
    {
        title: "Without You",
        artist: "Braaten & Aili",
        cover: "cover/newcover.jpeg",
        audio: "music/Braaten & Aili - Without You (Lyric Video) [Avicii Tribute].mp3"
    },
    {
        title: "Constellations",
        artist: "Jade LeMac",
        cover: "cover/newcover.jpeg",
        audio: "music/Jade LeMac - Constellations (Lyrics).mp3"
    },
    {
        title: "Merra",
        artist: "Colorcode",
        cover: "cover/newcover.jpeg",
        audio: "music/Merra.mp3"
    },
    {
        title: "to the bone",
        artist: "pamungkas",
        cover: "cover/newcover.jpeg",
        audio: "music/Pamungkas - To The Bone (Official Music Video).mp3"
    },
    {
        title: "Sway",
        artist: "Colorcode",
        cover: "cover/newcover.jpeg",
        audio: "music/Sway.mp3"
    },
    {
        title: "Blank Space",
        artist: "Taylor Swift",
        cover: "cover/newcover.jpeg",
        audio: "music/Taylor Swift – Blank Space (Lyrics).mp3"
    },
    {
        title: "Favorite Lesson",
        artist: "yaeow & Keenan Te",
        cover: "cover/newcover.jpeg",
        audio: "music/yaeow - favorite lesson (Official Lyric Video).mp3"
    }
];


/* ELEMENTS */

const stage = document.getElementById("carousel-stage");
const carousel = document.getElementById("music-carousel");
const playlist = document.getElementById("playlist-list");

const previousTrackButton =
    document.getElementById("previous-track");

const nextTrackButton =
    document.getElementById("next-track");

const playerPrevious =
    document.getElementById("player-previous");

const playerNext =
    document.getElementById("player-next");

const playButton =
    document.getElementById("play-button");

const playIcon =
    document.getElementById("play-icon");

const audio = document.getElementById("audio-player");

const playerTitle =
    document.getElementById("player-title");

const playerArtist =
    document.getElementById("player-artist");

const playerArt =
    document.getElementById("player-art");

const seekBar =
    document.getElementById("seek-bar");

const elapsedTime =
    document.getElementById("elapsed-time");

const durationTime =
    document.getElementById("duration-time");

const volumeBar =
    document.getElementById("volume-bar");

const playerStatus =
    document.getElementById("player-status");

const equalizer =
    document.getElementById("equalizer");

const likeButton =
    document.getElementById("like-button");

const shuffleButton =
    document.getElementById("shuffle-button");

const repeatButton =
    document.getElementById("repeat-button");

const currentNumber =
    document.getElementById("current-number");

const paginationFill =
    document.getElementById("pagination-fill");

/* STATE */

let currentIndex = 0;
let isPlaying = false;
let isSeeking = false;
let isShuffle = false;
let isRepeat = false;
let likedTracks = new Set();

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;

/* HELPERS */

function getTrack(index) {
    return musicCollection[
        (index + musicCollection.length) %
        musicCollection.length
    ];
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function safeText(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function coverMarkup(track, className = "") {
    if (track.cover) {
        return `
            <img
                class="${className}"
                src="${safeText(track.cover)}"
                alt="Cover ${safeText(track.title)}"
                loading="lazy"
                draggable="false"
            >
        `;
    }

    return `
        <div class="art-fallback ${className}">
            <span>♪</span>
        </div>
    `;
}

/* CAROUSEL */

function renderCarousel() {
    stage.innerHTML = "";

    musicCollection.forEach((track, index) => {
        const card = document.createElement("article");

        card.className = "track-card";
        card.dataset.index = index;
        card.setAttribute(
            "aria-label",
            `${track.title} — ${track.artist}`
        );

        card.innerHTML = `
            <div class="track-art">
                ${coverMarkup(track)}
            </div>

            <div class="track-card-info">
                <span class="track-card-index">
                    TRACK ${String(index + 1).padStart(2, "0")}
                </span>

                <h3 class="track-card-title">
                    ${safeText(track.title)}
                </h3>

                <p class="track-card-artist">
                    ${safeText(track.artist)}
                </p>

                <span class="track-card-play">
                    <span>▶</span>
                    SELECT TRACK
                </span>
            </div>
        `;

        card.addEventListener("click", () => {
            if (index === currentIndex) {
                togglePlayback();
            } else {
                selectTrack(index, true);
            }
        });

        stage.appendChild(card);
    });

    updateCarousel();
}

function updateCarousel() {
    const cards = stage.querySelectorAll(".track-card");
    const total = musicCollection.length;

    cards.forEach((card, index) => {
        let difference = index - currentIndex;

        // Pilih jalur terpendek untuk carousel melingkar.
        if (difference > total / 2) {
            difference -= total;
        }

        if (difference < -total / 2) {
            difference += total;
        }

        const absoluteDifference = Math.abs(difference);
        const isActive = difference === 0;

        // Batasi jumlah kartu yang ditampilkan.
        const visible = absoluteDifference <= 2;

        const x = difference * 215;
        const rotate = difference * -9;
        const scale = isActive
            ? 1
            : Math.max(0.65, 0.86 - absoluteDifference * 0.09);

        const opacity = visible
            ? (isActive ? 1 : 0.72 - absoluteDifference * 0.18)
            : 0;

        const y = absoluteDifference === 0 ? 0 : 9;

        card.style.setProperty("--card-x", `${x}px`);
        card.style.setProperty("--card-y", `${y}px`);
        card.style.setProperty("--card-scale", scale);
        card.style.setProperty("--card-rotate", `${rotate}deg`);
        card.style.setProperty("--card-opacity", opacity);

        card.style.zIndex = String(20 - absoluteDifference);

        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-current", isActive ? "true" : "false");

        card.style.pointerEvents = visible ? "auto" : "none";
    });

    currentNumber.textContent =
        String(currentIndex + 1).padStart(2, "0");

    paginationFill.style.width =
        `${((currentIndex + 1) / total) * 100}%`;
}

/* PLAYLIST */

function renderPlaylist() {
    playlist.innerHTML = "";

    musicCollection.forEach((track, index) => {
        const row = document.createElement("button");

        row.type = "button";
        row.className = "playlist-row";
        row.dataset.index = index;

        row.innerHTML = `
            <span class="playlist-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <span class="playlist-thumb">
                ${coverMarkup(track)}
            </span>

            <span class="playlist-info">
                <h3>${safeText(track.title)}</h3>
                <p>${safeText(track.artist)}</p>
            </span>

            <span class="playlist-action" aria-hidden="true">
                ${index === currentIndex ? "♫" : "▶"}
            </span>
        `;

        row.addEventListener("click", () => {
            selectTrack(index, true);
        });

        playlist.appendChild(row);
    });

    updatePlaylist();
}

function updatePlaylist() {
    const rows = playlist.querySelectorAll(".playlist-row");

    rows.forEach((row, index) => {
        const active = index === currentIndex;

        row.classList.toggle("is-current", active);
        row.setAttribute("aria-current", active ? "true" : "false");

        const action = row.querySelector(".playlist-action");
        action.textContent = active && isPlaying ? "♫" : "▶";
    });
}

/* PLAYER DISPLAY */

function updatePlayerInfo() {
    const track = getTrack(currentIndex);

    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;

    playerArt.innerHTML = coverMarkup(track);

    likeButton.classList.toggle(
        "is-liked",
        likedTracks.has(currentIndex)
    );

    likeButton.textContent =
        likedTracks.has(currentIndex) ? "♥" : "♡";

    likeButton.setAttribute(
        "aria-pressed",
        String(likedTracks.has(currentIndex))
    );

    updatePlaylist();
}

function setPlaybackState(playing) {
    isPlaying = playing;

    playIcon.textContent = playing ? "Ⅱ" : "▶";

    playButton.setAttribute(
        "aria-label",
        playing ? "Jeda musik" : "Putar musik"
    );

    equalizer.classList.toggle("is-playing", playing);

    playerStatus.textContent = playing
        ? "NOW PLAYING"
        : "READY TO PLAY";

    updatePlaylist();
}

function selectTrack(index, autoplay = false) {
    currentIndex =
        (index + musicCollection.length) %
        musicCollection.length;

    const track = getTrack(currentIndex);

    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    setPlaybackState(false);
    updateCarousel();
    updatePlayerInfo();

    seekBar.value = 0;
    elapsedTime.textContent = "0:00";
    durationTime.textContent = "0:00";

    if (track.audio.trim()) {
        audio.src = track.audio;
        audio.load();

        if (autoplay) {
            playAudio();
        }
    } else {
        playerStatus.textContent = "AUDIO SOURCE NEEDED";
    }
}

/* AUDIO */

async function playAudio() {
    const track = getTrack(currentIndex);

    if (!track.audio.trim()) {
        setPlaybackState(false);
        playerStatus.textContent = "ADD AUDIO URL IN favs.js";
        return;
    }

    if (!audio.src || audio.src !== new URL(
        track.audio,
        document.baseURI
    ).href) {
        audio.src = track.audio;
        audio.load();
    }

    try {
        await audio.play();
        setPlaybackState(true);
    } catch (error) {
        setPlaybackState(false);
        playerStatus.textContent = "PLAYBACK UNAVAILABLE";
        console.warn("Audio tidak dapat diputar:", error);
    }
}

function togglePlayback() {
    if (isPlaying) {
        audio.pause();
        setPlaybackState(false);
    } else {
        playAudio();
    }
}

function nextTrack() {
    if (isShuffle && musicCollection.length > 1) {
        let randomIndex = currentIndex;

        while (randomIndex === currentIndex) {
            randomIndex = Math.floor(
                Math.random() * musicCollection.length
            );
        }

        selectTrack(randomIndex, true);
        return;
    }

    selectTrack(currentIndex + 1, true);
}

function previousTrack() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    selectTrack(currentIndex - 1, true);
}

/* BUTTON EVENTS */

previousTrackButton.addEventListener("click", previousTrack);
playerPrevious.addEventListener("click", previousTrack);

nextTrackButton.addEventListener("click", nextTrack);
playerNext.addEventListener("click", nextTrack);

playButton.addEventListener("click", togglePlayback);

likeButton.addEventListener("click", () => {
    if (likedTracks.has(currentIndex)) {
        likedTracks.delete(currentIndex);
    } else {
        likedTracks.add(currentIndex);
    }

    updatePlayerInfo();
});

shuffleButton.addEventListener("click", () => {
    isShuffle = !isShuffle;

    shuffleButton.setAttribute(
        "aria-pressed",
        String(isShuffle)
    );

    playerStatus.textContent = isShuffle
        ? "SHUFFLE ENABLED"
        : (isPlaying ? "NOW PLAYING" : "READY TO PLAY");
});

repeatButton.addEventListener("click", () => {
    isRepeat = !isRepeat;

    repeatButton.setAttribute(
        "aria-pressed",
        String(isRepeat)
    );

    audio.loop = isRepeat;

    playerStatus.textContent = isRepeat
        ? "REPEAT ENABLED"
        : (isPlaying ? "NOW PLAYING" : "READY TO PLAY");
});

/* SEEK & VOLUME */

seekBar.addEventListener("input", () => {
    isSeeking = true;

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        const targetTime =
            (Number(seekBar.value) / 100) * audio.duration;

        elapsedTime.textContent = formatTime(targetTime);
    }
});

seekBar.addEventListener("change", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number(seekBar.value) / 100) * audio.duration;
    }

    isSeeking = false;
});

volumeBar.addEventListener("input", () => {
    audio.volume = Number(volumeBar.value);
});

audio.volume = Number(volumeBar.value);

audio.addEventListener("loadedmetadata", () => {
    durationTime.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    if (!isSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
    }

    elapsedTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("play", () => {
    setPlaybackState(true);
});

audio.addEventListener("pause", () => {
    setPlaybackState(false);
});

audio.addEventListener("ended", () => {
    if (!isRepeat) {
        nextTrack();
    }
});

audio.addEventListener("error", () => {
    if (getTrack(currentIndex).audio.trim()) {
        setPlaybackState(false);
        playerStatus.textContent = "AUDIO COULD NOT LOAD";
    }
});

/* SWIPE SUPPORT */

stage.addEventListener("touchstart", event => {
    const touch = event.changedTouches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchEndX = touch.clientX;
}, { passive: true });

stage.addEventListener("touchmove", event => {
    const touch = event.changedTouches[0];
    touchEndX = touch.clientX;
}, { passive: true });

stage.addEventListener("touchend", event => {
    const touch = event.changedTouches[0];

    touchEndX = touch.clientX;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (
        Math.abs(deltaX) > 45 &&
        Math.abs(deltaX) > Math.abs(deltaY)
    ) {
        if (deltaX < 0) {
            nextTrack();
        } else {
            previousTrack();
        }
    }
}, { passive: true });

/* KEYBOARD NAVIGATION */

document.addEventListener("keydown", event => {
    const target = event.target;

    if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
    ) {
        return;
    }

    if (event.key === "ArrowRight") {
        nextTrack();
    }

    if (event.key === "ArrowLeft") {
        previousTrack();
    }

    if (event.code === "Space") {
        event.preventDefault();
        togglePlayback();
    }
});

/* FOOTER */

document.getElementById("footer-year").textContent =
    new Date().getFullYear();

/* INITIALIZE */

renderCarousel();
renderPlaylist();
updatePlayerInfo();
selectTrack(0, false);
