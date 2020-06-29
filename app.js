console.log('APP');

let nButtonsCard = 0;

const oCard = {
  id: 1,
  nome: 'Daniele'
};

const showInfo = (object) => {
  //console.log('OK');
  const infoContainer = document.querySelector('#info-container');
  infoContainer.style.display = 'flex';
  const infoContent = document.querySelector('#info-content');
  infoContent.innerHTML = '';
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const element = object[key];
      console.log(element);
      const div = document.createElement('DIV');
      div.innerHTML = `${key}: ${element}`;
      infoContent.appendChild(div);
    }
  }
};

const infoContainer = document.querySelector('#info-container');
infoContainer.addEventListener('click', (e) => {
  e.stopPropagation();
  infoContainer.style.display = 'none';
});

const textarea = document.querySelector('#textarea-descr');
textarea.addEventListener('click', (e) => {
  e.stopPropagation();
  textarea.style.backgroundColor = 'yellow';
});

const buttonDescription = document.querySelector('#btn-desc');
buttonDescription.addEventListener('click', (e) => {
  e.stopPropagation();
  buttonDescription.style.backgroundColor = 'yellow';
});

const setEventToCards = () => {
  const draggables = document.querySelectorAll('.draggable');
  nButtonsCard = draggables.length;
  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });

    draggable.addEventListener('click', (e) => {
      e.stopPropagation();
      showInfo(oCard);
      console.log('CARD CLICKED');
    });
  });
};
setEventToCards();

/*
 * Ogni volta che viene trascinato un elemento draggable su un contenitore
 * alla funzione 'getDragAfterElement' viene passato:
 * --- l'elemento contenitore
 * --- la posizione in verticale del mouse all'interno del contenitore
 */
const setEventToLists = () => {
  const lists = document.querySelectorAll('.list-cards');
  lists.forEach((list) => {
    list.addEventListener('dragover', (e) => {
      console.clear();
      e.preventDefault();
      const afterElement = getDragAfterElement(list, e.clientY);
      const draggable = document.querySelector('.dragging');
      if (afterElement == null) {
        list.appendChild(draggable);
        console.log('NUULLL');
      } else {
        list.insertBefore(draggable, afterElement);
      }
    });
  });
};
setEventToLists();

/*
 * [a] Ottiene un array di tutti gli elementi gia presenti nell'elemento list
 * Col metodo reduce controlla se
 * il valore della posizione del mouse
 * per ogni elemento presente gia in list
 */
function getDragAfterElement(list, y) {
  const draggableElements = [
    ...list.querySelectorAll('.draggable:not(.dragging)')
  ]; // [a]
  console.log(draggableElements);
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

const onClickCardTextarea = (e) => {
  e.stopPropagation();
  const textarea = e.target;
  textarea.style.backgroundColor = 'pink';
};

const onClickBtnSaveCard = (e) => {
  e.stopPropagation();
  const button = e.target;
  button.classList.replace('btn-save-card', 'btn-add-card');
  button.innerHTML = 'Add Card';
  const textarea = document.querySelector('.card-textarea');
  const cardValue = textarea.value;
  console.log('card Value ', cardValue);

  const cardList = button.parentNode.children[1];
  const lastCard = cardList.lastElementChild;
  // console.log('lastCard', lastCard);
  lastCard.classList.replace('card-new', 'draggable');
  lastCard.draggable = true;
  button.addEventListener('click', onClickButtonAddCard);
  setEventToCards();
  setEventToLists();
};

const onClickButtonAddCard = (e) => {
  e.stopPropagation();
  const button = e.target;
  button.removeEventListener('click', onClickButtonAddCard, false);
  button.classList.replace('btn-add-card', 'btn-save-card');
  button.innerHTML = 'Save Card';

  const cardList = e.target.parentNode.children[1];
  const card = document.createElement('DIV');
  card.classList.add('card-new');

  const paragraph = document.createElement('DIV');
  nButtonsCard++;
  paragraph.innerHTML = nButtonsCard;
  card.appendChild(paragraph);

  const textarea = document.createElement('TEXTAREA');
  textarea.classList.add('card-textarea');
  textarea.addEventListener('click', onClickCardTextarea);
  textarea.value = nButtonsCard;
  card.appendChild(textarea);
  cardList.appendChild(card);

  button.addEventListener('click', onClickBtnSaveCard);
};

/// Seleziona tutti i bottoni che aggiungono le card
const selectAllButtonsAddCard = () => {
  const buttonsAddCard = document.querySelectorAll('.btn-add-card');
  buttonsAddCard.forEach((button) => {
    button.addEventListener('click', onClickButtonAddCard);
  });
};
selectAllButtonsAddCard();

/// Campo input, eventi click/input
const setEventToInput = () => {
  const input = document.querySelector('INPUT');

  input.addEventListener('click', (e) => {
    console.log('Clicked INPUT CLICK');
    e.stopPropagation();
  });

  input.addEventListener('input', (e) => {
    e.stopPropagation();
  });
};

/// al click sul bottone che setta il titolo alla lista
const setEventToButtonListTitle = () => {
  const btnAddListTitle = document.querySelector('#btn-add-list-title');
  btnAddListTitle.addEventListener('click', (e) => {
    e.stopPropagation();
    const input = document.querySelector('INPUT');
    const inputText = input.value;

    if (!inputText) {
      return;
    }
    const list = input.parentNode;

    input.remove();
    const button = document.querySelector('#btn-add-list-title');
    button.remove();

    console.log('LIST', list);
    list.classList.remove('list-new');

    const title = document.createElement('P');
    title.classList.add('list-title');
    title.innerHTML = inputText;
    list.appendChild(title);

    const cardList = document.createElement('DIV');
    cardList.classList.add('list-cards');
    list.appendChild(cardList);

    const btnAddCard = document.createElement('BUTTON');
    btnAddCard.classList.add('btn-add-card');
    btnAddCard.innerHTML = 'Add Card 1';
    list.appendChild(btnAddCard);

    /// <Ricreare-il-bottone-per-aggiungere-una-nuova-lista>
    const row = document.querySelector('.row');
    const nextList = document.createElement('DIV');
    nextList.classList.add('col', 'list', 'list-add');
    row.appendChild(nextList);

    const btnAddList = document.createElement('BUTTON');
    btnAddList.id = 'btn-add-list';
    btnAddList.innerHTML = 'Add List';
    nextList.appendChild(btnAddList);
    onClickBtnAddList();
    /// <Ricreare-il-bottone-per-aggiungere-una-nuova-lista>
    btnAddCard.addEventListener('click', onClickButtonAddCard);
    // onClickButtonAddCard(btnAddCard)
  });
};

const onClickBtnAddList = () => {
  const buttonAddList = document.querySelector('#btn-add-list');
  buttonAddList.addEventListener('click', (e) => {
    const buttonAddList = e.target;
    const list = buttonAddList.parentNode;
    list.classList.remove('list-add');
    list.classList.add('list-new');
    buttonAddList.remove();

    const input = document.createElement('INPUT');
    input.id = 'input-add-list-title';
    list.appendChild(input);
    input.focus();
    setEventToInput();

    const button = document.createElement('BUTTON');
    button.id = 'btn-add-list-title';
    button.innerHTML = 'aggiungi testo';
    list.appendChild(button);
    setEventToButtonListTitle();

    setEventToLists();
    e.stopPropagation();
  });
};
onClickBtnAddList();

/// click al di fuori di ogni elemento interattivo
document.addEventListener('click', function (e) {
  const button = document.querySelector('#btn-add-list-title');
  const btnSaveCard = document.querySelector('.btn-save-card'); // 'btn-save-card'
  if (button) {
    const list = button.parentNode;
    list.classList.replace('list-new', 'list-add');

    const input = document.querySelector('#input-add-list-title');
    button.remove();
    input.remove();

    const buttonAddList = document.createElement('BUTTON');
    buttonAddList.id = 'btn-add-list';
    buttonAddList.innerHTML = 'Add List';
    list.appendChild(buttonAddList);
    onClickBtnAddList();
  }
  if (btnSaveCard) {
    btnSaveCard.classList.replace('btn-save-card', 'btn-add-card');
    btnSaveCard.addEventListener('click', onClickButtonAddCard);
    btnSaveCard.innerHTML = 'Add Card';
    const cardList = btnSaveCard.parentNode.children[1];
    const lastCard = cardList.lastElementChild;
    console.log('lastCard', lastCard);
    lastCard.remove();
  }

  console.log('Clicked OUT');
});
