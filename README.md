# LAB - 14

## User Authorization

### Author: Abbey Masters

### Links and Resources
* [submission PR](https://github.com/abbeymasters-401-advanced-javascript/lab-13/pull/1)
* [travis](https://travis-ci.com/abbeymasters-401-advanced-javascript/lab-13/builds/130851141)
* [heroku]()

#### Running the app

**Describe what npm scripts do**
*   "lint": "eslint .",
*   "pretest": "npm run lint",
*   "jest": "jest --runInBand --verbose",
*   "test": "npm run jest",
*   "test:coverage": "npm run test -- --coverage",
*   "test:watch": "npm run jest -- --watchAll",
*   "test:verbose": "npm run test -- --verbose",
*   "start": "node server.js",
*   "start:watch": "nodemon server.js",
*   "make:admin": "node lib/scripts/make-admin.js"