// Initial elements and combination rules
const baseElements = ['Water', 'Fire', 'Earth', 'Air'];
const combinations = {
  'Water+Fire': 'Steam',
  'Water+Earth': 'Mud',
  'Fire+Earth': 'Lava',
  'Air+Water': 'Rain',
  // Add more combinations as you go
};

// Initialize game state
let inventory = [...baseElements];
let discoveredElements = new Set(baseElements);

// Function to render inventory
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

// Drag and drop functions
function drag(event, element) {
  event.dataTransfer.setData('element', element);
}

function drop(event) {
  event.preventDefault();
  const element = event.dataTransfer.getData('element');
  const workspaceDiv = document.getElementById('workspace');

  if (workspaceDiv.children.length === 1) {
    const firstElement = workspaceDiv.children[0].textContent;
    const combinationKey = `${firstElement}+${element}` in combinations ? `${firstElement}+${element}` : `${element}+${firstElement}`;
    
    if (combinations[combinationKey] && !discoveredElements.has(combinations[combinationKey])) {
      const result = combinations[combinationKey];
      inventory.push(result);
      discoveredElements.add(result);
      showMessage(`You created: ${result}!`);
    } else {
      showMessage("No combination found!");
    }
    workspaceDiv.innerHTML = '';
  } else {
    const elDiv = document.createElement('div');
    elDiv.textContent = element;
    workspaceDiv.appendChild(elDiv);
  }
  renderInventory();
}

function allowDrop(event) {
  event.preventDefault();
}

// Show message function
function showMessage(msg) {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = msg;
}

// Initial render
document.getElementById('workspace').ondrop = drop;
document.getElementById('workspace').ondragover = allowDrop;
renderInventory();
