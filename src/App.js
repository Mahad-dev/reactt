import Context from "./Components/Context";
import HomePage from "./Pages/HomePage";
import "rsuite/dist/rsuite.css";
// import { useEffect, useState } from "react";

function App() {
  return (
    <Context>
      <HomePage />
    </Context>
  );
}

export default App;
