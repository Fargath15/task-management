import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../server";
import { hash } from "bcryptjs";
import { UserRepository } from "../repository/user.repository";
import { RoleType } from "../middleware/auth.middleware";
import { Server } from "http";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

let token: string;
let user_id: string;
let task_id: string;

let mongoServer: MongoMemoryServer;
let server: Server;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.disconnect();
    await mongoose.connect(mongoUri).then(() => console.log("Connected to the in-memory database"));

    server = app.listen(5000);

    const hashedPassword = await hash("password123", 10);
    const user = await new UserRepository().createUser({
      name: "Test",
      email: "test@example.com",
      password: hashedPassword,
      role: RoleType.Manager,
    });

    expect(user).toHaveProperty("_id");
    user_id = user._id.toString();

    console.log({ user_id });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "user@example.com",
      password: "password123",
    });
    console.log(res.statusCode, res.text, res.error);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  } catch (e) {
    console.error("Error setting up the test database:", e);
  }
});

afterAll(async () => {
  try {
    if (server) {
      server.close();
    }

    if (mongoServer) {
      await mongoose.disconnect();
      await mongoServer.stop();
    }
  } catch (e) {
    console.error("Error closing server:", e);
  }
});

describe("Task API Tests", () => {
  test("Create a Task", async () => {
    const res = await request(app).post("/api/v1/tasks").set("Authorization", token).send({
      title: "Test Task",
      description: "This is a test task",
      assignedTo: user_id,
      dueDate: "2025-02-20",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test Task");
    task_id = res.body._id;
  });

  test("Get All Tasks", async () => {
    const res = await request(app).get("/api/v1/tasks").set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Update Task Status", async () => {
    const res = await request(app).put(`/api/v1/tasks/${task_id}`).set("Authorization", token).send({ status: "In Progress" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("In Progress");
  });

  test("Delete Task", async () => {
    const res = await request(app).delete(`/api/v1/tasks/${task_id}`).set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });
});
