import Demo from "./learn/tanstack-query/demos";
import { useState } from "react";

export default function App() {
  const [it, setIt] = useState(0);

  return (
    <div key={it}>
      <section>
        <header>
          <h1>Playground</h1>
          <button onClick={() => setIt(Date.now())}>click to refresh</button>
          <div style={{ margin: "20px 0", border: "1px solid grey" }}></div>
        </header>
      </section>
      <main>
        {/* demos here */}
        <Demo />
      </main>
    </div>
  );
}
