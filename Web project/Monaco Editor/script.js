let editor;
const editorContainer = document.getElementById('editor-container');
const addTabButton = document.getElementById('add-tab-button');
const tabHeadersContainer = document.createElement('div');
tabHeadersContainer.classList.add('tab-headers');
editorContainer.appendChild(tabHeadersContainer);

function createEditorTab(fileName, ValueStr) {
  const tabElement = document.createElement('div');
  tabElement.classList.add('editor-tab');

  const tabHeader = document.createElement('div');
  tabHeader.classList.add('tab-header');

  const fileNameInput = document.createElement('input');
  fileNameInput.type = 'text';
  fileNameInput.value = fileName;
  fileNameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
     // fileNameInput.disabled = true; // Disable the input field
      fileNameInput.inert = true;
    }
  });

  tabHeader.appendChild(fileNameInput);

  tabHeader.addEventListener('click', () => {
    const activeTab = document.querySelector('.editor-tab.active');
    const activeTabHeader = document.querySelector('.tab-header.active');
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    if (activeTabHeader) {
      activeTabHeader.classList.remove('active');
    }
    tabElement.classList.add('active');
    tabHeader.classList.add('active');
    fileNameInput.disabled = false;
    
  });
  tabHeader.addEventListener('click', () => {
    // ...
    fileNameInput.disabled = false; // Enable the input field when the tab header is clicked
  });
  tabHeader.addEventListener('dblclick', () => {
    // ...
    fileNameInput.disabled = false; // Enable the input field when the tab header is clicked
    fileNameInput.inert = false;
  });
  
  const closeButton = document.createElement('span');
  closeButton.classList.add('close-button');
  closeButton.textContent = 'x';
  closeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    tabElement.remove();
    tabHeader.remove();
    editor.dispose();
    if (tabElement.classList.contains('active')) {
      const nextTab = document.querySelector('.editor-tab');
      const nextTabHeader = document.querySelector('.tab-header');
      if (nextTab) {
        nextTab.classList.add('active');
        nextTabHeader.classList.add('active');
      }
    }
  });

  tabHeader.appendChild(closeButton);
  tabHeadersContainer.appendChild(tabHeader);
  editorContainer.appendChild(tabElement);

  const editorElement = document.createElement('div');
  editorElement.classList.add('editor');
  tabElement.appendChild(editorElement);

  editor = monaco.editor.create(editorElement, {
    value: ValueStr,
    language: 'vb',
    theme: 'vs-dark',
    automaticLayout: true,
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    snippetSuggestions: "inline",
    wordBasedSuggestions: true,
    parameterHints: {
        enabled: true
    },
    suggest: {
        snippetsPreventQuickSuggestions: false
    }
  });


  if (!document.querySelector('.editor-tab.active')) {
    tabElement.classList.add('active');
    tabHeader.classList.add('active');
  }
}

addTabButton.addEventListener('click', () => {
  createEditorTab('untitled.vb','');
  
 
});


window.onload = function() {
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
  require(['vs/editor/editor.main'], function() {
    createEditorTab('untitled.vb','Public Module Program\n\n Public Sub Main(args() As string)\n\n   \tConsole.WriteLine("Hello, World!")\n\n End Sub\n\nEnd Module');
  });
};
//save the editor content to a file
function saveEditorContent() {
  const editorContent = editor.getValue();
  const fileName = document.querySelector('.tab-header.active input').value;
  const fileExtension = fileName.split('.').pop();
  const fileType = fileExtension === 'vb' ? 'vb' : 'txt';
  const blob = new Blob([editorContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}

// Add this near your other global variables
const resultContainer = document.querySelector('.editor-container2');

// Add this function to handle compilation
async function compileWithJDoodle() {
    resultContainer.innerHTML = '<div class="result-message">Compiling...</div>';
    
    try {
        const response = await fetch('http://localhost:3000/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: editor.getValue()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Simplified output - only shows the program output
        resultContainer.innerHTML = `<div class="compilation-results">
            <div class="output">${result.output || 'No output'}</div>
        </div>`;

    } catch (error) {
        resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        
    }
}

// Add a compile button to the menu bar
function addCompileButton() {
    const menuRight = document.querySelector('.menu-right');
    const compileButton = document.createElement('button');
    compileButton.className = 'compile-button';
    compileButton.textContent = 'Compile & Run';
    compileButton.addEventListener('click', compileWithJDoodle);
    menuRight.appendChild(compileButton);
}

// Add this to your window.onload function
window.onload = function() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        createEditorTab('untitled.vb','Public Module Program\n\n Public Sub Main(args() As string)\n\n   \tConsole.WriteLine("Hello, World!")\n\n End Sub\n\nEnd Module');
        addCompileButton();
    });
};
