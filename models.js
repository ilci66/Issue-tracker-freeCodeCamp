const mongoose = require('mongoose');
const { Schema } = mongoose;


const issueSchema = new Schema({
  assigned_to: String,
  // open: { type: Boolean, default: true },
  open: Boolean,
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_on: Date,
  updated_on: Date,
  created_by: {type: String, required: true},
  status_text: String
});

const Issue = mongoose.model('Issue', issueSchema);

const projectSchema = new Schema({
  name: {type: String, required: true},
  issues: [issueSchema]
})

const Project = mongoose.model('Project', projectSchema);

exports.Issue = Issue;
exports.Project = Project;
