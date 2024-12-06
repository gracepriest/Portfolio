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
    automaticLayout: true
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