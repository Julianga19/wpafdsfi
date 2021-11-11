const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // the routes are defined here
  router.get('/users/:user/:pass', function (req, res, next) {    
    db.query(
      'SELECT isAdmin FROM users WHERE username =? and password = ?',
      [req.params.user, req.params.pass],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;