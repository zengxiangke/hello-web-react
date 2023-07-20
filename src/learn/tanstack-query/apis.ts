import { sleep } from '../../shared/js-utils';

const books = ['default'];

const apis = {
  async getBooks() {
    console.log('getting books...');
    await sleep(3);
    return [...books];
  },
  async addBook(title: string) {
    await sleep(1);
    books.push(title);
  },
};

export { apis };
