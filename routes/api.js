'use strict';
const mongoose = require("mongoose");
const {Issue} = require("../models.js");
const {Project} = require("../models.js")


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const {
        issue_title,
        issue_text,
        creted_by,
        assigned_to,
        status_test
      } = req.body;
      // if(issue_title==""||issue_text==""||created_by=="")
      if(!issue_title||!issue_text||!created_by){
        res.send({ error: 'required field(s) missing' })
      };

    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
