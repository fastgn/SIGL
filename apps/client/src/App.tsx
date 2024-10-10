import { useEffect, useState } from "react";
import "./App.css";
import api from "./services/api.service";
import DemoForm from "./components/demo/demo-form";

function App() {
  const [, setMessage] = useState("");

  useEffect(() => {
    api.get("/").then((response) => {
      setMessage(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <>
      <DemoForm />
    </>
  );
}

export default App;
