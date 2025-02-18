import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { DBConnectionService } from "./connection/db.connection";
import { SocketConnectionService } from "./connection/socket.connection";
import { ControllerFactory } from "./controllers/controller-factory.controller";
import { errorHandler } from "./middleware/error.middleware";
import { limiter } from "./middleware/rate-limiter.middleware";

export let app = express();
dotenv.config({ path: "./.env.local" });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);
app.use(errorHandler);

const port = process.env.PORT;

app.set("port", port);

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("Ping check success");
});

DBConnectionService.createConnection().then(async () => {
  app = await SocketConnectionService.ConnectSocket(app);
  new ControllerFactory().getControllers().forEach((controller) => {
    console.log("Route Path", controller.getRoutePath());
    app.use(controller.getRoutePath(), controller.getRouter());
  });
  app.listen(port, () => {
    console.log("Server is listening on port ", port);
    console.log("http://localhost:%d/ping", app.get("port"));
  });
});
