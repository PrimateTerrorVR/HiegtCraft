// Define base elements with emojis
const baseElements = [
  'Water 💧', 'Fire 🔥', 'Earth 🌍', 'Air 🌬️',
  'Metal ⚙️', 'Wood 🌳', 'Sun ☀️', 'Moon 🌙',
  'Energy ⚡', 'Dust 💨', 'Plant 🌱', 'Rock 🪨',
  // Add more base elements if needed
];

// Combinations to create new elements
const combinations = {
  'Water 💧+Fire 🔥': 'Steam 🌫️',
  'Water 💧+Earth 🌍': 'Mud 🧱',
  'Fire 🔥+Earth 🌍': 'Lava 🌋',
  'Air 🌬️+Water 💧': 'Rain 🌧️',
  'Sun ☀️+Plant 🌱': 'Growth 🌿',
  'Dust 💨+Energy ⚡': 'Spark 💥',
  'Earth 🌍+Metal ⚙️': 'Ore 🪙',
  'Water 💧+Air 🌬️': 'Cloud ☁️',
  'Rock 🪨+Energy ⚡': 'Magnet 🧲',
  // Add as many combinations as you like
};

// Initialize inventory and discovered elements
let inventory = JSON.parse(localStorage.getItem('alchemyInventory')) || [...baseElements];
let discoveredElements = new Set(inventory);

// Render inventory
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

// Save to localStorage
function saveProgress() {
  localStorage.setItem('alchemyInventory', JSON.stringify(inventory));
}

// Drag-and-drop setup
function drag(event, element) {
  event.dataTransfer.setData('element', element);
}

function drop(event) {
  event.preventDefault();
  const element = event.dataTransfer.getData('element');
  const workspaceBoard = document.getElementById('workspace-board');

  // If workspace already has an element, check for combinations
  if (workspaceBoard.children.length === 1) {
    const firstElement = workspaceBoard.children[0].textContent;
    const combinationKey = `${firstElement}+${element}` in combinations ? `${firstElement}+${element}` : `${element}+${firstElement}`;
    
    if (combinations[combinationKey] && !discoveredElements.has(combinations[combinationKey])) {
      const result = combinations[combinationKey];
      inventory.push(result);
      discoveredElements.add(result);
      showMessage(`You created: ${result}!`);
      showParticles();
      saveProgress();
    } else {
      showMessage("No combination found!");
    }
    workspaceBoard.innerHTML = ''; // Clear workspace after combination attempt
  } else {
    // Allow more elements to be dragged to workspace if no combination occurs
    const elDiv = document.createElement('div');
    elDiv.textContent = element;
    elDiv.draggable = true;
    elDiv.ondragstart = (e) => drag(e, element);
    workspaceBoard.appendChild(elDiv);
  }
  renderInventory();
}

function allowDrop(event) {
  event.preventDefault();
}

// Show message
function showMessage(msg) {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = msg;
}

// Particles effect for successful combination
function showParticles() {
  const workspace = document.getElementById('workspace');
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    workspace.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

// Initialize game
document.getElementById('workspace-board').ondrop = drop;
document.getElementById('workspace-board').ondragover = allowDrop;
renderInventory();
