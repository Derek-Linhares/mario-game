// Function Loading Game Assets

document.addEventListener("DOMContentLoaded", function () {
  showLoadingScreen();

  const resourcesToPreload = [
    "./assets/040e0b2cc40d677fe5af0a805cbedbd7.png",
    "./assets/1671511.jpg",
    "./assets/bg-mountains (1).png",
    "./assets/clouds.png",
    "./assets/coin.gif",
    "./assets/coinSound.mp3",
    "./assets/its-me.mp3",
    "./assets/yoshi-voice.mp3",
    "./assets/toad-voice.mp3",
    "./assets/confetti.gif",
    "./assets/congrats.png",
    "./assets/defeated.png",
    "./assets/FinalSound.mp3",
    "./assets/Fsound.mp3",
    "./assets/fundo 222.jpg",
    "./assets/fundoFinal.jpg",
    "./assets/Game-Over-27-07-2023.png",
    "./assets/game-over.png",
    "/assets/iniciar-28-07-2023.png",
    "./assets/letsGo.mp3",
    "./assets/mario.gif",
    "./assets/mario2.gif",
    "./assets/PIPES-27-07-2023 (2).png",
    "./assets/plant.gif",
    "./assets/pulo.mp3",
    "./assets/Score-27-07-2023.png",
    "./assets/Super Mario World Music - Athletic (320 kbps).mp3",
    "./assets/Super Mario World Music - Game Over (320 kbps).mp3",
    "./assets/tela-Inicial-28-07-2023.png",
    "./assets/titulo.png",
    "./assets/toad.gif",
    "./assets/you.png",
    "./assets/fundo mario.png",
  ];

  let loadedResources = 0;
  const totalResources = resourcesToPreload.length;

  function preloadResources() {
    resourcesToPreload.forEach((resource) => {
      if (resource.endsWith(".mp3")) {
        const audio = new Audio();
        audio.src = resource;
        audio.oncanplaythrough = resourceLoaded;
        audio.onerror = () => {
          console.error(`Erro ao carregar áudio: ${resource}`);
          resourceLoaded();
        };
      } else {
        const img = new Image();
        img.src = resource;
        img.onload = resourceLoaded;
        img.onerror = () => {
          console.error(`Erro ao carregar imagem: ${resource}`);
          resourceLoaded();
        };
      }
    });
  }

  function resourceLoaded() {
    loadedResources++;
    const progress = (loadedResources / totalResources) * 100;
    updateLoadingBar(progress);

    if (loadedResources === totalResources) {
      hideLoadingScreen();
    }
  }

  function updateLoadingBar(progress) {
    const loadingBar = document.getElementById("loadingBar");
    loadingBar.value = progress;
  }

  function showLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.visibility = "visible";
  }

  function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.visibility = "hidden";
  }

  preloadResources();
});

// Function to show the loading screen
function showLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  loadingScreen.style.visibility = "visible";
}

// Function to hide the loading screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  loadingScreen.style.visibility = "hidden";
}

// Selection of on-screen elements and game state variables
const theme = document.getElementById("theme");
const plant = document.querySelector(".plant");
const background = document.querySelector(".background");
const clouds = document.querySelector(".clouds");
const final = document.querySelector(".final");
const black = document.querySelector(".black");
const jumping = document.getElementById("jumping");
const yoshiVoice = document.getElementById("yoshi-voice");
const marioVoice = document.getElementById("mario-voice");
const toadVoice = document.getElementById("toad-voice");
const scene = document.querySelector("scene");
const scoreElement = document.querySelector(".score");
const gameoverscreen = document.querySelector(".gameoverscreen");
const over = document.getElementById("over");
let gameLoop;
let score = 0;
let hasScored = false;
let isGameOver = false;
let isJumping = false;
let canTouch = false;
let canClick = false;

// Additional elements
let end = document.querySelector(".end");

let coin = document.getElementById("coin");

let party = document.getElementById("party");
let coinSound = document.getElementById("coinSound");
let lets = document.getElementById("lets");

// Function to play sound
const playSound = (audio) => {
  audio.currentTime = 0;
  audio.play();
  audio.volume = 0.9;
};

// Function to stop sound
const stopSound = (audio) => {
  audio.currentTime = 0;
  audio.pause();
};

// Pause screen animations
const pauseAnimations = () => {
  end.style.animationPlayState = "paused";
  [plant, background, clouds, coin].forEach((element) => {
    element.style.animationPlayState = "paused";
  });
};

// Continue screen animations
const resumeAnimations = () => {
  [plant, background, clouds, coin].forEach((element) => {
    element.style.animationPlayState = "running";
  });
};

// Hides all screens (home, game over, etc.)
const hideScreens = () => {
  const screens = document.getElementsByClassName("screen", "gameoverscreen");
  for (const screen of screens) {
    screen.style.display = "none";
  }
};

// Function to perform the character's jump
const jump = () => {
  if (isGameOver) return;
  playSound(jumping);
  const mario = document.querySelector(".mario");
  mario.classList.add("jump");
  setTimeout(() => {
    mario.classList.remove("jump");
    isJumping = false;
  }, 900);
};
pauseAnimations();

// Starts the main game loop
const startGameLoop = () => {
  const mario = document.querySelector(".mario");
  let isFirstJump = true;
  gameLoop = setInterval(() => {
    const plantPosition = plant.offsetLeft;
    const coinPosition = coin.offsetLeft;
    const marioPosition = +window
      .getComputedStyle(mario)
      .bottom.replace("px", "");

    if (
      coinPosition <= 40 &&
      coinPosition >= 20 &&
      !hasScored &&
      marioPosition > 180
    ) {
      coin.style.visibility = "hidden";
      score += 1;
      hasScored = true;
      scoreElement.innerText = score;

      playSound(coinSound);

      if (score === 5) {
        pauseAnimations();
        isGameOver = true;
        stopSound(theme);
        stopSound(jumping);
        stopSound(coinSound);
        playSound(lets);
        hideScreens();

        black.style.visibility = "visible";
        final.classList.add("show");

        setTimeout(() => {
          playSound(party);
        }, 1200);
      }
    }
    if (hasScored == true && coinPosition > 300) {
      coin.style.visibility = "visible";
      hasScored = false;
    }
    // Check if there was a collision with the pipe
    if (plantPosition <= 108 && plantPosition > 0 && marioPosition < 260) {
      isGameOver = true;
      pauseAnimations();
      plant.style.left = `${plantPosition}px`;

      mario.classList.add("morreu");
      document.documentElement.style.setProperty(
        "--mario-position",
        `${marioPosition}px`
      );

      setTimeout(() => {
        mario.style.animationPlayState = "paused";
      }, 9000);

      mario.style.bottom = "-800px";
      mario.src = "./assets/game-over.png";
      mario.style.width = "60px";
      mario.style.marginLeft = "60px";

      [theme, jumping, coinSound].forEach(stopSound);
      const gameover = document.getElementById("gameover");

      playSound(gameover);
      setTimeout(() => {
        stopSound(gameover);
      }, 500000);

      gameOver(score);
    }

    // Reset the hasScored variable when the pipe passes the character
  }, 10);

  let canJump = true;

  document.addEventListener("keydown", (event) => {
    if (
      (event.code === "Space" ||
        event.code === "KeyW" ||
        event.code === "ArrowUp") &&
      !isJumping &&
      canJump
    ) {
      jump();
      isJumping = true;
      canJump = false;

      if (isFirstJump) {
        isFirstJump = false;
        hasScored = false;
      }

      setTimeout(() => {
        isJumping = false;
        canJump = true;
      }, 900);
    }
  });

  playSound(theme);
};

document.addEventListener("touchstart", () => {
  if (!isJumping && canTouch) {
    jump();
    isJumping = true;
    setTimeout(() => {
      isJumping = false;
    }, 900);
  }
});

document.addEventListener("mousedown", () => {
  if (!isJumping && canClick) {
    jump();
    isJumping = true;
    setTimeout(() => {
      isJumping = false;
    }, 900);
  }
});

// Function to display the game over screen
const gameOver = (finalScore) => {
  isGameOver = true;
  clearInterval(gameLoop);
  setTimeout(() => {
    const gameoverscreen = document.getElementsByClassName("gameoverscreen");
    for (const screen of gameoverscreen) {
      screen.style.visibility = "visible";
    }
    const finalScoreElement = document.getElementById("finalScore");

    finalScoreElement.innerText = finalScore;
    playSound(over);
    setTimeout(() => {
      end.style.visibility = "visible";
    }, 5000);

    end.style.animationPlayState = "running";
  }, 4000);
};

// Function to start the game
const gameStart = () => {
  end.classList.remove("animate");
  end.style.visibility = "hidden";
  hideScreens();
  resumeAnimations();
  startGameLoop();
  canTouch = true;
  setTimeout(() => {
    canClick = true;
  }, 100);
};
