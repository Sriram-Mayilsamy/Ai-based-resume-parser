import { useState, useEffect } from "react";
import axios from "axios";

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  
  // Filter states
  const [roleFilter, setRoleFilter] = useState("");
  const [scoreSort, setScoreSort] = useState("desc"); // "asc" or "desc"
  
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/candidates");
        // Access the candidates array inside the response data object
        
        // Normalize data - ensure all relevancy_score values are numbers
        const normalizedCandidates = (response.data.candidates || []).map(candidate => ({
          ...candidate,
          relevancy_score: parseFloat(candidate.relevancy_score) || 0,
          resume_scores: candidate.resume_scores ? {
            ...candidate.resume_scores,
            relevance_to_role: parseFloat(candidate.resume_scores.relevance_to_role) || 0,
            skill_coverage: parseFloat(candidate.resume_scores.skill_coverage) || 0,
            experience_alignment: parseFloat(candidate.resume_scores.experience_alignment) || 0,
            project_relevance: parseFloat(candidate.resume_scores.project_relevance) || 0,
            industry_insights: parseFloat(candidate.resume_scores.industry_insights) || 0,
            job_specific_achievements: parseFloat(candidate.resume_scores.job_specific_achievements) || 0,
            education_certifications: parseFloat(candidate.resume_scores.education_certifications) || 0,
            overall_score: parseFloat(candidate.resume_scores.overall_score) || 0,
          } : {}
        }));
        
        setCandidates(normalizedCandidates);
        setFilteredCandidates(normalizedCandidates);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch candidates");
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchCandidates();
  }, []);
  
  useEffect(() => {
    // Apply filters and sorting
    let result = [...candidates];
    
    // Filter by role if roleFilter is not empty - Using includes for partial matching
    if (roleFilter) {
      result = result.filter(candidate => 
        candidate.expected_role && 
        candidate.expected_role.toLowerCase().includes(roleFilter.toLowerCase())
      );
    }
    
    // Sort by relevancy score - No need to parseFloat here as we normalized data above
    result.sort((a, b) => {
      if (scoreSort === "asc") {
        return a.relevancy_score - b.relevancy_score;
      } else {
        return b.relevancy_score - a.relevancy_score;
      }
    });
    
    setFilteredCandidates(result);
  }, [candidates, roleFilter, scoreSort]);
  
  // Filter label text to reflect partial matching
  const getFilterLabel = () => {
    if (!roleFilter) return "";
    return `Filtered by: "${roleFilter}"`;
  };
  
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading candidates...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-lg font-medium">Error</span>
        </div>
        <p className="text-gray-700">{error}</p>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Candidate Profiles</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse through our qualified candidates sorted by relevancy
          </p>
        </div>
        
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Filter Candidates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="role-filter"
                  type="text"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  placeholder="Filter by role (e.g. professor)"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="score-sort" className="block text-sm font-medium text-gray-700 mb-2">
                Relevancy Score
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </div>
                <select
                  id="score-sort"
                  value={scoreSort}
                  onChange={(e) => setScoreSort(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-none"
                >
                  <option value="desc">Highest to Lowest</option>
                  <option value="asc">Lowest to Highest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600 font-medium">
            Showing <span className="text-indigo-600">{filteredCandidates.length}</span> of <span className="text-indigo-600">{candidates.length}</span> candidates
          </div>
          
          <div className="text-sm text-gray-500">
            {getFilterLabel()}
          </div>
        </div>
        
        {/* Candidates Grid */}
        {filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCandidates.map((candidate) => (
              <div 
                key={candidate.id || candidate.email}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 truncate">{candidate.name}</h3>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-800">
                        <span className="font-bold">{candidate.relevancy_score}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {candidate.expected_role}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600 truncate">{candidate.email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm text-gray-600">{candidate.phone}</span>
                    </div>
                  </div>
                  
                  {/* Score Breakdown */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Score Breakdown</h4>
                    <div className="space-y-2">
                      {candidate.resume_scores && Object.entries(candidate.resume_scores)
                        .filter(([key]) => key !== "overall_score")
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No candidates found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No candidates match your current filters. Try adjusting your search criteria to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesList;