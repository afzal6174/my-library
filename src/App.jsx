import Field from "@/components/Field";
import "./App.css";

function App() {
  return (
    <>
      <Field error="testing error">
        <input type="text" />
        <input type="text" />
      </Field>
    </>
  );
}

export default App;
