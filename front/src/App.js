import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AppHeader from "./components/AppHeader";
import CarList from "./components/CarList";
import CarEdit from "./components/CarEdit";

import "./App.css";

class App extends Component {

  render() {    
    return (
      <Router>
        <div className="App">
          <AppHeader />
          <main>
          <Routes>
            <Route exact path="/" element={<CarList />} />     
            <Route exact path="/:id" element={<CarEdit />} />
            </Routes>
          </main>
          <footer>
            <span>Built by Katherine Van As at the HyperionDev School</span>
          </footer>
        </div>
      </Router>
    );
  }
}
export default App;
