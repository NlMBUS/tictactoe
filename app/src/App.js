import Game from './Game.js';
import Archive from './Archive.js';
import BoardList from './BoardList.js';
import NotFound from './NotFound';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (

    <Router>
      <div className="App">
        <div className="Content">
          <Routes>
            <Route exact path="/" element={<Game />}>
            </Route>
          <Route path="/archive" element={<Archive />}>
            </Route>
          <Route path="/archive/:id" element={<BoardList />}>
            </Route>
          <Route path="*" element={<NotFound />}>
            </Route>
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
