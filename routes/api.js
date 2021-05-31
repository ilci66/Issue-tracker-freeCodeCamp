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
        status_text,
      } = req.query;

//boolean value of open somehow messes it up, even though it returns 
//the given query result, somehow doesn't work for neither query nor 
//filtering after getting the data
//for loop looked awful
      Project.findOne({name:project}, (err, data) => {
        let foundIssues = data.issues;
        let responseArray = [];
        let arrayForFiltering = [];

        if(open != undefined){
          if(responseArray.length == 0){
            foundIssues.map(ele => {
              // console.log(ele.open.toString() == open.toString())
              if(ele.open.toString() == open.toString()){
                responseArray.push(ele)
              }
            })
          }else if(responseArray.length != 0){
            responseArray.map(ele => {
              if(ele.open.toString() == open.toString()){
                arrayForFiltering.push(ele)
              }
            })
            responseArray = arrayForFiltering;
          }
        }

        if(_id != undefined){
          if(responseArray.length == 0){
            foundIssues.map(ele => {
              if(ele._id == issue_tit_idle){
                responseArray.push(ele)
              }
            })
          }else if(responseArray.length != 0){
            responseArray.map(ele => {
              if(ele._id == _id){
                arrayForFiltering.push(ele)
              }
            })
            responseArray = arrayForFiltering;
          }
        }

        if(issue_title != undefined){
          if(responseArray.length == 0){
            foundIssues.map(ele => {
              if(ele.issue_title == issue_title){
                responseArray.push(ele)
              }
            })
          }else if(responseArray.length != 0){
            responseArray.map(ele => {
              if(ele.issue_title == issue_title){
                arrayForFiltering.push(ele)
              }
            })
            responseArray = arrayForFiltering;
          }
        }

        if(issue_text != undefined){
          if(responseArray.length == 0){
            foundIssues.map(ele => {
              if(ele.issue_text == issue_text){
                responseArray.push(ele)
              }
            })
          }else if(responseArray.length != 0){
            responseArray.map(ele => {
              if(ele.issue_text == issue_text){
                arrayForFiltering.push(ele)
              }
            })
            responseArray = arrayForFiltering;
          }
        }

        if(created_by != undefined){
          if(responseArray.length == 0){
            foundIssues.map(ele => {
              if(ele.created_by == created_by){
                responseArray.push(ele)
              }
            })
          }else if(responseArray.length != 0){
            responseArray.map(ele => {
              if(ele.created_by == created_by){
                arrayForFiltering.push(ele)
              }
            })
            responseArray = arrayForFiltering;
          }
        }
        if(assigned_to != undefined){
          if(responseArray.length == 0){
            foundIssues.map(ele => {
              if(ele.assigned_to == assigned_to){
                responseArray.push(ele)
              }
            })
          }else if(responseArray.length != 0){
            responseArray.map(ele => {
              if(ele.assigned_to == assigned_to){
                arrayForFiltering.push(ele)
              }
            })
            responseArray = arrayForFiltering;
          }
        }

        if(status_text != undefined){
          if(responseArray.length == 0){
            foundIssues.map(ele => {
              if(ele.status_text == status_text){
                responseArray.push(ele)
              }
            })
          }else if(responseArray.length != 0){
            responseArray.map(ele => {
              if(ele.status_text == status_text){
                arrayForFiltering.push(ele)
              }
            })
            responseArray = arrayForFiltering;
          }
        }
        let tempArray = []
        if(open != undefined || _id != undefined || issue_title != undefined ||issue_text != undefined || created_by != undefined || assigned_to != undefined || status_text != undefined){
          
          for(let i = 0; i < responseArray.length; i++){
            if(tempArray.indexOf(responseArray[i]) < 0){
              tempArray.push(responseArray[i])
            }
          }
          responseArray = tempArray
          res.json(responseArray)
        } else {
          res.json(data.issues)
        }
      })


//saw the exact code work in another video, the exact query
//when I add open=true (or any query really) returns an empty array

        
      // if(open != undefined) {
      //   open = open.toString();
      // }
      // let queryToMatch = [{$match: {name: project}},{$unwind:"$issues"}];

      // if(_id != undefined){
      //   queryToMatch.push({$match: {"_id": _id}})
      // }
      // if(open != undefined){
      //   queryToMatch.push({$match: {"open": open}})
      // }
      // if(issue_title != undefined){
      //   queryToMatch.push({$match:{"issue_title": issue_title}})
      // }
      // if(issue_text != undefined){
      //   queryToMatch.push({$match:{"issue_text": issue_text}})
      // }
      // if(created_by != undefined){
      //   queryToMatch.push({$match:{"created_by": created_by}})
      // }
      // if(assigned_to != undefined){
      //   queryToMatch.push({$match:{"assigned_to": assigned_to}})
      // }
      // if(status_text != undefined){
      //   queryToMatch.push({$match:{"status_text": status_text}})
      // }
      // console.log(queryToMatch)
      // // res.json("works")

      // Project.aggregate(queryToMatch, (err, data) => {
      //   //console.log(data)
      //   res.json(data)
      // })

      // Project.findOne({name: project}, (err, data) => {
        //console.log(data)
        // res.json(data.issues.map(ele => ele))
      // })

  //     saw this one on youtube too, 
  //     ran into the same issue 
  //     if(open){console.log("open")}
      
      // Project.aggregate([
      //   {$match: { name: project } },
      //   {$unwind: "$issues" },
      //   _id != undefined
      //   ? {$match :{"issues._id":ObjectId(_id)}}
      //   : {$match: {} },
      //   open !=undefined
      //   ? {$match: {"issues.open": open}} 
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
      //     // data.issues.map(ele => mappedData.push(ele))
      //     res.json(data);
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
      res.json("put")
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      res.json("delete")
    });
    
};
