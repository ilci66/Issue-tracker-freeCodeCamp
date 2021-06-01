'use strict';
const mongoose = require("mongoose");
const {Issue} = require("../models.js");
const {Project} = require("../models.js")
//necerssary for selecting id don't forget
const { ObjectId } = mongoose.Types

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

      // if(open != undefined || _id != undefined|| issue_title != undefined|| issue_text != undefined|| created_by != undefined|| assigned_to != undefined|| status_text != undefined){
      //   Project.findOne({name: project}, (err, data) => {
      //     foundIssues = data.issues;
      //     if(open != undefined){
      //       foundIssues = foundIssues.filter(ele => open == ele.open.toString())
      //     }
      //     if(_id != undefined){
      //       foundIssues = foundIssues.filter(ele => _id == ele._id)
      //     }
      //     if(issue_title != undefined){
      //       foundIssues = foundIssues.filter(ele => issue_title == ele.issue_title)
      //     }
      //     if(issue_text != undefined){
      //       foundIssues = foundIssues.filter(ele => issue_text == ele.issue_text)
      //     }
      //     if(created_by != undefined){
      //       foundIssues = foundIssues.filter(ele => created_by == ele.created_by)
      //     }
      //     if(assigned_to != undefined){
      //       foundIssues = foundIssues.filter(ele => assigned_to == ele.assigned_to)
      //     }
      //     if(status_text != undefined){
      //       foundIssues = foundIssues.filter(ele => status_text == ele.status_text)
      //     }
      //   res.json(foundIssues)
      //   })
      // }else{
      //   Project.findOne({name: project}, (err, data) => {
      //     res.json(data.issues)
      //   })
      // }
//open, from queries, comes as a string fix that first 
      // console.log(typeof open)
      if(open){
        if(open == "false"){ open = false }
        else if(open == "true"){ open = true }
      }
      // console.log(typeof open)

      Project.aggregate([
        {$match: { name: project } },
        {$unwind: "$issues" },
        _id != undefined
//it didn't slect the object id, did a google search, someone suggested using
//ObjectId() method, required by mongoose I guess, otherwise I keep getting errors 
        // ? {$match :{"issues._id":mongoose.Types.ObjectId(_id)}}
        ? {$match :{"issues._id":ObjectId(_id)}}
        : {$match: {} },
        open !=undefined
        ? {$match: {"issues.open":open}} 
        : {$match: {} },
        issue_title != undefined
        ? {$match: {"issues.issue_title": issue_title}}
        : {$match: {} },
        created_by != undefined
        ? {$match: {"issues.created_by": created_by}}
        : {$match: {} },
        assigned_to != undefined
        ? {$match: {"issues.assigned_to": assigned_to}}
        : {$match: {} },
        status_text != undefined
        ? {$match: {"issues.status_text": status_text}}
        : {$match: {} },
        issue_text != undefined
        ? {$match: {"issues.status_text": issue_text}}
        : {$match: {} },
      ]).exec((err, data) => {
        // console.log(data.status_text)
          let mappedData = []
          mappedData = data.map(ele => ele.issues)
          res.json(mappedData);
      })
      console.log(res)

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
//don't forget the "return" otherwise we're sending multiple headers
//and causing an error 
      if(!issue_title||!issue_text||!created_by){
        return res.send({ error: 'required field(s) missing' })
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

      // console.log(typeof open)
      if(open){
        if(open == "false"){ open = false }
        else if(open == "true"){ open = true }
      }
      // res.json("this be put")
      //find the issue by id inside given project first 
      if(!_id){
        res.json({ error: 'missing _id' })
        return;
      };
      // { error: 'could not update', '_id': _id }
      if(_id){
        if(!open & !issue_title & !issue_text & !created_by & !assigned_to & !status_text){
          res.json({ error: 'no update field(s) sent', '_id': _id })
          return;
        } else{
          //if you use find you gonna get an array even if result's just one object
          Project.findOne({name: project}, (err, data) => {
            if(err || !data){
              res.json({ error: 'could not update', '_id': _id })
              return;
            }else if(data != undefined){
              // console.log(data.issues)
//Instead of the long code I wrote, I can just use this .id() I saw this on some guide
//it matches inside the array, so clean 
              let issueToUpdate = data.issues.id(_id);
              if(!issueToUpdate){
                res.json({ error: 'could not update', '_id': _id })
                return;
              }else{
                if(issue_title){issueToUpdate.issue_title = issue_title}
                if(issue_text){issueToUpdate.issue_text = issue_text}
                if(created_by){issueToUpdate.created_by = created_by}
                if(assigned_to){issueToUpdate.assigned_to = assigned_to}
                if(status_text){issueToUpdate.status_text = status_text}
                if(issue_title){issueToUpdate.issue_title = issue_title}
                issueToUpdate.updated_on =  new Date()
                if(open){issueToUpdate.open = open}
                data.save((err, data) => {
                  if(err || !data){
                    res.json({ error: 'could not update', '_id': _id })
                    return; 
                  }else{
                    res.json({  result: 'successfully updated', '_id': _id })
                    return;
                  }
                })
              }
              // res.json(issueToUpdate)
            }
          })
        }
        
      }
      // {  result: 'successfully updated', '_id': _id }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
//If no _id is sent, the return value is { error: 'missing _id' }.
// On success, the return value is { result: 'successfully deleted', '_id': _id }.
// On failure, the return value is { error: 'could not delete', '_id': _id }.
      const {_id} = req.body;
      if(!_id){
        res.json({ error: 'missing _id' });
        return;
      }
      Project.findOne({name:project}, (err, data) => {
        if(err || !data){
          res.json({ error: 'could not delete', '_id': _id })
          return;
        }else{
          let issueToRemove = data.issues.id(_id);
          // res.json(issueToRemove)
          if(!issueToRemove){
            res.json({ error: 'could not delete', '_id': _id })
            return;
          }
          console.log(issueToRemove)
          issueToRemove.remove();
          data.save((err, newData) => {
            if(err){
              res.json({ error: 'could not delete', '_id': _id })
              return;
            }else{
              res.json({ result: 'successfully deleted', '_id': _id })
              return;
            }
          })
        }
      })
      // res.json("delete")
    });
    
};
