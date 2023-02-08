const notesRouter = require('express').Router();
const Note = require('../models/note');

// get note
notesRouter.get('/', async (_request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

// get note by id
notesRouter.get('/:id', async (request, response, next) => {
  //
  const note = await Note.findById(request.params.id);

  if (note) response.json(note);
  else response.status(404).end();
});

// save new note
notesRouter.post('/', async (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    // date: new Date(),
  });

  if (body.content) {
    const savedNote = note.save();
    response.status(201).json(savedNote);
  } else response.status(400).end();
});

// delete note
notesRouter.delete('/:id', async (request, response, next) => {
  // try-catch block eliminated by using express-async-errors
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

// update note
notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => response.json(updatedNote))
    .catch((error) => next(error));
});

module.exports = notesRouter;
