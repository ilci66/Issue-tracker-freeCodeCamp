'use strict';
const mongoose = require("mongoose");
const {Issue} = require("../models.js");
const {Project} = require("../models.js")


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let { project } = req.params;
      //console.log(req.params.open)
      let {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.query;
      let foundIssues = []

      if(open != undefined || _id != undefined|| issue_title != undefined|| issue_text != undefined|| created_by != undefined|| assigned_to != undefined|| status_text != undefined){
        Project.findOne({name: project}, (err, data) => {
          foundIssues = data.issues;
          if(open != undefined){
            foundIssues = foundIssues.filter(ele => open.toString() == ele.open.toString())
          }
          if(_id != undefined){
            foundIssues = foundIssues.filter(ele => _id == ele._id)
          }
          if(issue_title != undefined){
            foundIssues = foundIssues.filter(ele => issue_title == ele.issue_title)
          }
          if(issue_text != undefined){
            foundIssues = foundIssues.filter(ele => issue_text == ele.issue_text)
          }
          if(created_by != undefined){
            foundIssues = foundIssues.filter(ele => created_by == ele.created_by)
          }
          if(assigned_to != undefined){
            foundIssues = foundIssues.filter(ele => assigned_to == ele.assigned_to)
          }
          if(status_text != undefined){
            foundIssues = foundIssues.filter(ele => status_text == ele.status_text)
          }
        res.json(foundIssues)
        })
      }else{
        Project.findOne({name: project}, (err, data) => {
          res.json(data.issues)
        })
      }
//open doesn't work when it's a boolean, no idea why, tried many different approaches
      // Project.aggregate([
      //   {$match: { name: project } },
      //   {$unwind: "$issues" },
      //   _id != undefined
      //   ? {$match :{"issues._id":ObjectId(_id)}}
      //   : {$match: {} },
      //   open !=undefined
      //   ? {$match: {"issues.open"$eq:{open}}} 
      //   : {$match: {} },
      //   issue_title != undefined
      //   ? {$match: {"issues.issue_title": issue_title}}
      //   : {$match: {} },
      //   created_by != undefined
      //   ? {$match: {"issues.created_by": created_by}}
      //   : {$match: {} },
      //   assigned_to != undefined
      //   ? {$match: {"issues.assigned_to": assigned_to}}
      //   : {$match: {} },
      //   status_text != undefined
      //   ? {$match: {"issues.status_text": status_text}}
      //   : {$match: {} },
      // ]).exec((err, data) => {
      //   console.log(data.status_text)
      //     let mappedData = []
      //     data.issues.map(ele => mappedData.push(ele))
      //     res.json(mappedData);
      // })
    })

    .post(function (req, res){
      let project = req.params.project;
      const {
        assigned_to,
        status_text,
        issue_title,
        issue_text,
        created_by,
      } = req.body;
// if(issue_title==""||issue_text==""||created_by=="")
      if(!issue_title||!issue_text||!created_by){
        res.send({ error: 'required field(s) missing' })
      };

    //create an issue, don't forget to add dates(create and update)
      let newIssue = new Issue({
        assigned_to: assigned_to || "",
        status_text: status_text || "",
        open:true,
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_by: created_by || "",
        created_on: new Date(),
        updated_on: new Date()
      })

    //find the project in your db, if there isn't one make one
    //and push the new issue you created there
    //responses in both scenarios will be the new issue you created
    //I could me findOneAndUpdate work but this seemed more concise 
      Project.findOne({name: project}, (err, data) => {
        if(!data){
          let newProject = new Project({name: project});
          newProject.issues.push(newIssue)
        //don't forget to handle save error
          newProject.save((err, data) => {
            if(!data||err){
              res.send("an error occured saving the post")
            }else{
              res.json(newIssue)
            }
          })
        }else{
          data.issues.push(newIssue)
          data.save((err, savedData) => {
            if(err||!savedData){
              res.send("an error occured saving the post")
            }else{
              res.send(newIssue)
            }
          })
        }
      })

    })
    
    .put(function (req, res){
      let project = req.params.project;
      let {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
      console.log(open)
      res.json("this be put")
      //find the issue by id inside given project first 
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      res.json("delete")
    });
    
};
