// Basic elements with emojis to start with
const baseElements = [
  'Water 💧', 'Fire 🔥', 'Earth 🌍', 'Air 🌬️'
];

// Combination dictionary for creating new elements
const combinations = {
  'Water 💧+Fire 🔥': 'Steam 🌫️',
  'Water 💧+Earth 🌍': 'Mud 🧱',
  'Water 💧+Air 🌬️': 'Mist 🌁',
  'Fire 🔥+Earth 🌍': 'Lava 🌋',
  'Fire 🔥+Air 🌬️': 'Energy ⚡',
  'Earth 🌍+Air 🌬️': 'Dust 💨',
  'Air 🌬️+Steam 🌫️': 'Cloud ☁️',
  'Water 💧+Cloud ☁️': 'Rain 🌧️',
  'Earth 🌍+Rain 🌧️': 'Plant 🌱',
  'Plant 🌱+Sun ☀️': 'Tree 🌳',
  'Fire 🔥+Tree 🌳': 'Ash 🖤',
  'Tree 🌳+Earth 🌍': 'Forest 🌲',
  'Rain 🌧️+Sun ☀️': 'Rainbow 🌈',
  'Air 🌬️+Earth 🌍': 'Sand 🏖️',
  'Sand 🏖️+Fire 🔥': 'Glass 🪟',
  'Mud 🧱+Fire 🔥': 'Brick 🧱',
  'Cloud ☁️+Air 🌬️': 'Sky 🌌',
  'Sky 🌌+Sun ☀️': 'Day ☀️',
  'Sky 🌌+Moon 🌙': 'Night 🌑',
  'Tree 🌳+Metal ⚙️': 'Tool 🛠️',
  'Water 💧+Metal ⚙️': 'Rust 🛠️',
  // Keep adding more here if needed...
};

// Initialize or load game state from localStorage
let inventory = JSON.parse(localStorage.getItem('alchemyInventory')) || baseElements;
let discoveredElements = new Set(inventory);

// Function to render elements in the inventory
function renderInventory() {
  const elementsDiv = document.getElementById('elements');
  elementsDiv.innerHTML = '';
  inventory.forEach((element) => {
    const elDiv = document.createElement('div');
    elDiv.textContent = element;
    elDiv.draggable = true;
    elDiv.ondragstart = (e) => drag(e, element);
    elementsDiv.appendChild(elDiv);
  });
}

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem('alchemyInventory', JSON.stringify(inventory));
}

// Drag-and-drop functions
function drag(event, element) {
  event.dataTransfer.setData('element', element);
}

function drop(event) {
  event.preventDefault();
  const element = event.dataTransfer.getData('element');
  const workspaceBoard = document.getElementById('workspace-board');

  // Append the dragged element to the workspace
  const elDiv = document.createElement('div');
  elDiv.textContent = element;
  elDiv.draggable = true;
  elDiv.ondragstart = (e) => drag(e, element);
  workspaceBoard.appendChild(elDiv);

  // Check for a combination if there's another element in the workspace
  if (workspaceBoard.children.length >= 2) {
    const firstElement = workspaceBoard.children[0].textContent;
    const secondElement = element;
    const combinationKey1 = `${firstElement}+${secondElement}`;
    const combinationKey2 = `${secondElement}+${firstElement}`;
    let result;

    if (combinations[combinationKey1]) {
      result = combinations[combinationKey1];
    } else if (combinations[combinationKey2]) {
      result = combinations[combinationKey2];
    }

    if (result && !discoveredElements.has(result)) {
      inventory.push(result);
      discoveredElements.add(result);
      showMessage(`You created: ${result}!`);
      showParticles();
      saveProgress();
      renderInventory();
    } else if (!result) {
      showMessage("No combination found!");
    }
  }
}

function allowDrop(event) {
  event.preventDefault();
}

// Show message in message box
function showMessage(msg) {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = msg;
}

// Particle effect for successful combination
function showParticles() {
  const workspace = document.getElementById('workspace');
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    workspace.appendChild(particle);
    setTimeout(() => particle.remove(), 1000); // Remove after animation
  }
}

// Initialize the game
document.getElementById('workspace-board').ondrop = drop;
document.getElementById('workspace-board').ondragover = allowDrop;
renderInventory();
