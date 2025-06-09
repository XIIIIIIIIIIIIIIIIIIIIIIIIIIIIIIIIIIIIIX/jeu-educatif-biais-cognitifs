const biaisData = [
      {
        name: "Biais de confirmation",
        icon: "fa-solid fa-magnifying-glass",
        description: "Tendance à privilégier les informations confirmant ses croyances.",
        example: "J'ai lu plusieurs articles qui disent que les vaccins sont dangereux, donc cela doit être vrai.",
        phrase: "Marie ne lit que des actualités qui vont dans le sens de ses opinions politiques.",
      },
      {
        name: "Biais de disponibilité",
        icon: "fa-solid fa-bolt",
        description: "Juger la probabilité d'un événement selon la facilité avec laquelle on s'en souvient.",
        example: "Comme il y a eu un accident d'avion récemment, Paul pense que voyager en avion est dangereux.",
        phrase: "Après avoir entendu parler d'une attaque de requin, Lucie pense que se baigner en mer est risqué.",
      },
      {
        name: "Effet d'ancrage",
        icon: "fa-solid fa-anchor",
        description: "Accorder trop d'importance à la première information reçue.",
        example: "Si un t-shirt est affiché à 100€ puis soldé à 60€, on pense réaliser une bonne affaire même si sa valeur réelle est 40€.",
        phrase: "Le vendeur commence en proposant un prix très élevé, ce qui influence la négociation par la suite.",
      },
      {
        name: "Biais d'attribution",
        icon: "fa-solid fa-user-check",
        description: "Attribuer le comportement des autres à leur caractère, pas à la situation.",
        example: "Si quelqu'un se trompe en public, on pense qu'elle est maladroite plutôt que stressée.",
        phrase: "Quand Pierre rate sa présentation, ses collègues pensent qu'il est incompétent, sans considérer qu'il était malade.",
      },
      {
        name: "Effet de halo",
        icon: "fa-solid fa-star",
        description: "Penser qu'une qualité positive implique d'autres qualités positives.",
        example: "Penser qu'une personne belle est aussi intelligente ou gentille.",
        phrase: "Parce qu'Amélie est souriante, on suppose qu'elle est forcément compétente au travail.",
      },
      {
        name: "Biais de négativité",
        icon: "fa-solid fa-thumbs-down",
        description: "Donner plus de poids aux expériences négatives qu'aux positives.",
        example: "Après un commentaire négatif parmi beaucoup de positifs, Maxime ne pense qu'à la critique.",
        phrase: "Sur dix compliments et une critique, Julie ne retient que la critique.",
      },
      {
        name: "Biais de statu quo",
        icon: "fa-solid fa-clock-rotate-left",
        description: "Préférer que les choses restent telles qu'elles sont.",
        example: "Refuser un nouvel outil au travail même s'il améliore l'efficacité.",
        phrase: "Paul préfère les anciennes habitudes et rejette toute nouvelle méthode au bureau.",
      },
      {
        name: "Biais de l'optimisme",
        icon: "fa-solid fa-face-smile",
        description: "Surestimer la probabilité que des choses positives nous arrivent.",
        example: "Penser qu'il ne nous arrivera jamais d'accident de voiture, contrairement aux autres.",
        phrase: "Léa ne pense jamais qu'elle pourrait se blesser en pratiquant des sports extrêmes.",
      }
    ];

    // Shuffle bias list for answer order
    function shuffledBiaisList() {
      return biaisData
        .map((b, i) => ({...b, idx: i}))
        .sort(() => Math.random() - 0.5);
    }

    // Shuffle questions at each game
    function shuffledQuestions() {
      return biaisData
        .map((b, i) => ({ biais: b, answer: i}))
        .sort(() => Math.random() - 0.5)
        .map(x => x.answer)
    }

    // Game State
    let qIndices = [];
    let curr = 0;
    let points = 0;
    let selected = null;
    let ended = false;

    const phraseEl = document.getElementById('phrase');
    const biaisListEl = document.getElementById('biais-list');
    const confirmBtn = document.getElementById('confirm');
    const feedbackEl = document.getElementById('feedback');
    const nextBtn = document.getElementById('next');
    const scoreEl = document.getElementById('score');
    const endMsg = document.getElementById('end-message');
    const restartBtn = document.getElementById('restart');

    function updateScore() {
      scoreEl.textContent = `Score : ${points} / ${qIndices.length}`;
    }

    function showQuestion() {
      selected = null;
      confirmBtn.disabled = true;
      feedbackEl.className = "feedback";
      feedbackEl.innerHTML = "";
      nextBtn.style.display = "none";
      endMsg.style.display = "none";
      restartBtn.style.display = "none";

      if(curr >= qIndices.length) {
        showEnd();
        return;
      }

      updateScore();

      const qIdx = qIndices[curr];
      phraseEl.textContent = biaisData[qIdx].phrase;

      // Shuffle bias order for answers
      const options = shuffledBiaisList();
      biaisListEl.innerHTML = "";
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "biais-btn";
        btn.innerHTML = `<i class="${opt.icon}"></i> ${opt.name}`;
        btn.onclick = () => {
          setSelected(opt.idx, btn);
        };
        btn.title = opt.description;
        biaisListEl.appendChild(btn);
        btn.dataset.idx = opt.idx;
      });
    }

    function setSelected(idx, btn) {
      selected = idx;
      // Unselect all
      Array.from(biaisListEl.children).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      confirmBtn.disabled = false;
    }

    function handleConfirm() {
      if(selected === null || ended) return;
      confirmBtn.disabled = true;

      const qIdx = qIndices[curr];
      const correct = (selected === qIdx);

      // Feedback
      if(correct) {
        feedbackEl.className = "feedback success";
        feedbackEl.innerHTML = `<i class="fa-solid fa-check-circle"></i> Bravo !`;
        points++;
      } else {
        feedbackEl.className = "feedback fail";
        feedbackEl.innerHTML = `<i class="fa-solid fa-xmark-circle"></i> Mauvaise réponse<br><span style='font-weight:400;font-size:0.97em;'>Biais correct : <b>${biaisData[qIdx].name}</b></span>`;
      }

      updateScore();

      // Disable further answer selection
      Array.from(biaisListEl.children).forEach(b => {
        b.onclick = null;
        b.disabled = true;
        if(Number(b.dataset.idx) === qIdx)
          b.style.border = "2px solid #43a047";
        else if(Number(b.dataset.idx) === selected)
          b.style.border = "2px solid #ea0a41";
      });

      setTimeout(() => {
        nextBtn.style.display = "";
        nextBtn.disabled = false;
      }, 420);
    }

    function nextQuestion() {
      curr++;
      showQuestion();
    }

    function showEnd() {
      ended = true;
      feedbackEl.className = "feedback";
      feedbackEl.innerHTML = "";
      biaisListEl.innerHTML = "";
      phraseEl.textContent = "Partie terminée !";
      scoreEl.textContent = `Score final : ${points} / ${qIndices.length}`;
      endMsg.style.display = "";
      if(points === qIndices.length) {
        endMsg.textContent = "Parfait ! Aucun biais ne t'échappe 🏆";
      } else if(points >= qIndices.length * 0.7) {
        endMsg.textContent = "Très bien joué, tu maîtrises les biais 🙌";
      } else if(points >= qIndices.length * 0.4) {
        endMsg.textContent = "Pas mal, persévère pour tous les détecter ! 😉";
      } else {
        endMsg.textContent = "Encore un peu d'entraînement ? Les biais sont partout... 🤔";
      }
      restartBtn.style.display = "";
      nextBtn.style.display = "none";
      confirmBtn.style.display = "none";
    }

    function startGame() {
      ended = false;
      curr = 0;
      points = 0;
      confirmBtn.style.display = "";
      // Shuffle questions
      qIndices = shuffledQuestions();
      nextBtn.style.display = "none";
      endMsg.style.display = "none";
      restartBtn.style.display = "none";
      showQuestion();
    }

    // Event listeners
    confirmBtn.onclick = handleConfirm;
    nextBtn.onclick = nextQuestion;
    restartBtn.onclick = startGame;

    // INIT
    startGame();