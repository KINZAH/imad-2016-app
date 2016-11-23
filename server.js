var articleName = window.location.pathname.split('/')[2];
// request the server for the current value of Likes counter and render the response 
var initrequest = new XMLHttpRequest();
initrequest.onreadystatechange = function() {
    if (initrequest.readyState === XMLHttpRequest.DONE) {
        if (initrequest.status === 200) {
            var initcounter = initrequest.responseText;
            var initspan = document.getElementById('count');
            initspan.innerHTML = initcounter.toString();
        }
    }
};
initrequest.open('GET', 'http://kinzah.imad.hasura-app.io/initcounter/' + articleName, true);
initrequest.send(null);

function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
}

// request server for the current comment list and render the comments
var initcommrequest = new XMLHttpRequest();
initcommrequest.onreadystatechange = function () {
    if (initcommrequest.readyState === XMLHttpRequest.DONE) {
    if (initcommrequest.status === 200) {
        var commentsData = JSON.parse(this.responseText);
        var list = '';
        for (var i=0;i<commentsData.length;i++) {
          list += '<li>' + escapeHTML(commentsData[i].comment) + '</li>' + '<span>' + ' by ' + escapeHTML(commentsData[i].user_name) + ' on ' + commentsData[i].date.split('T')[0] + '</span>';
        }
        var ul = document.getElementById('commlist');
        ul.innerHTML = list;
        }
    }
};
initcommrequest.open('GET', 'http://kinzah.imad.hasura-app.io/initcmnt/' + articleName, true);
initcommrequest.send(null);

var checkrequest = new XMLHttpRequest();
checkrequest.onreadystatechange = function() {
    if (checkrequest.readyState === XMLHttpRequest.DONE) {
        if (checkrequest.status === 200) {
            var username = this.responseText;
            var cmntarea = `
                Write a comment...
                <br/>
                <textarea rows="2" cols="50" class="scrollabletextbox" id="comment" name="comments" ></textarea>
                <br/>
                <input type="submit" id="submit_btn" value="Submit"> </input>`;
            document.getElementById('cmntInput').innerHTML = cmntarea;
            document.getElementById('comment').addEventListener("keyup",function(event) {
                if (event.keyCode == 13 ) {
                event.preventDefault();
                document.getElementById('submit_btn').click();
                }
            });
            //on clicking Submit button, add the text in the comment box to the database and display the updated comments list 
            var submit = document.getElementById('submit_btn');
            submit.onclick = function() {
                var commInput = document.getElementById('comment');
                var comment = commInput.value;
                if (comment > " ") {
                    var request = new XMLHttpRequest();
                    request.onreadystatechange = function () {
                        if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            var commentsData = JSON.parse(this.responseText);
                            var list = '';
                            for (var i=0;i<commentsData.length;i++) {
                              list += '<li>' + escapeHTML(commentsData[i].comment) + '</li>' + '<span>' + ' by ' + commentsData[i].user_name + ' on ' + commentsData[i].date.split('T')[0] + '</span>';
                            }
                            var ul = document.getElementById('commlist');
                            ul.innerHTML = list;
                            var cmntlink = document.getElementById('cmntlink');
                            var cmntstring = commentsData[0].cmntcnt + ' comments';
                            cmntlink.innerHTML = cmntstring;
                            }
                        } 
                    };
                    request.open('POST', 'http://kinzah.imad.hasura-app.io/submit-cmnt/' + articleName, true);
                    request.setRequestHeader('Content-Type','application/json');
                    request.send(JSON.stringify({comment : comment, username : username}));
                    document.getElementById('comment').value="";
                }
            };
        }
        else {
            var promptlogin = '**Please login/signup to post comments!';
            document.getElementById('cmntInput').innerHTML = promptlogin;
        }
    }
};

checkrequest.open('GET', 'http://kinzah.imad.hasura-app.io/check-login', true);
checkrequest.send(null);


//on clicking Like button request server to increment Like counter and render the new Like counter
var button1 = document.getElementById('counter');
button1.onclick = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
    };
    request.open('GET', 'http://kinzah.imad.hasura-app.io/counter/' + articleName, true);
    request.send(null);
};