const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

let activeNote = {};

const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

const saveNote = note => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

const deleteNote = id => {
  return $.ajax({
    url: `api/notes/${id}`,
    method: "DELETE"
  });
};

const renderActiveNote = () => {
  $saveNoteBtn.hide();
  console.log("===========activeNote============");
  console.log(activeNote);
  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote).then(data => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteDelete = function(event) {
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = function(event) {
  activeNote = $(this).data();
  renderActiveNote();
};

const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

const renderNoteList = notes => {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      `<i class='fas fa-trash-alt float-right text-danger delete-note' data-id='${note.id}'>`
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

const getAndRenderNotes = () => {
  return getNotes().then(data => {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

getAndRenderNotes();
