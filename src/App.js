import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import Results from "./components/Results";
import CandidatesList from "./components/CandidatesList"; // Import CandidatesList component

const App = () => {
  const [results, setResults] = useState(null);

  return (
    <Router>
      <div>

        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <FileUpload setResults={setResults} />
                <Results results={results} />
              </>
            } 
          />
          <Route path="/candidates" element={<CandidatesList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
