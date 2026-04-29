console.log("hi");

let songIndex = 0;
let audioElement = new Audio('songs/how deep is your love.webm');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');

let songs = [
    {songName: "how deep is your love", filePath: "songs/how deep is your love.webm", coverPath: "covers/how deep is your love.png" },
    {songName: "shadows in the moonlight", filePath: "songs/shadows in the moonlight.mp4", coverPath: "covers/shadows in the moonlight.jpg" },
    {songName: "yesterday once more", filePath: "songs/yesterday once more.webm", coverPath: "covers/yesterday once more.jpg" },

]

masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause')
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play')
    }

})

audioElement.addEventListener('timeupdate', ()=>{
    progess = parseInt((audioElement.currentTime/audioElement.duration)*100);
    myProgressBar.value = progess;
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
})

let next = document.getElementById("next");
let previous = document.getElementById("previous");

function playSong(index){
    songIndex = index;

    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;

    audioElement.play().then(()=>{
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
    });

    updateActiveSong();
}

next.addEventListener("click", ()=>{
    songIndex = (songIndex + 1) % songs.length;
    playSong(songIndex);
});

previous.addEventListener("click", ()=>{
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playSong(songIndex);
});

let songItemPlays = document.getElementsByClassName("songItemPlay");

Array.from(songItemPlays).forEach((element)=>{
    element.addEventListener("click", (e)=>{
        let index = parseInt(e.target.getAttribute("data-index"));

        // stop current song properly
        audioElement.pause();
        audioElement.currentTime = 0;

        playSong(index);
    });
});

function updateActiveSong(){
    let songItems = document.getElementsByClassName("songItem");

    Array.from(songItems).forEach(item => {
        item.classList.remove("activeSong");
    });

    songItems[songIndex].classList.add("activeSong");
}

let songDurations = document.getElementsByClassName("songDuration");

songs.forEach((song, index)=>{
    let tempAudio = new Audio(song.filePath);

    tempAudio.addEventListener("loadedmetadata", ()=>{
        let duration = tempAudio.duration;

        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60);

        if(seconds < 10) seconds = "0" + seconds;

        songDurations[index].innerText = `${minutes}:${seconds}`;
    });
});

audioElement.addEventListener("ended", ()=>{
    songIndex = (songIndex + 1) % songs.length;
    playSong(songIndex);
});

let songItems = document.getElementsByClassName("songItem");

Array.from(songItems).forEach((element)=>{
    element.addEventListener("click", (e)=>{
        let index = parseInt(element.getAttribute("data-index"));

        // if same song clicked → toggle play/pause
        if(songIndex === index && !audioElement.paused){
            audioElement.pause();
            masterPlay.classList.remove('fa-circle-pause');
            masterPlay.classList.add('fa-circle-play');
        } else {
            playSong(index);
        }
    });
});