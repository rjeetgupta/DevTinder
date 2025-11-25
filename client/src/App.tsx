import { BrowserRouter, Routes, Route } from "react-router"
import AppLayout from "./components/AppLayout"



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
