import { useEffect, useState } from "react";
import "./App.css";
import api from "./services/api.service";
import DemoForm from "./components/demo/demo-form";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/").then((response) => {
      setMessage(response.data);
    });
  }, []);

  return (
    <>
      <DemoForm />
    </>
  );
}

export default App;
