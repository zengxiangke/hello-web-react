// import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import App from './App';

function renderApp() {
  // '!' for not null in typescript
  const container = document.getElementById('root')!;
  const root = createRoot(container);

  // root.render(
  //   <StrictMode>
  //     <App />
  //   </StrictMode>
  // );

  root.render(<App />);
}

renderApp();
