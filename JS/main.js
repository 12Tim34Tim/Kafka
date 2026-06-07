// Main controller script for "Literarischer Reiseführer: Franz Kafkas Prag"

// Safe LocalStorage helpers to prevent crashes in iOS Private Browsing
function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn("localStorage.getItem failed:", e);
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("localStorage.setItem failed:", e);
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn("localStorage.removeItem failed:", e);
  }
}

// Station & Route Data
const STATIONS = STATIONS_DATA;
const ROUTES = ROUTES_DATA;

// App State
let currentStepIndex = -1; // -1 = Intro, 0..30 = Steps, 31 = Poster
let tourResults = {};
let playerName = "";

// Cache DOM Elements
const introScreen = document.getElementById('introScreen');
const stationScreen = document.getElementById('stationScreen');
const posterScreen = document.getElementById('posterScreen');
const adminScreen = document.getElementById('adminScreen');
const appTitle = document.getElementById('appTitle');
const archiveStatus = document.getElementById('archiveStatus');

const stationSubtitle = document.getElementById('stationSubtitle');
const stationTitle = document.getElementById('stationTitle');
const stationDescription = document.getElementById('stationDescription');
const stationTask = document.getElementById('stationTask');
const stationTaskContainer = document.getElementById('stationTaskContainer');
const stationCounter = document.getElementById('stationCounter');
const actionBtn = document.getElementById('actionBtn');
const stationNarrative = document.querySelector('.station-narrative');

const gameModal = document.getElementById('gameModal');
const gameModalTitle = document.getElementById('gameModalTitle');
const gameIframe = document.getElementById('gameIframe');
const journalGrid = document.getElementById('journalGrid');

const progressOverviewModal = document.getElementById('progressOverviewModal');
const progressOverviewList = document.getElementById('progressOverviewList');

// Initialize App
function initApp() {
  let loadedFromShare = false;
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('share');

  if (shareId) {
    // Show a basic loader or placeholder text in header
    appTitle.textContent = "Lade geteiltes Tagebuch...";
    archiveStatus.textContent = "LADE DATEN...";
    
    fetch(`/api/share?id=${shareId}`)
      .then(response => {
        if (!response.ok) throw new Error("Journal not found");
        return response.json();
      })
      .then(data => {
        tourResults = data.results || data; // backward compatible
        playerName = data.playerName || "Ein Reisender";
        currentStepIndex = TOUR_STEPS.length; // Lock to finished poster screen
        renderCurrentState();
      })
      .catch(err => {
        console.error("Failed to load shared journal:", err);
        alert("Das geteilte Tagebuch konnte nicht geladen werden oder existiert nicht.");
        loadStateFromLocalStorage();
      });
    loadedFromShare = true;
  }

  if (!loadedFromShare) {
    loadStateFromLocalStorage();
  }

  // Listen for messages from mini-game iframes
  window.addEventListener('message', handleGameMessage);
}

function loadStateFromLocalStorage() {
  // Load state from localStorage
  const savedStep = safeGetItem('kafka_tour_step_index');
  const savedResults = safeGetItem('kafka_tour_results');
  const savedName = safeGetItem('kafka_player_name');

  if (savedStep !== null) {
    currentStepIndex = parseInt(savedStep, 10);
  }
  if (savedResults !== null) {
    tourResults = JSON.parse(savedResults);
  }
  if (savedName !== null) {
    playerName = savedName;
  }
  renderCurrentState();
}

// Render screens according to state
function renderCurrentState() {
  // Reset screens
  introScreen.classList.remove('active');
  stationScreen.classList.remove('active');
  posterScreen.classList.remove('active');
  if (adminScreen) adminScreen.classList.remove('active');

  // Reset scroll position of the narrative content
  if (stationNarrative) {
    stationNarrative.scrollTop = 0;
  }

  if (currentStepIndex === -2) {
    // Admin Screen
    if (adminScreen) adminScreen.classList.add('active');
    appTitle.textContent = "Admin-Dashboard // Kafkas Prag";
    archiveStatus.textContent = "ADMIN-MODUS";
    archiveStatus.style.color = "var(--accent-red)";
    loadAdminTours();
  } else if (currentStepIndex === -1) {
    // Intro Screen
    introScreen.classList.add('active');
    appTitle.textContent = "Literarischer Reiseführer // Franz Kafkas Prag";
    archiveStatus.textContent = "REISEBEREIT";
    archiveStatus.style.color = "var(--text-muted)";
    showIntroStep(1);
    
    // Check if name input exists, pre-fill and validate
    setTimeout(() => {
      const nameInput = document.getElementById('playerNameInput');
      if (nameInput) {
        nameInput.value = playerName;
        validateNameInput();
        
        // Add scroll reset on blur to fix mobile keyboard layout shifts
        if (!nameInput.dataset.scrollBound) {
          nameInput.dataset.scrollBound = "true";
          nameInput.addEventListener('blur', () => {
            setTimeout(() => {
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
            }, 80);
          });
        }
      }
    }, 50);
  } else if (currentStepIndex >= 0 && currentStepIndex < TOUR_STEPS.length) {
    // Active Tour Step (Route or Station)
    stationScreen.classList.add('active');
    
    const step = TOUR_STEPS[currentStepIndex];
    
    if (step.type === 'route') {
      // Render Route Directions
      const route = ROUTES.find(r => r.id === step.id);
      
      appTitle.textContent = `Wegbeschreibung // ${route.from}`;
      archiveStatus.textContent = "WEG ZUM ZIEL...";
      archiveStatus.style.color = "var(--text-muted)";
      
      stationSubtitle.textContent = `${route.chapter} // ⏱ ${route.time} ▾`;
      stationTitle.textContent = route.title;
      stationDescription.innerHTML = route.description;
      
      stationTaskContainer.style.display = 'none';
      stationCounter.textContent = `Weganweisung ${route.id} von ${ROUTES.length}`;
      
      actionBtn.textContent = "Ich bin angekommen →";
      actionBtn.classList.add('btn-accent');
    } else if (step.type === 'station') {
      // Render Station Context & task
      const station = STATIONS.find(s => s.id === step.id);
      
      // Look up preceding route step to extract chapter
      const precedingRouteStep = TOUR_STEPS[currentStepIndex - 1];
      let chapterLabel = "Reise-Station";
      if (precedingRouteStep && precedingRouteStep.type === 'route') {
        const route = ROUTES.find(r => r.id === precedingRouteStep.id);
        chapterLabel = route.chapter;
      }
      
      appTitle.textContent = `Station // ${station.title}`;
      archiveStatus.textContent = "STATION WIRD BESUCHT...";
      archiveStatus.style.color = "var(--accent-red)";
      
      stationSubtitle.textContent = `${chapterLabel} // Station ${station.id} ▾`;
      stationTitle.textContent = station.title;
      stationDescription.innerHTML = station.description;
      
      if (station.task) {
        stationTask.innerHTML = station.task;
        stationTaskContainer.style.display = 'block';
      } else {
        stationTaskContainer.style.display = 'none';
      }
      
      // Count completed stations
      const completedStationsCount = Object.keys(tourResults).length;
      stationCounter.textContent = `Station ${completedStationsCount} von 15 gelöst`;
      
      const result = tourResults[station.id];
      if (result) {
        actionBtn.textContent = "Weitergehen →";
        actionBtn.classList.add('btn-accent');
      } else {
        actionBtn.textContent = "Station erkunden";
        actionBtn.classList.add('btn-accent');
      }
    }
  } else {
    // Poster Screen (Completed)
    posterScreen.classList.add('active');
    appTitle.textContent = `Reisetagebuch von ${playerName || "Einem Reisenden"} // Franz Kafkas Prag`;
    archiveStatus.textContent = "REISEJOURNAL COMPLETED";
    archiveStatus.style.color = "var(--accent-red)";
    renderPoster();
  }
}

// Switch between Intro steps
function showIntroStep(step) {
  const step1 = document.getElementById('introStep1');
  const step2 = document.getElementById('introStep2');
  const introScreen = document.getElementById('introScreen');
  
  if (step === 1) {
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';
  } else {
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = 'block';
  }
  
  if (introScreen) {
    introScreen.scrollTop = 0;
  }
}

// Start Tour Action
function startTour() {
  const nameInput = document.getElementById('playerNameInput');
  if (nameInput) {
    playerName = nameInput.value.trim();
    safeSetItem('kafka_player_name', playerName);
    
    // Blur to trigger keyboard hide
    nameInput.blur();
  }
  
  // Reset scroll to top to fix viewport layout shifts on mobile
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  
  if (playerName === "IchBinTimur") {
    currentStepIndex = -2;
    renderCurrentState();
    return;
  }
  currentStepIndex = 0;
  safeSetItem('kafka_tour_step_index', currentStepIndex);
  renderCurrentState();
}

// Go to next step
function nextStep() {
  if (currentStepIndex >= 0 && currentStepIndex < TOUR_STEPS.length) {
    const step = TOUR_STEPS[currentStepIndex];
    if (step.type === 'station') {
      const station = STATIONS.find(s => s.id === step.id);
      if (!tourResults[station.id]) {
        return;
      }
    }

    currentStepIndex++;
    safeSetItem('kafka_tour_step_index', currentStepIndex);
    renderCurrentState();
  }
}

// Reset / Restart Tour
function resetTour() {
  const isShared = new URLSearchParams(window.location.search).has('share');
  const msg = isShared 
    ? "Möchten Sie die geteilte Ansicht verlassen und Ihre eigene Reise von vorn beginnen?"
    : "Möchten Sie diese Reise zurücksetzen? Alle Ihre gelösten Aufgaben werden zurückgesetzt.";

  if (confirm(msg)) {
    safeRemoveItem('kafka_tour_step_index');
    safeRemoveItem('kafka_tour_results');
    currentStepIndex = -1;
    tourResults = {};
    if (isShared) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    renderCurrentState();
  }
}

// Mini Game Modal Handling
function openMiniGame() {
  if (currentStepIndex >= 0 && currentStepIndex < TOUR_STEPS.length) {
    const step = TOUR_STEPS[currentStepIndex];
    if (step.type === 'station') {
      const station = STATIONS.find(s => s.id === step.id);
      gameModalTitle.textContent = `Aufgabe: ${station.title}`;
      const nameParam = encodeURIComponent(playerName || "");
      gameIframe.src = station.gameUrl + "?v=" + Date.now() + "&name=" + nameParam;
      gameModal.classList.add('active');
    }
  }
}

function closeMiniGame() {
  gameModal.classList.remove('active');
  gameIframe.src = "about:blank";
  
  const overlay = document.getElementById('interpretationOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
  
  // Reset window and body scroll positions to fix iOS keyboard scroll bugs
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
}

function handleNavigationAction() {
  if (currentStepIndex >= 0 && currentStepIndex < TOUR_STEPS.length) {
    const step = TOUR_STEPS[currentStepIndex];
    if (step.type === 'route') {
      nextStep();
    } else if (step.type === 'station') {
      const station = STATIONS.find(s => s.id === step.id);
      const result = tourResults[station.id];
      if (result) {
        nextStep();
      } else {
        openMiniGame();
      }
    }
  }
}

// postMessage Event Listener from mini-game iframes
function handleGameMessage(event) {
  if (!event.data || event.data.type !== 'GAME_SUCCESS') return;

  const data = event.data.data;
  if (currentStepIndex >= 0 && currentStepIndex < TOUR_STEPS.length) {
    const step = TOUR_STEPS[currentStepIndex];
    if (step.type === 'station') {
      const station = STATIONS.find(s => s.id === step.id);

      // Save result
      tourResults[station.id] = {
        type: station.resultType,
        value: data
      };
      safeSetItem('kafka_tour_results', JSON.stringify(tourResults));

      if (station.id === 4 || station.id === 8) {
        // Highscore stations: already displayed highscores inside the iframe.
        // Auto-close and auto-advance directly!
        setTimeout(() => {
          closeMiniGame();
          nextStep();
        }, 500);
      } else {
        // Non-highscore stations: check for beautiful interpretation
        fetch('/api/selected-interpretations')
          .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.json();
          })
          .then(selected => {
            const featured = selected[station.id];
            if (featured && featured.value) {
              // Show selected interpretation screen
              showInterpretationOverlay(station, featured);
            } else {
              // No interpretation selected yet, skip overlay and auto-advance directly
              closeMiniGame();
              nextStep();
            }
          })
          .catch(err => {
            console.error("Failed to load selected interpretations:", err);
            // On error, fallback to skipping overlay and auto-advancing
            closeMiniGame();
            nextStep();
          });
      }
    }
  }
}



// Progress Overview Modal Handling
function openProgressOverview() {
  if (progressOverviewModal) {
    renderProgressOverviewList();
    progressOverviewModal.classList.add('active');
  }
}

function closeProgressOverview() {
  if (progressOverviewModal) {
    progressOverviewModal.classList.remove('active');
  }
}

function renderProgressOverviewList() {
  if (!progressOverviewList) return;
  
  progressOverviewList.innerHTML = "";
  const container = document.createElement('div');
  container.className = 'progress-overview-list';
  
  const stationSteps = TOUR_STEPS.filter(s => s.type === 'station');
  
  stationSteps.forEach((step, idx) => {
    const station = STATIONS.find(s => s.id === step.id);
    const isCompleted = tourResults[station.id] !== undefined;
    
    let isActive = false;
    if (currentStepIndex >= 0 && currentStepIndex < TOUR_STEPS.length) {
      const currentStep = TOUR_STEPS[currentStepIndex];
      if (currentStep.type === 'station' && currentStep.id === station.id) {
        isActive = true;
      } else if (currentStep.type === 'route') {
        const nextStationStep = TOUR_STEPS.slice(currentStepIndex).find(s => s.type === 'station');
        if (nextStationStep && nextStationStep.id === station.id) {
          isActive = true;
        }
      }
    }
    
    const item = document.createElement('div');
    item.className = 'overview-item';
    
    if (isCompleted) {
      item.classList.add('completed');
    } else if (isActive) {
      item.classList.add('active');
    } else {
      item.classList.add('locked');
    }
    
    // Find chapter label
    const stepIdx = TOUR_STEPS.findIndex(s => s.type === 'station' && s.id === station.id);
    const precedingRouteStep = TOUR_STEPS[stepIdx - 1];
    let chapterLabel = "Reise-Station";
    if (precedingRouteStep && precedingRouteStep.type === 'route') {
      const route = ROUTES.find(r => r.id === precedingRouteStep.id);
      chapterLabel = route.chapter;
    }
    
    const info = document.createElement('div');
    info.className = 'overview-item-info';
    
    const title = document.createElement('div');
    title.className = 'overview-item-title';
    title.textContent = `${idx + 1}. ${station.title}`;
    info.appendChild(title);
    
    const chapter = document.createElement('div');
    chapter.className = 'overview-item-chapter';
    chapter.textContent = chapterLabel;
    info.appendChild(chapter);
    
    item.appendChild(info);
    
    const status = document.createElement('div');
    status.className = 'overview-item-status';
    if (isCompleted) {
      status.textContent = "✓ ERKUNDET";
    } else if (isActive) {
      status.textContent = "AKTUELL";
    } else {
      status.textContent = "GESPERRT";
    }
    item.appendChild(status);
    
    container.appendChild(item);
  });
  
  progressOverviewList.appendChild(container);
}

// Render final journal: inject screenshots into pre-built tiles
function renderPoster() {
  document.querySelectorAll('.journal-tile-screenshot').forEach(slot => {
    const stationId = parseInt(slot.getAttribute('data-station-id'), 10);
    const result = tourResults[stationId];

    if (result && result.type === 'image' && result.value) {
      const img = document.createElement('img');
      img.src = result.value;
      img.alt = `Station ${stationId}`;
      slot.appendChild(img);
    } else if (result && result.type === 'text' && result.value) {
      // Text result: render as typewriter block
      const pre = document.createElement('div');
      pre.style.cssText = 'font-family:var(--font-mono);font-size:0.78rem;line-height:1.5;color:var(--text-main);white-space:pre-wrap;word-break:break-word;border:1px dashed rgba(139,128,115,0.3);padding:8px 10px;width:100%;';
      pre.textContent = result.value;
      slot.appendChild(pre);
    } else {
      slot.classList.add('empty');
    }
  });
}



// Fire application setup on load
window.addEventListener('DOMContentLoaded', initApp);

// Share journal progress to server
function shareJournal() {
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.disabled = true;
    shareBtn.textContent = "Speichere...";
  }

  fetch('/api/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      playerName: playerName,
      results: tourResults
    })
  })
  .then(response => {
    if (!response.ok) throw new Error("HTTP error " + response.status);
    return response.json();
  })
  .then(data => {
    const shareUrl = window.location.origin + window.location.pathname + "?share=" + data.id;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Reise erfolgreich auf dem Server gespeichert! Link kopiert.");
      }).catch(() => {
        prompt("Kopiere diesen Link, um deine Reise zu teilen:", shareUrl);
      });
    } else {
      prompt("Kopiere diesen Link, um deine Reise zu teilen:", shareUrl);
    }
  })
  .catch(err => {
    console.error("Fehler beim Teilen:", err);
    alert("Fehler beim Speichern auf dem Server. Bitte erneut versuchen.");
  })
  .finally(() => {
    if (shareBtn) {
      shareBtn.disabled = false;
      shareBtn.textContent = "Reise teilen";
    }
  });
}

function validateNameInput() {
  const nameInput = document.getElementById('playerNameInput');
  const startBtn = document.getElementById('startTourBtn');
  if (nameInput && startBtn) {
    const val = nameInput.value.trim();
    if (val.length >= 2) {
      startBtn.disabled = false;
      playerName = val;
    } else {
      startBtn.disabled = true;
    }
  }
}

// Admin Dashboard & "Schönste Interpretation" Logic
let adminViewMode = 'tours'; // 'tours' or 'stations'
let selectedInterpretations = {};

function setAdminViewMode(mode) {
  adminViewMode = mode;
  
  // Update toggle button classes
  const toursBtn = document.getElementById('adminToggleToursBtn');
  const stationsBtn = document.getElementById('adminToggleStationsBtn');
  if (toursBtn && stationsBtn) {
    if (mode === 'tours') {
      toursBtn.classList.add('active');
      stationsBtn.classList.remove('active');
    } else {
      toursBtn.classList.remove('active');
      stationsBtn.classList.add('active');
    }
  }
  
  // Reload tours list with new view mode
  loadAdminTours();
}

function openAdminDashboard() {
  currentStepIndex = -2;
  renderCurrentState();
}

function exitAdmin() {
  currentStepIndex = -1;
  renderCurrentState();
}

function loadAdminTours() {
  const listEl = document.getElementById('adminToursList');
  if (!listEl) return;
  
  listEl.innerHTML = "<div style='font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);'>Lade eingereichte Reiseberichte und Auswahlen...</div>";
  
  // Fetch both selected interpretations and tours
  Promise.all([
    fetch('/api/selected-interpretations').then(r => r.json()),
    fetch('/api/admin/tours').then(r => r.json())
  ])
  .then(([selected, toursData]) => {
    selectedInterpretations = selected;
    const tours = toursData.tours || [];
    
    if (tours.length === 0) {
      listEl.innerHTML = "<div style='font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); border: 1px dashed var(--border-light); padding: 20px; text-align: center;'>Bisher wurden noch keine Reiseberichte eingereicht.</div>";
      return;
    }
    
    listEl.innerHTML = "";
    
    if (adminViewMode === 'tours') {
      // MODE: TOURS GROUPING
      tours.forEach(tour => {
        const card = document.createElement('div');
        card.className = 'prep-card'; // Reuse style for paper look
        card.style.cssText = 'display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 100%; box-sizing: border-box; transform: none; margin-bottom: 24px; padding: 24px 20px 20px 20px;';
        
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-focus); padding-bottom: 10px; margin-bottom: 5px;';
        
        const title = document.createElement('h3');
        title.style.cssText = 'font-family: var(--font-mono); font-size: 14px; font-weight: bold; margin: 0; color: var(--accent-red);';
        title.textContent = `Reisebericht von: ${tour.playerName}`;
        
        const shareLink = document.createElement('a');
        shareLink.href = `?share=${tour.id}`;
        shareLink.target = '_blank';
        shareLink.style.cssText = 'font-family: var(--font-sans); font-size: 11px; color: var(--text-muted); text-decoration: underline;';
        shareLink.textContent = `Tagebuch ansehen (ID: ${tour.id})`;
        
        header.appendChild(title);
        header.appendChild(shareLink);
        card.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = 'admin-submissions-grid';
        grid.style.cssText = 'width: 100%; box-sizing: border-box;';
        
        const results = tour.results || {};
        let hasInterpretations = false;
        
        Object.keys(results).forEach(stationId => {
          const sId = parseInt(stationId, 10);
          const station = STATIONS.find(s => s.id === sId);
          if (!station) return;
          
          // Skip highscore stations
          if (sId === 4 || sId === 8) return;
          
          hasInterpretations = true;
          
          const cell = document.createElement('div');
          cell.className = 'admin-submission-cell';
          
          const cellHeader = document.createElement('div');
          cellHeader.className = 'admin-sub-creator';
          cellHeader.textContent = `Station ${station.id}: ${station.title}`;
          cell.appendChild(cellHeader);
          
          const contentContainer = document.createElement('div');
          contentContainer.className = 'admin-sub-content';
          contentContainer.setAttribute('data-station-id', stationId);
          
          const res = results[stationId];
          if (res.type === 'image') {
            const img = document.createElement('img');
            img.src = res.value;
            contentContainer.appendChild(img);
          } else {
            const textBlock = document.createElement('div');
            textBlock.style.cssText = 'font-family: var(--font-mono); font-size: 11px; line-height: 1.4; color: var(--text-main); white-space: pre-wrap; word-break: break-word; text-align: left; width: 100%; padding: 5px;';
            textBlock.textContent = res.value;
            contentContainer.appendChild(textBlock);
          }
          cell.appendChild(contentContainer);
          
          const isSelected = selectedInterpretations[stationId] && selectedInterpretations[stationId].shareId === tour.id;
          const btn = document.createElement('button');
          if (isSelected) {
            btn.className = 'admin-btn-selected';
            btn.textContent = '★ Aktuell Ausgewählt – Klicken zum Abwählen';
            btn.onclick = () => deselectInterpretation(stationId);
          } else {
            btn.className = 'admin-btn-select';
            btn.textContent = 'Als schönste Interpretation wählen';
            btn.onclick = () => selectInterpretation(stationId, tour.id);
          }
          cell.appendChild(btn);
          
          grid.appendChild(cell);
        });
        
        if (!hasInterpretations) {
          const noData = document.createElement('div');
          noData.style.cssText = 'font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);';
          noData.textContent = "Keine passenden Stationseinträge in dieser Tour.";
          card.appendChild(noData);
        } else {
          card.appendChild(grid);
        }
        
        listEl.appendChild(card);
      });
    } else {
      // MODE: STATIONS GROUPING (Compare all submissions for each non-highscore station)
      // List each non-highscore station in order
      const nonHighscoreStations = STATIONS.filter(s => s.id !== 4 && s.id !== 8);
      
      nonHighscoreStations.forEach(station => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'admin-station-group';
        
        const groupHeader = document.createElement('div');
        groupHeader.className = 'admin-station-header';
        groupHeader.textContent = `Station ${station.id}: ${station.title}`;
        groupDiv.appendChild(groupHeader);
        
        const grid = document.createElement('div');
        grid.className = 'admin-submissions-grid';
        grid.style.cssText = 'width: 100%; box-sizing: border-box;';
        
        let hasSubmissions = false;
        
        // Find all submissions for this station across all tours
        tours.forEach(tour => {
          const results = tour.results || {};
          const res = results[station.id];
          if (res && res.value) {
            hasSubmissions = true;
            
            const cell = document.createElement('div');
            cell.className = 'admin-submission-cell';
            
            const cellHeader = document.createElement('div');
            cellHeader.className = 'admin-sub-creator';
            cellHeader.textContent = `Werk von: ${tour.playerName}`;
            cell.appendChild(cellHeader);
            
            const contentContainer = document.createElement('div');
            contentContainer.className = 'admin-sub-content';
            contentContainer.setAttribute('data-station-id', station.id);
            
            if (res.type === 'image') {
              const img = document.createElement('img');
              img.src = res.value;
              contentContainer.appendChild(img);
            } else {
              const textBlock = document.createElement('div');
              textBlock.style.cssText = 'font-family: var(--font-mono); font-size: 11px; line-height: 1.4; color: var(--text-main); white-space: pre-wrap; word-break: break-word; text-align: left; width: 100%; padding: 5px;';
              textBlock.textContent = res.value;
              contentContainer.appendChild(textBlock);
            }
            cell.appendChild(contentContainer);
            
            const isSelected = selectedInterpretations[station.id] && selectedInterpretations[station.id].shareId === tour.id;
            const btn = document.createElement('button');
            if (isSelected) {
              btn.className = 'admin-btn-selected';
              btn.textContent = '★ Aktuell Ausgewählt – Klicken zum Abwählen';
              btn.onclick = () => deselectInterpretation(station.id);
            } else {
              btn.className = 'admin-btn-select';
              btn.textContent = 'Als schönste Interpretation wählen';
              btn.onclick = () => selectInterpretation(station.id, tour.id);
            }
            cell.appendChild(btn);
            
            grid.appendChild(cell);
          }
        });
        
        if (!hasSubmissions) {
          const noData = document.createElement('div');
          noData.style.cssText = 'font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); font-style: italic; margin-top: 5px;';
          noData.textContent = "Bisher keine Einsendungen für diese Station vorhanden.";
          groupDiv.appendChild(noData);
        } else {
          groupDiv.appendChild(grid);
        }
        
        listEl.appendChild(groupDiv);
      });
    }
  })
  .catch(err => {
    console.error("Failed to load admin tours:", err);
    listEl.innerHTML = "<div style='font-family: var(--font-mono); font-size: 12px; color: var(--accent-red);'>Fehler beim Laden der Daten vom Server.</div>";
  });
}

function deselectInterpretation(stationId) {
  if (!confirm('Auswahl aufheben? Diese Interpretation wird dann bei der Station nicht mehr angezeigt.')) return;
  fetch('/api/admin/select-interpretation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stationId: stationId.toString(), shareId: null })
  })
  .then(response => {
    if (!response.ok) throw new Error('HTTP error ' + response.status);
    return response.json();
  })
  .then(data => {
    if (data.success) loadAdminTours();
  })
  .catch(err => {
    console.error('Failed to deselect interpretation:', err);
    alert('Fehler beim Aufheben der Auswahl.');
  });
}

function selectInterpretation(stationId, shareId) {
  fetch('/api/admin/select-interpretation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      stationId: stationId.toString(),
      shareId: shareId
    })
  })
  .then(response => {
    if (!response.ok) throw new Error("HTTP error " + response.status);
    return response.json();
  })
  .then(data => {
    if (data.success) {
      loadAdminTours(); // Reload to update buttons
    }
  })
  .catch(err => {
    console.error("Failed to select interpretation:", err);
    alert("Fehler beim Festlegen der Interpretation.");
  });
}

function showInterpretationOverlay(station, featured) {
  const overlay = document.getElementById('interpretationOverlay');
  const titleEl = document.getElementById('interpretationStationTitle');
  const creatorEl = document.getElementById('interpretationCreatorInfo');
  const contentEl = document.getElementById('interpretationContent');
  
  if (!overlay || !titleEl || !creatorEl || !contentEl) return;
  
  contentEl.setAttribute('data-station-id', station.id);
  titleEl.textContent = station.title;
  contentEl.innerHTML = "";
  
  creatorEl.textContent = `Ausgewählt von der Reiseleitung. Werk von: ${featured.playerName}`;
  
  const val = featured.value;
  if (typeof val === 'string' && val.startsWith('data:image/')) {
    const img = document.createElement('img');
    img.src = val;
    img.style.cssText = 'max-width: 100%; max-height: 250px; object-fit: contain; margin: 10px 0;';
    contentEl.appendChild(img);
  } else {
    const pre = document.createElement('pre');
    pre.style.cssText = 'font-family: var(--font-mono); font-size: 11px; text-align: left; white-space: pre-wrap; word-break: break-word; padding: 15px; margin: 0; background: #fafaf5; border: 1px dashed rgba(139,128,115,0.3); width: 100%; box-sizing: border-box;';
    pre.textContent = val;
    contentEl.appendChild(pre);
  }
  
  overlay.style.display = 'flex';
}

function confirmInterpretationAndClose() {
  const overlay = document.getElementById('interpretationOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
  closeMiniGame();
  nextStep();
}
