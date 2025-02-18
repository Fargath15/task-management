import { Server } from "socket.io";
import http from "http";
import { Express } from "express";

export class SocketConnectionService {
  public static async ConnectSocket(app: Express): Promise<Express> {
    const server = http.createServer(app);
    const io: Server = new Server(server);

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    app.set("socketio", io);

    return app;
  }
}
