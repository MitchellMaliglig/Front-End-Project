'use strict';
const defaultImage = 'images/placeholder.jpg';
const $randomImage = document.querySelector('img.random');
if (!$randomImage) throw new Error('$randomImage missing');
const $generateAnchor = document.querySelector('a#generate');
if (!$generateAnchor) throw new Error('$generateAnchor missing');
const $saveAnchor = document.querySelector('a#save');
if (!$saveAnchor) throw new Error('$saveAnchor missing');
const $message = document.querySelector('p.message');
if (!$message) throw new Error('$message missing');
const $saveNopeAnchor = document.querySelector('a#save-nope');
if (!$saveNopeAnchor) throw new Error('$saveNopeAnchor missing');
const $saveYesAnchor = document.querySelector('a#save-yes');
if (!$saveYesAnchor) throw new Error('$saveYesAnchor');
const $foxesAnchor = document.querySelector('a.foxes');
if (!$foxesAnchor) throw new Error('$foxesAnchor missing');
const $newAnchor = document.querySelector('a#new');
if (!$newAnchor) throw new Error('$newAnchor missing');
const $saveEditAnchor = document.querySelector('a#save-edit');
if (!$saveEditAnchor) throw new Error('$saveEditAnchor missing');
const $deleteAnchor = document.querySelector('a#delete-fox');
if (!$deleteAnchor) throw new Error('$deleteAnchor missing');
const $deleteNopeAnchor = document.querySelector('a#delete-nope');
if (!$deleteNopeAnchor) throw new Error('$deleteNopeAnchor missing');
const $deleteYesAnchor = document.querySelector('a#delete-yes');
if (!$deleteYesAnchor) throw new Error('$deleteYesAnchor missing');
const $saveDialog = document.querySelector('dialog.save-dialog');
if (!$saveDialog) throw new Error('$saveDialog missing');
const $deleteDialog = document.querySelector('dialog.delete-dialog');
if (!$deleteDialog) throw new Error('$deleteDialog missing');
const $saveForm = document.querySelector('form.save-form');
if (!$saveForm) throw new Error('$saveForm missing');
const $generateFoxDiv = document.querySelector('div[data-view="generate-fox"]');
if (!$generateFoxDiv) throw new Error('$generateFoxDiv missing');
const $viewFoxDiv = document.querySelector('div[data-view="view-fox"]');
if (!$viewFoxDiv) throw new Error('$viewFoxDiv missing');
const $editFoxDiv = document.querySelector('div[data-view="edit-fox"');
if (!$editFoxDiv) throw new Error('$editFoxDiv missing');
const $ul = document.querySelector('ul');
if (!$ul) throw new Error('$ul missing');
const $noFoxesImage = document.querySelector('img#no-foxes');
if (!$noFoxesImage) throw new Error('$noFoxesImages missing');
const $saveRequiredText = document.querySelector('p#save-required-text');
if (!$saveRequiredText) throw new Error('$saveRequiredText missing');
const $saveRequiredImage = document.querySelector('p#save-required-image');
if (!$saveRequiredImage) throw new Error('$saveRequiredImage missing');
const $editImage = document.querySelector('img.edit');
if (!$editImage) throw new Error('$editImage missing');
const $editForm = document.querySelector('form.edit-form');
if (!$editForm) throw new Error('$editForm missing');
const $editRequired = document.querySelector('#edit-required-text');
if (!$editRequired) throw new Error('$editRequired missing');
const dataViews = {
  map: new Map(
    Object.entries({
      'generate-fox': $generateFoxDiv,
      'view-fox': $viewFoxDiv,
      'edit-fox': $editFoxDiv,
    }),
  ),
};
function swapViews(view) {
  if (dataViews.map.has(view)) {
    dataViews.map.forEach(function (v) {
      if (v.getAttribute('data-view') === view) {
        v.className = 'show';
      } else {
        v.className = 'hidden';
      }
    });
  }
  data.editingId = -1;
}
function resetDefaultImage() {
  $randomImage.src = defaultImage;
}
function renderFox(id) {
  const $li = document.createElement('li');
  $li.setAttribute('data-fox-id', id.toString());
  const $row = document.createElement('div');
  $row.setAttribute('class', 'row');
  const $imageHalf = document.createElement('div');
  $imageHalf.setAttribute('class', 'column-half');
  const $img = document.createElement('img');
  $img.src = data.foxes.get(id)?.photo;
  const $textHalf = document.createElement('div');
  $textHalf.setAttribute('class', 'column-half');
  const $h3 = document.createElement('h3');
  $h3.textContent = data.foxes.get(id)?.title;
  const $pencilIcon = document.createElement('i');
  $pencilIcon.setAttribute('class', 'fa-solid fa-pencil');
  const $p = document.createElement('p');
  $p.textContent = data.foxes.get(id)?.notes;
  $li.append($row);
  $imageHalf.append($img);
  $h3.append($pencilIcon);
  $textHalf.append($h3, $p);
  $row.append($imageHalf, $textHalf);
  return $li;
}
function toggleNoFoxes() {
  if (data.foxes.size > 0) {
    $noFoxesImage.className = 'hidden';
  } else {
    $noFoxesImage.className = 'show';
  }
}
$generateAnchor.addEventListener('click', async function () {
  const img = await fetchFox();
  if (img != null) {
    $randomImage.src = img;
    $message.textContent = getMessage();
  }
});
$saveAnchor.addEventListener('click', function () {
  $saveDialog.showModal();
});
$saveNopeAnchor.addEventListener('click', function () {
  $saveRequiredText.className = 'hidden';
  $saveRequiredImage.className = 'hidden';
  $saveForm.reset();
  $saveDialog.close();
});
$saveYesAnchor.addEventListener('click', function () {
  const $formElements = $saveForm.elements;
  if ($randomImage.src.includes(defaultImage)) {
    $saveRequiredImage.className = 'show';
  } else if (!$formElements.title.value || !$formElements.notes.value) {
    $saveRequiredText.className = 'show';
  } else {
    const foxData = {
      title: $formElements.title.value,
      notes: $formElements.notes.value,
      photo: $randomImage.src,
    };
    data.foxes.set(data.nextId, foxData);
    $ul.prepend(renderFox(data.nextId));
    data.nextId++;
    writeData();
    toggleNoFoxes();
    resetDefaultImage();
    $message.textContent = getSaved();
    $saveRequiredText.className = 'hidden';
    $saveRequiredImage.className = 'hidden';
    $saveForm.reset();
    $saveDialog.close();
  }
});
$foxesAnchor.addEventListener('click', function () {
  swapViews('view-fox');
});
$newAnchor.addEventListener('click', function () {
  swapViews('generate-fox');
});
document.addEventListener('DOMContentLoaded', function () {
  for (const id of Array.from(data.foxes.keys())) {
    $ul.prepend(renderFox(id));
  }
  toggleNoFoxes();
});
$ul.addEventListener('click', function (event) {
  const $eventTarget = event.target;
  const $formElements = $editForm.elements;
  $editRequired.className = 'hidden';
  if ($eventTarget.tagName === 'I') {
    swapViews('edit-fox');
    const $li = $eventTarget.closest('li');
    data.editingId = Number($li.getAttribute('data-fox-id'));
    const fox = data.foxes.get(data.editingId);
    $editImage.src = fox.photo;
    $formElements.title.value = fox.title;
    $formElements.notes.value = fox.notes;
  }
});
$saveEditAnchor.addEventListener('click', function () {
  const $formElements = $editForm.elements;
  if (!$formElements.title.value || !$formElements.notes.value) {
    $editRequired.className = 'show';
  } else {
    const fox = {
      title: $formElements.title.value,
      notes: $formElements.notes.value,
      photo: $editImage.src,
    };
    data.foxes.set(data.editingId, fox);
    const $li = document.querySelector(`li[data-fox-id="${data.editingId}"]`);
    $ul.insertBefore(renderFox(data.editingId), $li);
    $li.remove();
    $editForm.reset();
    writeData();
    swapViews('view-fox');
  }
});
$deleteAnchor.addEventListener('click', function () {
  $deleteDialog.showModal();
});
$deleteNopeAnchor.addEventListener('click', function () {
  $deleteDialog.close();
});
$deleteYesAnchor.addEventListener('click', function () {
  data.foxes.delete(data.editingId);
  const $li = document.querySelector(`li[data-fox-id="${data.editingId}"]`);
  $li.remove();
  writeData();
  toggleNoFoxes();
  swapViews('view-fox');
  $deleteDialog.close();
});
