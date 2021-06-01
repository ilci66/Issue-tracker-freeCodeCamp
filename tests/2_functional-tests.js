const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
// Create an issue with every field: POST request to /api/issues/{project}
  test("post with every field", (done) => {
    chai
      .request(server)
      .post('/api/issues/testproject')
      .type('form')
      .send({
        assigned_to : "asd",
        status_text : "asd",
        issue_title : "asd",
        issue_text : "asd",
        created_by : "asd",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.status_text, "asd");
        assert.equal(res.body.assigned_to, "asd");
        assert.equal(res.body.issue_title, "asd");
        assert.equal(res.body.issue_text, "asd");
        assert.equal(res.body.created_by, "asd");
        done();
      })
  });
// Create an issue with only required fields: POST request to /api/issues/{project}
  test("post with required fields", (done) => {
        chai
      .request(server)
      .post('/api/issues/testproject')
      .type('form')
      .send({
        assigned_to : "",
        status_text : "",
        issue_title : "qwe",
        issue_text : "qwe",
        created_by : "qwe",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "qwe");
        assert.equal(res.body.issue_text, "qwe");
        assert.equal(res.body.created_by, "qwe");
        done(); 
      })
  })
// Create an issue with missing required fields: POST request to /api/issues/{project}
  test("post with missing required fields", (done) => {
        chai
      .request(server)
      .post('/api/issues/testproject')
      .type('form')
      .send({
        assigned_to : "asd",
        status_text : "asd",
        issue_title : "",
        issue_text : "",
        created_by : "",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done(); 
      })
  })
// View issues on a project: GET request to /api/issues/{project}
  test("get request for all issues", (done) => {
    chai
      .request(server)
      .get('/api/issues/testproject')
      .end((err, res) => {
        assert.equal(res.body.status, 200);
        assert.equal()
      })
  })
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
});
