'use client'
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import PDFViewer from "@/components/pdf-viewer"
import { CheckCircle, Lightbulb, StarIcon, ThumbsDownIcon, ThumbsUp } from "lucide-react"

const ResumeDetailPage = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [resumeData, setResumeData] = useState<any>(null)

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch(`/api/resume/${id}`);
        if (!res.ok) throw new Error('Failed to fetch resume');
        const data = await res.json();
        setResumeData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-6">
          <Skeleton className="w-1/2 h-8" />
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
        </div>
        <Skeleton className="w-full h-[500px]" />
      </div>
    )
  }

  if (!resumeData?.analysis_result) {
    return <p className="text-center mt-10 text-gray-500">No analysis data found.</p>
  }

  const analysis = typeof resumeData.analysis_result === "string"
    ? JSON.parse(resumeData.analysis_result)
    : resumeData.analysis_result

  return (
    <div>
      <h3 className=" mb-10">
        AI Analysis Results
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>

          {/* Overall Score */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
              <StarIcon className="text-blue-500 mr-2" size={40}/> Overall Score
            </h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-6xl font-extrabold text-blue-600">
                {analysis.overall_score}
                <span className="text-2xl">/100</span>
              </span>
              <div className="flex items-center">
                {analysis.overall_score > 60 ?
                <span className="text-green-500 text-lg font-bold">
                  {analysis.overall_feedback}
                </span>
                :
                <span className="text-red-500 text-lg font-bold">
                    {analysis.overall_feedback}
                </span>
                }
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${analysis.overall_score}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm">{analysis.summary_comment}</p>
          </div>

          {/* Section Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {Object.entries(analysis.sections).map(([section, value]: any) => (
              <div
                key={section}
                className="bg-white rounded-lg shadow-md p-5 border border-green-200"
              >
                <h4 className="text-lg font-semibold text-gray-700 mb-3 capitalize">
                  {section.replace("_", " ")}
                </h4>
                <span className="text-4xl font-bold text-black">{value.score}%</span>
                <p className="text-sm text-gray-600 mt-2">{value.comment}</p>
              </div>
            ))}
          </div>

          {/* Tips for Improvement */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
              <Lightbulb className="text-orange-500 mr-2" size={40}/> Tips for Improvement
            </h3>
            <ol className="list-none space-y-4">
              {analysis.tips_for_improvement.map((tip: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                    <CheckCircle/>
                  </span>
                  <p className="text-gray-600 text-sm">{tip}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* What's Good & Needs Improvement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-5 border border-green-200">
              <h3 className="text-lg font-bold text-gray-700 mb-3 flex flex-col">
                <ThumbsUp className="text-green-500" size={40}/> What's Good
              </h3>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                {analysis.whats_good.map((good: string, i: number) => (
                  <li key={i}>{good}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 border border-red-200">
              <h3 className="text-lg font-bold text-gray-700 mb-3 flex flex-col">
                <ThumbsDownIcon className="text-red-500" size={40}/> Needs Improvement
              </h3>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                {analysis.needs_improvement.map((bad: string, i: number) => (
                  <li key={i}>{bad}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* PDF Preview or other side content */}
        <div>
          <h4 className="text-xl font-bold mb-4">{resumeData.filename}</h4>
          <PDFViewer  url={resumeData.fileUrl}/>
        </div>
      </div>
    </div>
  )
}

export default ResumeDetailPage
