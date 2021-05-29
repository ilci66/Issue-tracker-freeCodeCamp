'use strict';
const mongoose = require("mongoose");
const {Issue} = require("../models.js");
const {Project} = require("../models.js")


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
//all the issues with this url /api/issues/{projectname}
//you need to be able to filter /api/issues/{project}?open=false
//with any given field and value, 

//make an array include the search criteria if it exists      

      let { project } = req.params;
      //console.log(req.params.open)
      const {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.query;

      // let queryToMatch = [{$match: {name: project}},{$unwind:"$issues"}];

      // if(_id != undefined){
      //   queryToMatch.push({"_id": _id})
      // }
      // if(open != undefined){
      //   console.log(open, "its")
      //   queryToMatch.push({"open": open})
      // }
      // if(issue_title != undefined){
      //   queryToMatch.push({"issue_title": issue_title})
      // }
      // if(issue_text != undefined){
      //   queryToMatch.push({"issue_text": issue_text})
      // }
      // if(created_by != undefined){
      //   queryToMatch.push({"created_by": created_by})
      // }
      // if(assigned_to != undefined){
      //   queryToMatch.push({"assigned_to": assigned_to})
      // }
      // if(status_text != undefined){
      //   queryToMatch.push({"status_text": status_text})
      // }
      // console.log(queryToMatch)
      // res.json("works")

      // Project.aggregate([$match:queryToMatch], (err, data) => {
      //   //console.log(data)
      //   res.json(data)
      // })

      // Project.findOne({name: project}, (err, data) => {
        //console.log(data)
        // res.json(data.issues.map(ele => ele))
      // })

      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;
// if(issue_title==""||issue_text==""||created_by=="")
      if(!issue_title||!issue_text||!created_by){
        res.send({ error: 'required field(s) missing' })
      };

    //create an issue, don't forget to add dates(create and update)
      let newIssue = new Issue({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open:true,
        status_text: status_text || "" 
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
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
