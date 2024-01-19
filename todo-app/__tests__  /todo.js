const request = require("supertest");
const cheerio = require("cheerio");

const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const loginUser = async (agent, email, password) => {
  const res = await agent.get("/login");
  const csrfToken = extractCsrfToken(res);

  await agent
    .post("/session")
    .send({
      email: email,
      password: password,
      _csrf: csrfToken,
    });

  return agent;
};

describe("Todo Application", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.error(error);
    }
  });

  test("User Signup", async () => {
    const res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    const signupResponse = await agent.post("/users").send({
      firstname: "Test",
      lastName: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });

    expect(signupResponse.statusCode).toBe(302);
  });

  test("User Sign Out", async () => {
    const res = await agent.get("/signout");
    const csrfToken = extractCsrfToken(res);
    const signoutResponse = await agent.get("/signout").send({
      _csrf: csrfToken,
    });

    expect(signoutResponse.statusCode).toBe(302);
  });

  test("Create a Todo - POST /todos", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/todos"));
    const response = await agent
      .post("/todos")
      .send({
        title: "Buy PC",
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken,
      });

    expect(response.statusCode).toBe(302);
  });

  test("Mark Todo as Complete - PUT /todos/:id", async () => {
    const agentAfterLogin = await loginUser(agent, "user.a@test.com", "12345678");

    const csrfToken = extractCsrfToken(await agentAfterLogin.get("/todos"));
    const todosResponse = await agentAfterLogin.get("/todos");
    const parsedResponse = JSON.parse(todosResponse.text);
    const todoId = parsedResponse.dueToday[0].id;

    const markCompleteResponse = await agentAfterLogin
      .put(`/todos/${todoId}`)
      .send({
        _csrf: csrfToken,
        completed: true,
      });

    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Mark Todo as Incomplete - PUT /todos/:id", async () => {
    const agentAfterLogin = await loginUser(agent, "user.a@test.com", "12345678");
    const csrfToken = extractCsrfToken(await agentAfterLogin.get("/todos"));

    const todosResponse = await agentAfterLogin.get("/todos");
    const parsedResponse = JSON.parse(todosResponse.text);
    const todoId = parsedResponse.dueToday[0].id;

    const markIncompleteResponse = await agentAfterLogin
      .put(`/todos/${todoId}`)
      .send({
        _csrf: csrfToken,
        completed: false,
      });

    const parsedUpdateResponse = JSON.parse(markIncompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  test("Delete Todo - DELETE /todos/:id", async () => {
    const agentAfterLogin = await loginUser(agent, "user.a@test.com", "12345678");
    const csrfToken = extractCsrfToken(await agentAfterLogin.get("/todos"));

    const todosResponse = await agentAfterLogin.get("/todos");
    const parsedResponse = JSON.parse(todosResponse.text);
    const todoId = parsedResponse.dueToday[0].id;

    const deleteResponse = await agentAfterLogin
      .delete(`/todos/${todoId}`)
      .send({
        _csrf: csrfToken,
      });

    const parsedDeleteResponse = JSON.parse(deleteResponse.text);
    expect(parsedDeleteResponse).toBe(true);
  });
});
