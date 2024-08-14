let currentSong = new Audio();
let songs;
let currFolder;
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";  // clear the list first
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>  <img class="invert" src="svg/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Artist</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="svg/play.svg" alt="">
        </div></li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    });
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play();
        play.src = "svg/pause.svg";
    }
    currentSong.play();
    play.src = "svg/pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
// async function displayAlbums() {
//     let a = await fetch(`/songs/`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardcontainer = document.querySelector(".cardcontainer")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];
//         if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
//             let folder = e.href.split("/").slice(-2)[0]
//             // Get the metadata of the folder
//             let a = await fetch(`/songs/${folder}/info.json`)
//             let response = await a.json();
//             cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card">
//                         <div  class="play">
//                             <button>
//                                 <svg xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img"
//                                     aria-hidden="true" viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE">
//                                     <path
//                                         d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
//                                     </path>
//                                 </svg>
//                             </button>
//                         </div>
//                         <img src="/songs/${folder}/cover.jpg" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`
//         }
//     }
async function displayAlbums() {
    // Fetch the content of the /songs/ directory
    let response = await fetch(`/songs/`);
    let text = await response.text();
    
    // Create a temporary div to parse the directory structure
    let div = document.createElement("div");
    div.innerHTML = text;
    
    // Get all anchor tags (links) from the parsed content
    let anchors = div.getElementsByTagName("a");
    
    // Select the container where you want to display the albums
    let cardContainer = document.querySelector(".cardcontainer");
    
    // Loop through each anchor tag to find directories (albums)
    for (let i = 0; i < anchors.length; i++) {
        let anchor = anchors[i];
        // Filter out directories (assuming they don't have file extensions)
        if (anchor.href.endsWith('/')) {
            let folderName = anchor.href.split('/').slice(-2)[0];
            
            // Create a card for each album
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="path/to/album/${folderName}.jpg" alt="${folderName}">
                <h2>${folderName}</h2>
                <p>Album</p>
            `;
            card.dataset.folder = folderName;
            
            // Add an event listener to load songs when the album is clicked
            card.addEventListener("click", function() {
                getSongs(folderName);
            });
        }
    }
}

 // Load the playlist whenever card is clicked
 Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
        playMusic(songs[0])

    })
})
   
// }
async function main() {

    //get the list of all the songs 
    await getSongs("songs/ncs");
    playMusic(songs[0], true);
    // display all the album in the page
      displayAlbums()
    const play = document.querySelector("#play");
    play.addEventListener("click", element => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svg/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", element => {
        let duration = currentSong.duration;
        let currentTime = currentSong.currentTime;
        let minutes = Math.floor(currentTime / 60);
        let seconds = Math.floor(currentTime % 60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        document.querySelector(".songtime").innerHTML = `${minutes}:${seconds} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })
      // Add event listener to mute the track
      document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}
main();
