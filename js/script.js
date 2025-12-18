document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".menu-item");
  const arrow = document.querySelector(".selection-arrow");
  const bgMusic = document.getElementById("bg-music");
  const audioToggle = document.getElementById("audio-toggle");
  const audioTooltip = document.querySelector(".audio-tooltip");
  let currentIndex = 0;
  let isMusicPlaying = true;
  function setupAudio() {
    bgMusic.volume = 0.5;
    bgMusic.loop = true;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        audioTooltip.textContent = "Clique para ativar áudio";
        isMusicPlaying = false;
        updateAudioButton();
      });
    }
    audioToggle.addEventListener("click", function () {
      if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        audioTooltip.textContent = "Música: Desligada";
      } else {
        bgMusic
          .play()
          .then(() => {
            isMusicPlaying = true;
            audioTooltip.textContent = "Música: Ligada";
          })
          .catch(() => {
            audioTooltip.textContent = "Clique novamente";
          });
      }
      updateAudioButton();
    });
  }
  function updateAudioButton() {
    const icon = audioToggle.querySelector(".audio-icon");
    icon.textContent = isMusicPlaying ? "♪" : "🔇";
    audioToggle.style.color = isMusicPlaying ? "#d44d6e" : "#8a6b8a";
  }
  function initializeMenu() {
    createBackgroundParticles();
    updateSelection();
    document.addEventListener("keydown", function (e) {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          currentIndex =
            (currentIndex - 1 + menuItems.length) % menuItems.length;
          updateSelection();
          break;

        case "ArrowDown":
          e.preventDefault();
          currentIndex = (currentIndex + 1) % menuItems.length;
          updateSelection();
          break;

        case "Enter":
          e.preventDefault();
          selectMenuItem();
          break;

        case "m":
        case "M":
          e.preventDefault();
          audioToggle.click();
          break;
      }
    });
    menuItems.forEach((item, index) => {
      item.addEventListener("mouseenter", function () {
        currentIndex = index;
        updateSelection();
      });

      item.addEventListener("click", function (e) {
        e.preventDefault();
        currentIndex = index;
        selectMenuItem();
      });
    });
  }
  function updateSelection() {
    menuItems.forEach((item) => {
      item.classList.remove("active");
    });
    const currentItem = menuItems[currentIndex];
    currentItem.classList.add("active");
    const itemRect = currentItem.getBoundingClientRect();
    const containerRect = document
      .querySelector(".container")
      .getBoundingClientRect();
    arrow.style.opacity = "1";
    arrow.style.transform = `translateX(-250px) translateY(${
      itemRect.top - containerRect.top + itemRect.height / 2 - 20
    }px)`;
    if (window.innerWidth <= 768) {
      arrow.style.transform = `translateX(-200px) translateY(${
        itemRect.top - containerRect.top + itemRect.height / 2 - 15
      }px)`;
    }
    if (window.innerWidth <= 480) {
      arrow.style.transform = `translateX(-150px) translateY(${
        itemRect.top - containerRect.top + itemRect.height / 2 - 12
      }px)`;
    }
  }
  function selectMenuItem() {
    const selectedItem = menuItems[currentIndex];
    const itemType = selectedItem.getAttribute("data-item");
    selectedItem.style.transform = "scale(1.1)";
    selectedItem.style.color = "#ff9ebb";
    selectedItem.style.textShadow = "0 0 25px rgba(255, 158, 187, 0.9)";
    createSilkParticleEffect(selectedItem);
    playSelectSound();
    setTimeout(() => {
      switch (itemType) {
        case "start":
          const mainContainer = document.querySelector(".container");
          if (mainContainer) {
            mainContainer.style.transition = "opacity 0.1s ease-out";
            mainContainer.style.opacity = "0";
          }
          showMessage("Iniciando Hollow Knight Silksong...");
          setTimeout(() => {
            window.location.href = selectedItem.href;
          }, 2500);
          break;

        case "options":
          showMessage("Opções do jogo - Em desenvolvimento");
          // Aqui iria o código para abrir as opções
          break;

        case "extra":
          showMessage("Conteúdo Extra - Arte e Trilha Sonora");
          // Aqui iria o código para conteúdo extra
          break;

        case "quit":
          showMessage("Saindo de Hallownest...");
          setTimeout(() => {
            document.body.style.opacity = "0";
            document.body.style.transition = "opacity 1s ease";
            setTimeout(() => {
              alert("Até a próxima aventura!");
            }, 1000);
          }, 500);
          break;
      }
      setTimeout(() => {
        selectedItem.style.transform = "";
        selectedItem.style.color = "";
        selectedItem.style.textShadow = "";
      }, 300);
    }, 300);
  }
  function createSilkParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = `${Math.random() * 6 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = "#d44d6e";
      particle.style.borderRadius = "50%";
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "10";
      particle.style.boxShadow = "0 0 15px #d44d6e";
      particle.style.opacity = "0.9";
      document.querySelector(".background-effects").appendChild(particle);
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2;
      const distance = 50 + Math.random() * 100;
      const animation = particle.animate(
        [
          {
            transform: "translate(0, 0) scale(1)",
            opacity: 1,
          },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${
              Math.sin(angle) * distance
            }px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 800 + Math.random() * 700,
          easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
        }
      );
      animation.onfinish = () => {
        particle.remove();
      };
    }
  }
  function createBackgroundParticles() {
    const container = document.querySelector(".particles-container");
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 4 + 1;
      particle.style.position = "absolute";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = "#d44d6e";
      particle.style.borderRadius = "50%";
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.opacity = `${Math.random() * 0.4 + 0.1}`;
      particle.style.boxShadow = "0 0 8px rgba(212, 77, 110, 0.7)";
      container.appendChild(particle);
      animateSilkParticle(particle);
    }
  }
  function animateSilkParticle(particle) {
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const amplitude = Math.random() * 15 + 5;
    const speed = Math.random() * 0.001 + 0.0005;
    let time = Math.random() * Math.PI * 2;
    function moveParticle() {
      time += speed;
      const x = startX + amplitude * Math.sin(time * 1.3);
      const y = startY + amplitude * Math.cos(time * 0.9);
      particle.style.left = `${x}vw`;
      particle.style.top = `${y}vh`;
      particle.style.opacity = 0.1 + 0.3 * (0.5 + 0.5 * Math.sin(time * 2));
      requestAnimationFrame(moveParticle);
    }
    moveParticle();
  }
  function playSelectSound() {
    console.log("Som de seleção: Silksong menu select");
  }
  function showMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = text;
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "50%";
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translate(-50%, -50%)";
    messageDiv.style.backgroundColor = "rgba(12, 8, 20, 0.9)";
    messageDiv.style.color = "#ff9ebb";
    messageDiv.style.padding = "20px 40px";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.border = "2px solid #d44d6e";
    messageDiv.style.zIndex = "100";
    messageDiv.style.fontFamily = "'MedievalSharp', cursive";
    messageDiv.style.fontSize = "1.2rem";
    messageDiv.style.textAlign = "center";
    messageDiv.style.boxShadow = "0 0 30px rgba(212, 77, 110, 0.5)";
    document.body.appendChild(messageDiv);
    setTimeout(() => {
      messageDiv.style.opacity = "0";
      messageDiv.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        document.body.removeChild(messageDiv);
      }, 500);
    }, 1500);
  }
  setupAudio();
  initializeMenu();
  window.addEventListener("resize", updateSelection);
});
