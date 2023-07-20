import { sleep } from "../../shared/js-utils";

const books = ["default"];

const apis = {
  async getBooks() {
    console.log("getting books...");
    await sleep(3);
    return [...books];
  },
  async getAdultBooks(age: number) {
    if (age < 18) {
      throw new Error("not for kid");
    }
    return ["No more sex"];
  },
  async addBook(title: string) {
    await sleep(1);
    books.push(title);
  },
};

export { apis };
