const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('books api', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('books'));
  beforeEach(() => db.dropCollection('favorites'));

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

  function putBook(book) {
    return postBook(book)
      .then(book => {
        return request
          .put(`/api/me/favorites/${book._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(({ body }) => body);
      });
  }

  it('posts favorites', () => {
    return postBook(book)
      .then(book => {
        return request
          .put(`/api/me/favorites/${book._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(1);
            expect(body[0]).toBe(book._id);
          });
      });
  });

  it('gets all favorites', () => {
    return Promise.all([
      putBook(book),
      putBook(book),
      putBook(book)
    ])
      .then(() => {
        return request
          .get('/api/me/favorites')
          .set('Authorization', user.token)
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(3);
          });
      });
  });

  it('deletes a favorite', () => {
    return putBook(book)
      .then(favorites => {
        console.log(favorites);
        return request
          .delete(`/api/me/favorites/${favorites[0]}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.length).toBe(0);
          });
      });
  });
});