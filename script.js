// Elements and combinations
const baseElements = ['Water', 'Fire', 'Earth', 'Air'];
const combinations = {
  'Water+Fire': 'Steam',
  'Water+Earth': 'Mud',
  'Fire+Earth': 'Lava',
  'Air+Water': 'Rain',
};

// Load or initialize game state
let inventory = JSON.parse(localStorage.getItem('alchemyInventory')) || [...baseElements];
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
      saveProgress();  // Save new progress
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

// Initialize the game
document.getElementById('workspace-board').ondrop = drop;
document.getElementById('workspace-board').ondragover = allowDrop;
renderInventory();
