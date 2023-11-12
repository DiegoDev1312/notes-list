const addNoteButton = document.querySelector('[data-add-note]');
const sectionNote = document.querySelector('[data-section-note]');
const modalNoteArea = document.querySelector('[data-modal-note]');
const closeModalButton = document.querySelector('[data-close-modal-button]');
const saveNoteButton = document.querySelector('[data-save-note]');
const allInputsNote = document.querySelectorAll('[data-input-note]');
const switchButton = document.querySelector('[data-switch-button]');
const documentBody = document.querySelector('body');
const themeIcon = documentBody.querySelector('[data-theme-icon]');

function initNotes() {
    const userNotes = JSON.parse(localStorage.getItem('@note_value')) || [];
    const themeSite = JSON.parse(localStorage.getItem('@note_site_theme')) || { theme: 'light' };
    documentBody.classList.add(themeSite.theme === 'light' ? 'theme-light' : 'theme-dark');
    themeIcon.setAttribute('src', themeSite.theme === 'light'
        ? 'assets/images/moon-icon.svg' : 'assets/images/sun-icon.svg' );

    for (note of userNotes) {
        let noteTitle = document.createElement('h1');
        let noteDescription = document.createElement('p');
        noteTitle.setAttribute('contenteditable', 'true');
        noteTitle.innerHTML = note.title;
        noteDescription.innerHTML = note.description;
    
        createNewNote(
            noteTitle,
            noteDescription,
            note.backgroundNote,
            note.textColor,
            note.id
        );
    }
}

function handleSwitchPress() {
    const coditionChangeTheme = documentBody.classList.contains('theme-light');
    if (coditionChangeTheme) {
        documentBody.classList.replace('theme-light', 'theme-dark');
        themeIcon.setAttribute('src', 'assets/images/sun-icon.svg');
        localStorage.setItem('@note_site_theme', JSON.stringify({ theme: 'dark' }));
    } else {
        documentBody.classList.replace('theme-dark', 'theme-light');
        themeIcon.setAttribute('src', 'assets/images/moon-icon.svg');
        localStorage.setItem('@note_site_theme', JSON.stringify({ theme: 'light' }));
    }
}

function openModal(event, idNote) {
    modalNoteArea.style.display = 'flex';
    const allNotes = document.querySelectorAll('.note-area');

    for (note of allNotes) {
        if (String(idNote) === note.attributes['data-note-id'].value) {
            console.log(note);
        }
    }
}

function closeModal() {
    modalNoteArea.style.display = 'none';
}

function createNewNote(
    noteTitle,
    noteDescription,
    backgroundNote,
    textColor,
    idItem,
) {
    const headerTextArea = document.createElement('div');
    const newNoteBlock = document.createElement('div');
    const createBin = document.createElement('button');
    const binIcon = document.createElement('img');
    for (const input of allInputsNote) {
        input.value = '';
    }
    
    binIcon.setAttribute('src', 'assets/images/bin-icon.svg');
    createBin.appendChild(binIcon);
    createBin.addEventListener('click', (event) => handleDeletePress(event, idItem));

    headerTextArea.classList.add('header-note-area');
    headerTextArea.appendChild(noteTitle);
    headerTextArea.appendChild(createBin);

    newNoteBlock.classList.add('note-area');
    // TODO futuramente adicionar função de editar.
    // newNoteBlock.addEventListener('click', (event) => openModal(event, idItem));
    newNoteBlock.appendChild(headerTextArea);
    newNoteBlock.appendChild(noteDescription);
    newNoteBlock.style.backgroundColor = backgroundNote;
    newNoteBlock.style.color = textColor;
    newNoteBlock.setAttribute('data-note-id', idItem);
    sectionNote.appendChild(newNoteBlock);
}

function handleDeletePress(event, idNote) {
    const userNotes = JSON.parse(localStorage.getItem('@note_value')) || [];
    const allNotes = document.querySelectorAll('.note-area');
    for (note of allNotes) {
        if (String(idNote) === note.attributes['data-note-id'].value) {
            sectionNote.removeChild(note);
        }
        const newListNotes = userNotes.filter((noteItem) => noteItem.id !== idNote);
        localStorage.setItem('@note_value', JSON.stringify(newListNotes));
    }
}

function handleSaveNote() {
    const userNotes = JSON.parse(localStorage.getItem('@note_value')) || [];
    let noteTitle = document.createElement('h1');
    let noteDescription = document.createElement('p');
    let backgroundNote;
    let textColor;

    for (const input of allInputsNote) {
        const inputTypeData = input.attributes['data-input-note'].value;
        if (inputTypeData === 'title') {
            noteTitle.innerHTML = input.value;
        } else if (inputTypeData === 'description') {
            noteDescription.innerHTML = input.value;
        } else if (inputTypeData === 'text-color') {
            textColor = input.value;
        } else {
            backgroundNote = input.value;
        }
    }

    if (!noteTitle.textContent) {
        return alert('Preencha o campo de título!');
    }
    if (!noteDescription.textContent) {
        return alert('Preencha o campo de descrição!');
    }
    if (textColor === backgroundNote) {
        return alert('Insira cores diferentes no campo de cores!');
    }

    const createJSON = {
            title: noteTitle.textContent,
            description: noteDescription.textContent,
            textColor,
            backgroundNote,
            id: userNotes.length + 1,
        };

    noteTitle.setAttribute('contenteditable', 'true');
    createNewNote(
        noteTitle,
        noteDescription,
        backgroundNote,
        textColor,
        userNotes.length + 1
    );
    const newListJSON = [...userNotes, createJSON];
    localStorage.setItem('@note_value', JSON.stringify(newListJSON));
    closeModal();
}

addNoteButton.addEventListener('click', (event) => openModal(event, null));
closeModalButton.addEventListener('click', closeModal);
saveNoteButton.addEventListener('click', handleSaveNote);
switchButton.addEventListener('click', handleSwitchPress);

initNotes();
