var Bluebird = require('bluebird');
var Request = Bluebird.promisifyAll(require('request'));
var _ = require('lodash');

var API_URL = 'https://api.github.com:443';
var WEB_URL = 'https://github.com';
var REF = 'refs/heads/master';

module.exports = function (ctx, cb) {
    var msg;
    var err;
    
    if (!ctx.body) {
        err = new Error('This webtask must be created with the `--parse` flag (`pb` claim)');
        return cb(err);
    }
    
    if (!ctx.body.pull_request) {
        err = new Error('Unexpected payload: Missing pull request information.');
        return cb(err);
    }
    
    var pull_request = ctx.body.pull_request;
    
    if (pull_request.state != 'open') {
        msg = 'gif_responder only works over open PRs.';
        return cb(null, msg);
    }
    
    var additions = pull_request.additions;
    var deletions = pull_request.deletions;

    if (!additions && !deletions) {
        msg = 'Impossible pull request. No additions and/or deletions in it.';
        return cb(null, msg);
    }
    
    var headers = {
        'Authorization': 'Bearer ' + ctx.data.GITHUB_TOKEN,
        'User-Agent': 'Webtask Tagger',
        'Accept': 'application/json'
    };
    
    postComment().nodeify(cb);
    
    // Helper functions
    function sendComment(gif) {
        var url = API_URL + '/repos/' + pull_request.head.repo.full_name  + '/issues/' + pull_request.number + '/comments';
        var options = {
            url: url,
            headers: headers,
            json: true,
            body: {
                "body": "With **" + additions + "** `additions` | **" + deletions + "** `deletions`] your score is:<br/>\![](" + gif + ")"
            },
        };
            
        var promise = Request.postAsync(options);
            
        return promise
            .get(1)
            .then(function (args) {
                console.log("🎉");
                return 'Successfully created comment.';
            });
        }
        
        function getGif() {
            var query = '';
            if (additions < deletions) {
                query = 'not+bad';
            } else {
                query = ((additions - deletions) > 500) ? 'omg' : 'shrug';
            }
            
            var giphy_url = 'http://api.giphy.com/v1/gifs/search?q=' + query + '&api_key=dc6zaTOxFJmzC'
            var giphy_options = {
                url: giphy_url,
                json: true
            }
            
            var promise = Request.getAsync(giphy_options);
        
            return promise
                .get(1)
                .then(function (response) {
                    var data = response.data;
                    var randomIndex = Math.floor(Math.random()*data.length);
                    var gif_url = data[randomIndex].images.original.url;
                    console.log(gif_url);
                    return sendComment(gif_url);
                });
        }
    
    function postComment() {
        return getGif();
    }
};

