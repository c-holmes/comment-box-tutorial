/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var Comment = require('./public/models/comment');

mongoose.connect('mongodb://localhost/comments'); 

var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// ----------------------------------------------------
router.route('/comments')
  
  //create a comment - accessed at POST http:localhost:3000/api/comments/
  .post(function(req, res){

    var comment = new Comment();
    comment.id = Date.now(),
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
      if (err)
        res.send(err);

      res.json({ comment: 'Comment Created' });
    });

  })

  //gall all the comments - accessed at GET http:localhost:3000/api/comments
  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);

      res.json(comments);
    });
  });



// Additional middleware which will set headers that we need on each request.
// app.use(function(req, res, next) {
//     // Set permissive CORS header - this allows this server to be used only as
//     // an API server in conjunction with something like webpack-dev-server.
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Disable caching so we'll always get the latest comments.
//     res.setHeader('Cache-Control', 'no-cache');
//     next();
// });

// app.get('/api/comments', function(req, res) {
//   fs.readFile(COMMENTS_FILE, function(err, data) {
//     if (err) {
//       console.error(err);
//       process.exit(1);
//     }
//     res.json(JSON.parse(data));
//   });
// });

// app.post('/api/comments', function(req, res) {
//   fs.readFile(COMMENTS_FILE, function(err, data) {
//     if (err) {
//       console.error(err);
//       process.exit(1);
//     }
//     var comments = JSON.parse(data);
//     // NOTE: In a real implementation, we would likely rely on a database or
//     // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
//     // treat Date.now() as unique-enough for our purposes.
//     var newComment = {
//       id: Date.now(),
//       author: req.body.author,
//       text: req.body.text,
//     };
//     comments.push(newComment);
//     fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
//       if (err) {
//         console.error(err);
//         process.exit(1);
//       }
//       res.json(comments);
//     });
//   });
// });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
