"use client"

import { useState } from "react"
import {
  ChevronDownIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  PrinterIcon,
  ShareIcon,
  StarIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline"

const Results = ({ results }) => {
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    education: true,
    eligibility: true,
    evaluation: true,
    skills: true,
  })

  if (!results) return null

  const { resume_data, eligibility, recommended_roles, resume_evaluation } = results

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // This would be implemented with actual PDF generation
    alert("Download functionality would be implemented here")
  }

  const handleShare = () => {
    // This would be implemented with actual sharing functionality
    alert("Share functionality would be implemented here")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Resume Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                onClick={handlePrint}
                title="Print"
              >
                <PrinterIcon className="h-5 w-5" />
              </button>
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                onClick={handleDownload}
                title="Download"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                onClick={handleShare}
                title="Share"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Candidate Info */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <div className="p-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Candidate</h3>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{resume_data?.name || "Candidate"}</h3>
              <p className="text-gray-600 flex items-center mb-1">{resume_data?.email || "No email provided"}</p>
              <p className="text-gray-600 flex items-center">{resume_data?.phone || "No phone provided"}</p>
            </div>
          </div>

          {/* Eligibility Status */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <div className="p-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Eligibility Status</h3>
              </div>
            </div>
            <div className="p-5 flex items-center justify-center h-[calc(100%-64px)]">
              <div className="text-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    eligibility?.eligibility === "Eligible" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {eligibility?.eligibility === "Eligible" ? (
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  )}
                  {eligibility?.eligibility || "Not Evaluated"}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <div className="p-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Overall Score</h3>
              </div>
            </div>
            <div className="p-5 flex items-center justify-center h-[calc(100%-64px)]">
              <div className="w-full max-w-xs">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-100">
                        Score
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary-600">
                        {resume_evaluation?.overall_score || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
                    <div
                      style={{ width: `${resume_evaluation?.overall_score || 0}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500 ease-out"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <InfoItem label="Name" value={resume_data?.name} />
                  <InfoItem label="Email" value={resume_data?.email} />
                  <InfoItem label="Phone" value={resume_data?.phone} />
                  {resume_data?.location && <InfoItem label="Location" value={resume_data?.location} />}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <CodeBracketIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                  onClick={() => toggleSection("skills")}
                  aria-expanded={expandedSections.skills}
                >
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${expandedSections.skills ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div className={`p-5 ${expandedSections.skills ? "" : "hidden"}`}>
                <div className="flex flex-wrap gap-2">
                  {resume_data?.skills?.length > 0 ? (
                    resume_data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No skills listed</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Roles */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Recommended Roles</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {recommended_roles?.recommended_roles?.length > 0 ? (
                    recommended_roles.recommended_roles.map((role, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-secondary-100 text-secondary-800 rounded-md text-sm font-medium"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No recommended roles available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (2 columns wide) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Education */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                  onClick={() => toggleSection("education")}
                  aria-expanded={expandedSections.education}
                >
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${expandedSections.education ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div className={`p-5 ${expandedSections.education ? "" : "hidden"}`}>
                {resume_data?.education?.length > 0 ? (
                  <div className="space-y-6">
                    {resume_data.education.map((edu, index) => (
                      <EducationItem key={index} {...edu} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No education information available</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                  onClick={() => toggleSection("experience")}
                  aria-expanded={expandedSections.experience}
                >
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${expandedSections.experience ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div className={`p-5 ${expandedSections.experience ? "" : "hidden"}`}>
                {resume_data?.experience?.length > 0 ? (
                  <div className="space-y-6">
                    {resume_data.experience.map((exp, index) => (
                      <ExperienceItem key={index} {...exp} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No experience information available</p>
                )}
              </div>
            </div>

            {/* Role Eligibility */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Role Eligibility</h3>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                  onClick={() => toggleSection("eligibility")}
                  aria-expanded={expandedSections.eligibility}
                >
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${expandedSections.eligibility ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div className={`p-5 ${expandedSections.eligibility ? "" : "hidden"}`}>
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3 text-gray-900">Status</h3>
                  <div
                    className={`p-4 rounded-md ${
                      eligibility?.eligibility === "Eligible"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {eligibility?.eligibility === "Eligible" ? (
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                      ) : (
                        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                      )}
                      <p className="font-medium">{eligibility?.eligibility || "Not Evaluated"}</p>
                    </div>
                  </div>
                </div>

                {eligibility?.missing_skills?.length > 0 && (
                  <div>
                    <h3 className="text-md font-medium mb-3 text-gray-900">Missing Skills</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {eligibility.missing_skills.map((item, index) => (
                        <SkillBox key={index} {...item} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Evaluation */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Resume Evaluation</h3>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                  onClick={() => toggleSection("evaluation")}
                  aria-expanded={expandedSections.evaluation}
                >
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${expandedSections.evaluation ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div className={`p-5 ${expandedSections.evaluation ? "" : "hidden"}`}>
                <div className="mb-8">
                  <h3 className="text-md font-medium mb-4 text-gray-900">Score Breakdown</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {resume_evaluation &&
                      Object.entries(resume_evaluation)
                        .filter(([key]) => !key.includes("areas_of_improvement") && key !== "overall_score")
                        .map(([key, value]) => <ScoreItem key={key} label={key.replace(/_/g, " ")} score={value} />)}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-3 text-gray-900">Areas for Improvement</h3>
                  {resume_evaluation?.areas_of_improvement?.length > 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                      <ul className="space-y-3 text-gray-700">
                        {resume_evaluation.areas_of_improvement.map((area, index) => (
                          <li key={index} className="flex">
                            <span className="font-medium text-amber-800 mr-2">{index + 1}.</span>
                            <span>{area.replace(/^\d+\.\s*/, "")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No improvement areas identified</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

/* Helper Components */
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-gray-900">{value || "N/A"}</p>
  </div>
)

const ExperienceItem = ({ title, company, duration, description, technologies }) => (
  <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary-500 before:rounded-full">
    <div className="mb-2">
      <h4 className="text-lg font-medium text-gray-900">{title}</h4>
      {company && <p className="text-gray-700">{company}</p>}
    </div>
    {duration && (
      <p className="text-sm text-gray-500 mb-2 flex items-center">
        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium">{duration}</span>
      </p>
    )}
    {description && <p className="text-gray-700 mb-3">{description}</p>}
    {technologies?.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
            {tech}
          </span>
        ))}
      </div>
    )}
  </div>
)

const EducationItem = ({ institution, degree, cgpa, percentage, year }) => (
  <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500 before:rounded-full">
    <h4 className="text-lg font-medium text-gray-900">{institution}</h4>
    <p className="text-gray-700 mb-2">{degree}</p>
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {cgpa && (
        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
          CGPA: {cgpa}
        </span>
      )}
      {percentage && (
        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
          Percentage: {percentage}%
        </span>
      )}
      {year && (
        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
          Year: {year}
        </span>
      )}
    </div>
  </div>
)

const SkillBox = ({ skill, learning_resource }) => (
  <div className="border rounded-md p-4 bg-gray-50 hover:shadow-md transition-shadow">
    <h4 className="font-medium text-gray-900 mb-3">{skill}</h4>
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Learning Resources:</p>
      <div className="flex items-center">
        <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2 text-primary-600" />
        <a
          href={learning_resource}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:underline text-sm truncate"
        >
          {learning_resource}
        </a>
      </div>
    </div>
  </div>
)

const ScoreItem = ({ label, score }) => {
  const getScoreColorClass = (score) => {
    const numericScore = typeof score === "string" ? Number.parseInt(score) : score
    if (numericScore >= 90) return "bg-green-500"
    if (numericScore >= 75) return "bg-primary-500"
    if (numericScore >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  const getTextColorClass = (score) => {
    const numericScore = typeof score === "string" ? Number.parseInt(score) : score
    if (numericScore >= 90) return "text-green-700"
    if (numericScore >= 75) return "text-primary-700"
    if (numericScore >= 60) return "text-amber-700"
    return "text-red-700"
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between mb-2">
        <p className="text-sm font-medium text-gray-700 capitalize">{label}</p>
        <p className={`text-sm font-bold ${getTextColorClass(score)}`}>{score}%</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`${getScoreColorClass(score)} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  )
}

export default Results

