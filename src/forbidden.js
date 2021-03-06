const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // the routes are defined here
  router.post('/forbidden', (req, res, next) => {              
    db.query(
      'INSERT INTO forbidden (NUMBER) VALUES (?)',
      [req.body.number],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });


  router.delete('/forbidden/:number', function (req, res, next) {
    db.query(
      'DELETE FROM forbidden WHERE number=?',
      [req.params.number],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });
  
  router.get('/forbidden', function (req, res, next) {
    db.query(
      'SELECT number FROM forbidden',
      [owner, 10*(req.params.page || 0)],
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