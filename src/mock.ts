import {
  createServer,
  hasMany,
  Model,
  Registry,
  Server,
  RestSerializer,
  belongsTo,
  JSONAPISerializer
} from "miragejs";
import { AnyModels, AnyFactories } from "miragejs/-types";
import axios from "axios";

let server: Server<Registry<AnyModels, AnyFactories>>;

function buildServer() {
  return createServer({
    serializers: {
      // JSONAPISerializer | RestSerializer | ActiveModelSerializer
      // application: "RestSerializer"
      student: RestSerializer.extend({
        include: ["books"],
        embed: true
      })
    },

    /**
     * A student has many books
     * A student has one bank card
     * A student has mang course, vice versa
     */
    models: {
      book: Model.extend({
        student: belongsTo()
      }),
      student: Model.extend({
        books: hasMany()
      })
    },

    routes() {
      this.namespace = "/api";

      this.get("/students", (schema) => {
        const studentOne = schema.create("student", {
          id: "S001",
          name: "one"
        });
        studentOne.newBook({ name: "book1" });
        studentOne.newBook({ name: "book2" });
        studentOne.save();

        console.log(schema.db.dump());

        return schema.all("student");
      });
    }
  });
}

function setup() {
  if (server) {
    console.log("shutting down...", new Date());
    server.shutdown();
  }

  console.log("mocking...", new Date());

  server = buildServer();

  server.passthrough((req) => {
    return !req.url.includes("/api/");
  });
  // server.logging = false;

  return server;
}

async function test() {
  const res = await axios.get("/api/students");
  console.log(res.data);
}

function mocking() {
  setup();
  test();
}

export { mocking };
