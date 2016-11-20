var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'kinzah',
    database: 'kinzah',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one' : {
      title:'Article One | Tanza Fathima',
      heading:'Article One',
      date:'Sep 5, 2016',
      content:`
          <p>
                         Human rights are universal, indivisible and interdependent. Human rights are what make us human. When we speak of the right to life, or development, or to dissent and diversity, we are speaking of tolerance. Tolerance will ensure all freedoms. Without it, we can be certain of none. 
             The raging ethnic cleansing in Kosovo is an example of intolerance. The Serbians will not tolerate the Albanians at any cost. They are forcing them from their homess, turning the streets into killing fields. This civil war seems unstoppable because of the intolerance of one race against another. No respect for individual rights, basic human rights. 
             Another example is right in our own back yard. I am speaking of hate crimes which plague our society. They are no different today than centuries ago when slavery was allowed. One race against another. One religion against another, it is all the same. Hate is the opposite of tolerance. We can only live together through an expression of tolerance of the differences each of us brings into this world. We should embrace the differences and share the differences. For this is how we learn, through each others' differences. Tolerance in all cultures is the basis of peace and progress.
          </p>`
    },
     'article-two' : {
          title:'Article Two | Tanza Fathima',
          heading:'Article Two',
          date:'Sep 10, 2016',
         content:`
            <p>
                            There are two major categories of friends in this world. True friends are the people who are dependable, trustworthy, and will always be there in times of distress and laughter. The other type of friend is more of an acquaintance than a friend. These are the people that can be depended on during the good times, but when life turns slightly turbulent, they bail. I like to refer to these people as fair weather friends because it seems they only are interested in the friendship when life's forecast is bright and shine
             </p>`               
    },   
    'article-three' : {
       title:'Article Three | Tanza Fathima',
       heading:'Article Three',
       date:'Sep 15, 2016',
       content:`
          <p>
                Distance Learning is a new way of learning and study. Distance education takes place when a teacher and students are separated by physical distance and technology. From their home, people can study and get a whole degree through a computer. Also, the students receive the same education as in a conventional course without interrupting their regular life. At the beginning, Distance Learning was offer for adult education or continuing education. Now, Distance Learning is spreading to all fields and to all type of students because of the demand. Universities and colleges are adopting this form of teaching as a learning opportunity for their students. In addition, many educational institutions are developing distance learning courses to provide increased educational opportunities without increased budgets. Courses in distance have a lot of benefits and advantages to offer. Distance learning helps people, with diverse situations, to finish their education while coming in contact with different technologies
          </p>`
    }  
};  

function createTemplate (data) {
    var title = data.title;
    var date  = data.date;
    var heading = data.heading;
    var content = data.content;
    
var htmlTemplate = `
  <html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content ="width-device-width, initial-scale-1" />
        <link href="/ui/style.css" rel="stylesheet" />
     </head>
    <body>
        <div class= "container">
      <div>
            <a href= "/">Home</a>
        </div>
         <hr/>
         <h3>
            ${heading}
         </h3>
         <div>
             ${date.toDateString()} 
         </div>
         <div>
            ${content}
         </div>
       </div>
     </body>
   </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
 res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    // make a select request
    // return a response with the results
    pool.query('SELECT * FROM test', function(err, result) {
       if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
});

var counter = 0;
app.get('/counter', function (req,res) {
    counter = counter + 1;
    res.send(counter.toString());
});

 var names = [];
app.get('/submit-name', function(req , res) { // URL: /submit-name?name-xxxxx
    // Get the name from the request
    var name = req.query.name;
    
    names.push(name);
    // JSON: Javascript Object Notation
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req, res) {
    // articleName == article-one
    // articles[articleName] == {} content object for article one
    
    // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
    pool.query("SELECT * FROM article WHERE title = $1", + [req.params.articleName], function (err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                res.status(404).send('Article not found');
            } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        
        }
   });
});
    
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});  

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});