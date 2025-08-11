import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resumeAnalyze } from "../../openai";

export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const awaitedParams =  await params 
    const resumeId = awaitedParams.id;

    // Fetch the resume record
    const [rows]: any = await db.query(
      "SELECT * FROM resumes WHERE id = ? LIMIT 1",
      [resumeId]
    );

    if (!rows.length) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    let resume = rows[0];

    // If status is processing → run AI analysis
    if (resume.status === "processing") {
      const prompt = `
You are an advanced AI Resume Analyzer Agent.

Your task is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format.

📤 INPUT: I will provide a plain text resume.

🎯 GOAL: Output a JSON report as per the schema below. The report should reflect:

overall_score (0–100)
overall_feedback (short message e.g., "Excellent", "Needs improvement")
summary_comment (1–2 sentence evaluation summary)
Section scores for:
Contact Info
Experience
Education
Skills
Each section should include:
score (as percentage)
Optional comment about that section
Tips for improvement (3–5 tips)
What’s Good (1–3 strengths)
Needs Improvement (1–3 weaknesses)

🧠 Output JSON Schema:

{
  "overall_score": 85,
  "overall_feedback": "Excellent!",
  "summary_comment": "Your resume is strong, but there are areas to refine.",
  "sections": {
    "contact_info": { "score": 95, "comment": "Perfectly structured and complete." },
    "experience": { "score": 88, "comment": "Strong bullet points and impact." },
    "education": { "score": 70, "comment": "Consider adding relevant coursework." },
    "skills": { "score": 60, "comment": "Expand on specific skill proficiencies." }
  },
  "tips_for_improvement": [
    "Add more numbers and metrics to your experience section to show impact.",
    "Integrate more industry-specific keywords relevant to your target roles.",
    "Start bullet points with strong action verbs to make your achievements stand out."
  ],
  "whats_good": [
    "Clean and professional formatting.",
    "Clear and concise contact information.",
    "Relevant work experience."
  ],
  "needs_improvement": [
    "Skills section lacks detail.",
    "Some experience bullet points could be stronger.",
    "Missing a professional summary/objective."
  ]
}

Now analyze this resume and output only JSON:
---
${resume.resume_text}
`;
        
        const aiResponse = await resumeAnalyze(prompt)

        let parsedAnalysis;
        try {
            if(aiResponse){
                parsedAnalysis = JSON.parse(aiResponse);
            }
        } catch (e) {
            console.error("Error parsing AI response:", e);
            parsedAnalysis = {};
        }

        // Save analysis_result and mark as completed
        await db.query(
            "UPDATE resumes SET analysis_result = ?, status = 'completed' WHERE id = ?",
            [JSON.stringify(parsedAnalysis), resumeId]
        );

        // Update local object to return
        resume.analysis_result = parsedAnalysis;
        resume.status = "completed";
    }

    return NextResponse.json(resume);
  } catch (err) {
    console.error("[RESUME_DETAIL_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
