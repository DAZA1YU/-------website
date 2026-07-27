// 将来のオーディオプレイヤー

let currentAudio = null;
let currentButton = null;


function toggleTrack(button, audioId){

    const audio = document.getElementById(audioId);

    const player = button.closest(".track").nextElementSibling;
    const progressFill = player.querySelector(".progress-fill");
    const progressHead = player.querySelector(".progress-head");
    const time = player.querySelector(".time");

    // 音源がまだ無い場合
    if(audio.networkState === 3){
        alert("coming soon.");
        return;
    }

    // 同じ曲なら停止
    if(currentAudio === audio){

        audio.pause();

        button.textContent = "[ Play ]";

        currentAudio = null;
        currentButton = null;

        return;
    }

    // 他の曲が流れていたら止める
    if(currentAudio){

        currentAudio.pause();
        currentAudio.currentTime = 0;

        currentButton.textContent = "[ Play ]";

        const oldPlayer =
            currentButton.closest(".track").nextElementSibling;

        oldPlayer.style.display = "none";
        oldPlayer.querySelector(".progress-fill").style.width = "0%";
        oldPlayer.querySelector(".time").textContent = "0:00 / 0:00";

    }

    // 再生
    audio.play();

    button.textContent = "[ Pause ]";

    player.style.display = "block";

    currentAudio = audio;
    currentButton = button;

    // 再生中の更新
    audio.ontimeupdate = function(){

        if(audio.duration){

            const percent =
                (audio.currentTime / audio.duration) * 100;

            progressFill.style.width = percent + "%";
            const currentMinutes =
                Math.floor(audio.currentTime / 60);

            const currentSeconds =
                Math.floor(audio.currentTime % 60);

            const totalMinutes =
                Math.floor(audio.duration / 60);

            const totalSeconds =
                Math.floor(audio.duration % 60);

            time.textContent =
                `${currentMinutes}:${String(currentSeconds).padStart(2,"0")} / ${totalMinutes}:${String(totalSeconds).padStart(2,"0")}`;

        }

    };

    // シークバーをクリック
player.querySelector(".progress").onclick = function(e){

    if(!audio.duration) return;

    const rect = this.getBoundingClientRect();

    const percent = (e.clientX - rect.left) / rect.width;

    audio.currentTime = percent * audio.duration;

};


let dragging = false;

const progress = player.querySelector(".progress");

progress.addEventListener("mousedown", function(){

    dragging = true;

});

progress.addEventListener("touchstart", function(){

    dragging = true;

});

document.addEventListener("mouseup", function(){

    dragging = false;

});

document.addEventListener("touchend", function(){

    dragging = false;

});

document.addEventListener("mousemove", function(e){

    if(!dragging) return;

    if(!audio.duration) return;

    const rect = progress.getBoundingClientRect();

    let percent = (e.clientX - rect.left) / rect.width;

    percent = Math.max(0, Math.min(1, percent));

    audio.currentTime = percent * audio.duration;

});

    // 曲が終わったら
    audio.onended = function(){

        button.textContent = "[ Play ]";

        player.style.display = "none";

        progressFill.style.width = "0%";
        time.textContent = "0:00 / 0:00";

        currentAudio = null;
        currentButton = null;

    };

}