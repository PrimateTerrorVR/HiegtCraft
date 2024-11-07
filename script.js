// Base elements with emojis
const baseElements = [
  { name: 'Water 💧', emoji: '💧' },
  { name: 'Fire 🔥', emoji: '🔥' },
  { name: 'Earth 🌍', emoji: '🌍' },
  { name: 'Air 🌬️', emoji: '🌬️' },
  // Add more elements up to 100
  { name: 'Metal ⚙️', emoji: '⚙️' },
  { name: 'Tree 🌳', emoji: '🌳' },
  { name: 'Sun ☀️', emoji: '☀️' },
  { name: 'Moon 🌙', emoji: '🌙' },
  // And so on up to 100 elements
];

// Sample combinations (expand this as needed)
const combinations = {
  'Water 💧+Fire 🔥': 'Steam 🌫️',
  'Water 💧+Earth 🌍': 'Mud 🧱',
  'Fire 🔥+Earth 🌍': 'Lava 🌋',
  'Air 🌬️+Water 💧': 'Rain 🌧️',
  'Sun ☀️+Tree 🌳': 'Fruit 🍎',
  // Add more combinations for more complex gameplay
};

// Load or initialize game state
let inventory = JSON.parse(localStorage.getItem('alchemyInventory')) || baseElements.map(e => e.name);
let discoveredElements = new Set(inventory);

// Function to render the inventory
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
    workspaceBoard.innerHTML = '';
  } else {
    const elDiv = document.createElement('div');
    elDiv.textContent = element;
    workspaceBoard.appendChild(elDiv);
  }
  renderInventory();
}

function allowDrop(event) {
  event.preventDefault();
}

// Show a message in the message box
function showMessage(msg) {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = msg;
}

// Particles effect on successful combination
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
