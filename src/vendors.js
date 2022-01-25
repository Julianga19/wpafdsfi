const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // the routes are defined here
  
  router.get('/vendors', function (req, res, next) {
    db.query(
      'SELECT code FROM vendor where isDeleted = 0 ',
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

    // the routes are defined here
    router.post('/vendors', (req, res, next) => {              
      db.query(
        'INSERT INTO vendor (CODE, ISDELETED) VALUES (?, ?)',
        [req.body.code, 0],
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

    router.put('/vendors/:code', function (req, res, next) {
      db.query(
        'UPDATE vendor set isDeleted=1 WHERE code=?',
        [req.params.code],
        (error) => {
          if (error) {
            res.status(500).json({status: 'error'});
          } else {
            res.status(200).json({status: 'ok'});
          }
        }
      );
    });
  
  return router;
}

module.exports = createRouter;