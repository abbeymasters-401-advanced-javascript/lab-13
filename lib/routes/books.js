const router = require('express').Router();
const Book = require('../models/book');

router

  .get('/', (req, res, next) => {
    Book.find()
      .lean()
      .then(book => res.json(book))
      .catch(next);
  })

  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;

    Book.create(req.body)
      .then(book => res.json(book))
      .catch(next);
  })

  .put('/:id', ({ params, body, user }, res, next) => {
    Book.updateOne({
      _id: params.id,
      owner: user.id
    }, body)
      .then(book => res.json(book))
      .catch(next);
  })

  .delete('/:id', ({ params, user }, res, next) => {
    Book.findOneAndRemove({
      _id: params.id,
      owner: user.id
    })
      .then(book => res.json(book))
      .catch(next);
  });

module.exports = router;
