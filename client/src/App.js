import UserForm from "./Form/userdetailform";
import DataTables from "./Table/Table";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/table" element={<DataTables />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
