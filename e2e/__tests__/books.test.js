const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('books api', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('books'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const book = {
    title: 'americanah',
    author: 'chimamanda ngozi adichie'
  };

  function postBook(book) {
    return request
      .post('/api/books')
      .set('Authorization', user.token)
      .send(book)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a book', () => {
    return request
      .post('/api/books')
      .set('Authorization', user.token)
      .send(book)
      .expect(200)
      .then(({ body }) => {
        expect(body.owner).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            owner: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "author": "chimamanda ngozi adichie",
            "owner": Any<String>,
            "title": "americanah",
          }
        `
        );
      });
  });

  it('gets all of the books', () => {
    return Promise.all([
      postBook(book),
      postBook(book),
      postBook(book)
    ])
      .then(() => {
        return request
          .get('/api/books')
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0].owner).toBe(user._id);
      });
  });

  it('updates a book', () => {
    return postBook(book)
      .then(book => {
        book.author = 'abbey m';
        return request
          .put(`/api/books/${book._id}`)
          .send(book)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.author).toBe('abbey m');
        expect(body.owner).toBe(user._id);
      });
  });

  it('deletes a book', () => {
    return postBook(book)
      .then(book => {
        return request
          .delete(`/api/books/${book._id}`)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(() => {
        return request
          .get('/api/books')
          .set('Authorization', user.token)
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(0);
          });
      });
  });

});
