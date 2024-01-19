"use strict";

const express = require("express");
const csrfProtection = require("csurf");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! a secret string"));
app.use(csrfProtection({ cookie: true }));

const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');

const bcrypt = require('bcrypt');
const flash = require("connect-flash");
app.set("views", path.join(__dirname, "views"));
const saltRounds = 10;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "mYsCrtkEy-@yEktrCsYm",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hrs
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((request, response, next) => {
  response.locals.messages = request.flash();
  next();
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (username, password, done) => {
  User.findOne({ where: { email: username } })
    .then(async (user) => {
      if (!user) {
        return done(null, false, { message: 'Invalid email' });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    }).catch((error) => {
      return done(error);
    });
}));

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error, null);
    });
});

app.get("/", async (request, response) => {
  response.render("index", {
    title: "Todo app",
    csrfToken: request.csrfToken(),
  });
});

app.get("/tasks", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  const loggedInUser = request.user.id;
  const overdue = await Todo.findOverdueTasks(loggedInUser);
  const dueToday = await Todo.findTasksDueToday(loggedInUser);
  const dueLater = await Todo.findTasksDueLater(loggedInUser);
  const completedItems = await Todo.getCompletedTasks(loggedInUser);
  const allTasks = await Todo.fetchTasks(loggedInUser);
  if (request.accepts("html")) {
    response.render("tasks", {
      title: "Todo app",
      overdue,
      dueToday,
      dueLater,
      completedItems,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      overdue,
      dueToday,
      dueLater,
      allTasks,
      completedItems
    });
  }
});

app.get("/register", (request, response) => {
  response.render("register", { title: "Register", csrfToken: request.csrfToken() });
});

app.post("/users", async (request, response) => {
  const { firstname, lastname, email, password } = request.body;

  const errors = [];

  if (!firstname) {
    errors.push("First name is required");
  }

  if (!email) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    request.flash("error", errors);
    return response.redirect("/register");
  }

  try {
    const hashedPwd = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPwd,
    });

    request.login(user, (err) => {
      if (err) {
        console.log(err);
        request.flash("error", "An error occurred during login.");
        return response.redirect("/login");
      }
      response.redirect("/tasks");
    });
  } catch (error) {
    console.log(error);
    request.flash("error", error.message);
    return response.redirect("/register");
  }
});

app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});

app.post("/session", passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), (request, response) => {
  response.redirect("/tasks");
});

app.get("/logout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.get("/tasks/:id", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  try {
    const task = await Todo.findByPk(request.params.id);
    return response.json(task);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/tasks", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const { title, dueDate } = request.body;

  if (!title || !dueDate) {
    request.flash("error", "Title and Due date are required");
    return response.redirect("/tasks");
  }

  try {
    await
