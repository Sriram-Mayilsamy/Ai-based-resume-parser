"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { CloudArrowUpIcon, DocumentTextIcon, BriefcaseIcon, ArrowPathIcon } from "@heroicons/react/24/outline"

const AnimatedShape = ({ className }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
      });
    }, 15000 + Math.random() * 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className={`absolute opacity-10 transition-all duration-[15000ms] ease-in-out ${className}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${position.rotation}deg)`
      }}
    />
  );
};

const FileUpload = ({ setResults }) => {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (event) => setFile(event.target.files[0])
  const handleRoleChange = (event) => setRole(event.target.value)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !role) {
      alert("Please select a file and enter a job role.")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("role", role)

    try {
      const response = await axios.post("http://localhost:8000/upload", formData)
      setResults(response.data)
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("An error occurred while analyzing your resume. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12 overflow-hidden relative">
      {/* Animated Background Shapes */}
      <AnimatedShape className="w-64 h-64 rounded-full bg-primary-200" />
      <AnimatedShape className="w-48 h-48 rounded-full bg-secondary-200" />
      <AnimatedShape className="w-32 h-32 bg-primary-100 rotate-45" />
      <AnimatedShape className="w-56 h-56 bg-secondary-100 rounded-lg" />
      <AnimatedShape className="w-40 h-40 bg-primary-300 rounded-full" />
      <AnimatedShape className="w-72 h-72 bg-secondary-300 rounded-full" />
      
      {/* Floating Document Icons */}
      <div className="absolute top-1/4 left-1/4 animate-pulse opacity-20">
        <DocumentTextIcon className="h-16 w-16 text-primary-600" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-pulse opacity-20">
        <DocumentTextIcon className="h-12 w-12 text-secondary-600" />
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <DocumentTextIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Analyzer</h1>
          <p className="mt-2 text-gray-600">Upload your resume and get instant feedback</p>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6 mb-6 transition-all duration-300 hover:shadow-card-hover relative overflow-hidden">
          {/* Background gradient for card */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-50"></div>
          
          {/* File Drop Area */}
          <div
            className={`relative border-2 ${dragActive ? "border-primary-500" : "border-dashed border-gray-300"} 
                        rounded-lg p-8 transition-all duration-200 ease-in-out
                        ${file ? "bg-primary-50" : "bg-white"} 
                        hover:border-primary-400 hover:bg-primary-50 z-10`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="text-center">
              <CloudArrowUpIcon className={`mx-auto h-12 w-12 ${file ? "text-primary-600" : "text-gray-400"}`} />
              <p className="mt-2 text-sm font-medium text-gray-900">
                {file ? file.name : "Drag & drop your resume or click to browse"}
              </p>
              <p className="mt-1 text-xs text-gray-500">Supports PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          </div>

          {/* Job Role Input */}
          <div className="mt-6 relative z-10">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Desired Job Role
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="role"
                type="text"
                placeholder="e.g. Frontend Developer, Data Scientist"
                value={role}
                onChange={handleRoleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Action Button with Improved Loading State */}
        <button
          onClick={handleUpload}
          disabled={isLoading || !file || !role}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium relative
                     ${!file || !role ? "bg-gray-400 cursor-not-allowed" : isLoading ? "bg-primary-500" : "bg-primary-600 hover:bg-primary-700"} 
                     transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden`}
        >
          {/* Button background animation */}
          {(file && role && !isLoading) && (
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute top-0 left-0 w-full h-full bg-primary-500 opacity-50"></div>
              <div className="absolute top-0 left-0 h-full bg-secondary-500 opacity-30 animate-pulse" 
                   style={{width: '30%', animationDuration: '3s'}}></div>
            </div>
          )}
          
          <span className="relative z-10 flex items-center justify-center">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              "Analyze Resume"
            )}
          </span>
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          By uploading, you agree to our{" "}
          <a href="#" className="text-primary-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
      
      {/* Additional floating elements */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-400 z-10">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse"></div>
          Waiting for resume...
        </div>
      </div>
    </div>
  )
}

export default FileUpload