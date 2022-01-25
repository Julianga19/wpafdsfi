const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // the routes are defined here
  router.get('/users/:user/:pass', function (req, res, next) {    
    db.query(
      'SELECT isAdmin, isSupervisor FROM users WHERE username =? and password = ? and isDeleted != 1',
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

  router.get('/usersAll', function (req, res, next) {
    db.query(
      'SELECT * FROM users where isDeleted = 0',
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
  router.post('/users', (req, res, next) => {              
    db.query(
      'INSERT INTO users (username, password, isadmin, isSupervisor, isDeleted) VALUES (?, ?, ? , ?, ?)',
      [req.body.username,req.body.password,req.body.isAdmin,req.body.isSupervisor, 0 ],
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

  router.put('/users/:username', function (req, res, next) {
    db.query(
      'UPDATE users set isDeleted=1 WHERE username=?',
      [req.params.username],
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