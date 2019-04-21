/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const issues = require('../controllers/issues');

module.exports = function(app) {
  app
    .route('/api/issues/:project')
    .get(function(req, res) {
      const project = req.params.project;
      const query = req.query;
      issues
        .find(project, query)
        .then(issues => issues.toArray())
        .then(arr => res.json(arr))
        .catch(error => res.json({ error: error.message }));
    })
    .post(function(req, res) {
      const project = req.params.project;
      issues
        .create(project, req.body)
        .then(result => res.json(result))
        .catch(error => res.json({ error: error.message }));
    })
    .put(function(req, res) {
      const project = req.params.project;
      if (Object.keys(req.body).length === 0) {
        return res.send('no updated field sent');
      }
      issues
        .update(project, req.body)
        .then(result => {
          if (result.n > 0) {
            res.send('successfully updated');
          } else {
            res.send('could not update ' + req.body._id);
          }
        })
        .catch(() => res.send('could not update ' + req.body._id));
    })
    .delete(function(req, res) {
      const project = req.params.project;
      if (!req.body._id) {
        return res.send('_id error');
      }
      issues
        .deleteById(project, req.body._id)
        .then(result => {
          if (result.value) {
            res.status(200).send('deleted ' + result.value._id);
          } else {
            res.send('could not delete ' + req.body._id);
          }
        })
        .catch(() => res.send('could not delete ' + req.body._id));
    });
};
