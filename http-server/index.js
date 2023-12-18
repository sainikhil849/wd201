const http = require("http");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));

let homeContent = "";
let projectContent = "";
let registrationContent = "";

function readHTMLFile(filename, callback) {
  fs.readFile(filename, (err, content) => {
    if (err) {
      throw err;
    }
    callback(content);
  });
}

readHTMLFile("home.html", (content) => {
  homeContent = content;
});

readHTMLFile("project.html", (content) => {
  projectContent = content;
});

readHTMLFile("registration.html", (content) => {
  registrationContent = content;
});

const port = argv.port || argv.p || 3000;

http
  .createServer((request, response) => {
    const url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    
    switch (url) {
      case "/project":
        response.write(projectContent);
        break;
      case "/registration":
        response.write(registrationContent);
        break;
      default:
        response.write(homeContent);
        break;
    }

    response.end();
  })
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
