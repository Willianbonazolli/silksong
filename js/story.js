document.addEventListener("DOMContentLoaded", function () {
  const bgMusic = document.getElementById("bg-music");
  const audioToggle = document.getElementById("audio-toggle");
  const audioTooltip = document.querySelector(".audio-tooltip");
  const paragraphs = document.querySelectorAll(".story-paragraph");
  const featureCards = document.querySelectorAll(".feature-card");
  const backButton = document.querySelector(".back-button");
  const continueButton = document.querySelector(".continue-button");

  let isMusicPlaying = true;
  let hasInteracted = false;

  function initStoryPage() {
    setupAudio();
    setupAnimations();
    setupNavigation();
    setupKeyboardControls();
    createBackgroundParticles();
  }

  function setupAudio() {
    bgMusic.volume = 0.4;
    bgMusic.loop = true;
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        audioTooltip.textContent = "Clique para ativar áudio";
        isMusicPlaying = false;
        updateAudioButton();
      });
    }

    audioToggle.addEventListener("click", function (e) {
      e.stopPropagation();

      if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        audioTooltip.textContent = "Música: Desativada";
      } else {
        bgMusic
          .play()
          .then(() => {
            isMusicPlaying = true;
            audioTooltip.textContent = "Música: Ativada";
          })
          .catch(() => {
            audioTooltip.textContent = "Clique novamente";
          });
      }

      updateAudioButton();
      hasInteracted = true;
    });
  }

  function updateAudioButton() {
    const icon = audioToggle.querySelector(".audio-icon");
    icon.textContent = isMusicPlaying ? "♪" : "🔇";
    audioToggle.style.color = isMusicPlaying ? "#d44d6e" : "#8a6b8a";
  }

  function setupAnimations() {
    paragraphs.forEach((paragraph, index) => {
      setTimeout(() => {
        paragraph.classList.add("visible");
      }, 300 + index * 400);
    });

    featureCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("visible");
      }, 800 + index * 200);
    });
  }

  function setupNavigation() {
    backButton.addEventListener("click", function (e) {
      e.preventDefault();
      this.style.transform = "scale(0.95)";
      this.style.backgroundColor = "rgba(212, 77, 110, 0.2)";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 300);
    });

    continueButton.addEventListener("click", function (e) {
      e.preventDefault();
      this.style.transform = "scale(0.95)";
      this.style.backgroundColor = "rgba(212, 77, 110, 0.4)";
      this.style.textShadow = "0 0 20px rgba(255, 123, 156, 0.8)";

      simulateGameLoad();
    });

    [backButton, continueButton].forEach((button) => {
      button.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.05)";
      });

      button.addEventListener("mouseleave", function () {
        if (!this.classList.contains("loading")) {
          this.style.transform = "";
        }
      });
    });
  }

  function simulateGameLoad() {
    const continueBtn = continueButton;
    const originalText = continueBtn.textContent;
    continueBtn.classList.add("loading");
    continueBtn.innerHTML = 'CARREGANDO <span class="loading-dots"></span>';
    continueBtn.style.cursor = "wait";

    const progressContainer = document.querySelector(".progress-container");
    const progressFill = document.querySelector(".progress-fill");

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;

      progressFill.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          alert(
            "Jogo carregado! Em um jogo real, isso iniciaria a gameplay.\n\nEsta é uma demonstração da página de história."
          );

          continueBtn.classList.remove("loading");
          continueBtn.innerHTML = originalText;
          continueBtn.style.cursor = "";
          continueBtn.style.transform = "";
          continueBtn.style.backgroundColor = "";
          continueBtn.style.textShadow = "";
        }, 500);
      }
    }, 200);
  }

  function setupKeyboardControls() {
    document.addEventListener("keydown", function (e) {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          window.location.href = "index.html";
          break;

        case "m":
        case "M":
          e.preventDefault();
          audioToggle.click();
          break;

        case "ArrowLeft":
          e.preventDefault();
          backButton.focus();
          backButton.style.transform = "scale(1.05)";
          setTimeout(() => {
            if (!backButton.classList.contains("loading")) {
              backButton.style.transform = "";
            }
          }, 200);
          break;

        case "ArrowRight":
          e.preventDefault();
          continueButton.focus();
          continueButton.style.transform = "scale(1.05)";
          setTimeout(() => {
            if (!continueButton.classList.contains("loading")) {
              continueButton.style.transform = "";
            }
          }, 200);
          break;

        case "Enter":
          if (document.activeElement === backButton) {
            e.preventDefault();
            backButton.click();
          } else if (document.activeElement === continueButton) {
            e.preventDefault();
            continueButton.click();
          }
          break;

        case " ":
          e.preventDefault();
          if (hasInteracted) {
            audioToggle.click();
          }
          break;
      }
    });
  }

  function createBackgroundParticles() {
    const particlesContainer = document.querySelector(".particles-container");
    particlesContainer.innerHTML = "";

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = Math.random() * 4 + 1 + "px";
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = "#d44d6e";
      particle.style.borderRadius = "50%";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      particle.style.boxShadow = "0 0 8px rgba(212, 77, 110, 0.7)";

      particlesContainer.appendChild(particle);

      animateParticle(particle);
    }
  }

  function animateParticle(particle) {
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);
    const amplitude = Math.random() * 20 + 10;
    const speed = Math.random() * 0.002 + 0.001;
    let time = Math.random() * Math.PI * 2;

    function moveParticle() {
      time += speed;
      const x = startX + amplitude * Math.sin(time);
      const y = startY + amplitude * Math.cos(time * 0.7);

      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;

      particle.style.opacity = 0.1 + 0.2 * (0.5 + 0.5 * Math.sin(time * 3));

      requestAnimationFrame(moveParticle);
    }

    moveParticle();
  }

  const style = document.createElement("style");
  style.textContent = `
        .loading-dots::after {
            content: '.';
            animation: dots 1.5s steps(5, end) infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
    `;
  document.head.appendChild(style);

  initStoryPage();

  window.addEventListener("resize", createBackgroundParticles);
});
