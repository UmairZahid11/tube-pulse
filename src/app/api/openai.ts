import { openai } from "@/lib/openai";

export async function resumeAnalyze(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

export async function aiRoadmap(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an API that only responds with raw JSON. 
                  Generate a React flow tree-structured with learning roadmap for the user input position/skills in the **following JSON structure**. Do not include any extra explanation, markdown code block, or formatting — only return the final valid JSON object.

                  Requirements:
                  - Vertical tree structure with meaningful x/y positions with minimum spacing from each other of 150 to form a flow.
                  - Each node width will be 280px and height varies on content but minimum will be 150px so add spacing after calculating all this 
                  - Structure should resemble roadmap.sh layout.
                  - Steps should be ordered from fundamentals to advanced.
                  - Include branching for different specializations (if applicable).
                  - Each node must include: title, short description, and learning resource link.
                  - Use unique IDs for all nodes and edges.
                  - Ensure enough spacing between node positions.

                  JSON Format:
                  {
                    "roadmapTitle": "",
                    "description": "<3–5 Lines>",
                    "duration": "",
                    "initialNodes": [
                      {
                        "id": "1",
                        "type": "turbo",
                        "position": { "x": 0, "y": 0 },
                        "data": {
                          "title": "Step Title",
                          "description": "Short two-line explanation of what the step covers.",
                          "link": "Helpful link for learning this step"
                        }
                      }
                    ],
                    "initialEdges": [
                      {
                        "id": "e1-2",
                        "source": "1",
                        "target": "2"
                      }
                    ]
                  }

                  Return only the final JSON. Do not wrap it in triple backticks or explain anything. The response must be a valid JSON object only.`
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

export async function streamCareerChat(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are a helpful, professional AI Career Coach Agent. Your role is to guide users with questions related to careers...`,
      },
      ...messages,
    ],
  })

  return stream
}

export async function CreatethumbnailPrompt(uploadImageUrls:string | null, userInput: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `
                You're a creative AI assistant helping generate thumbnail prompts for an AI image generator.

                Context:
                - The user is creating a video thumbnail.
                - User description or title: "${userInput}"
                ${uploadImageUrls ? `- A reference image is provided: ${uploadImageUrls}` : ''}

                Instructions:
                1. Based on the video title/description, generate a vivid, detailed prompt suitable for a thumbnail image.
                2. The prompt should include artistic style (e.g. cinematic, vibrant, modern), subject focus (person, object, etc.), mood (dramatic, funny, professional), and composition tips (close-up, centered subject, background blur, etc.).
                3. If a reference image is provided, consider its theme/style while writing the prompt — but do not describe the image literally.
                4. Output only the final thumbnail generation prompt. No extra text.

                Now generate the thumbnail prompt:
                `,
      },
      {
        role: "user",
        content: `Here are the image URLs: ${uploadImageUrls ? uploadImageUrls : "No images provided"}\n\nUser input: ${userInput}\n\nGenerate a concise and engaging thumbnail prompt based on this information.`,
      },
    ],
  });

  return response.choices[0].message.content;
}

export async function CreateAiContent(userInput: string) {

  const AicontentPrompt = `You are an expert YouTube SEO strategist and AI creative assistant. Based on the user input below, generate a JSON response only (no explanation, no markdown, no commentary), containing:
    1. **Three YouTube video titles** optimized for SEO.
    2. **SEO Score** for each title (1 to 100).
    3. **A compelling YouTube video description** based on the topic.
    4. **10 relevant YouTube video tags.**
    5. **Two YouTube thumbnail image prompts**, each including:
        - Professional illustration style based on the video title
        - A short 3–5 word heading that will appear on the thumbnail image
        - Visually compelling layout concept to grab attention

    User Input: ${userInput}

    Return format (JSON only):

    jsonCopyEdit{
    "titles": [
      {
        "title": "Title 1",
        "seo_score": 87
      },
      {
        "title": "Title 2",
        "seo_score": 82
      },
      {
        "title": "Title 3",
        "seo_score": 78
      }
    ],
    "description": "Write a professional and engaging YouTube video description here based on the input.",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
    "image_prompts": [
      {
        "heading": "Heading Text 1",
        "prompt": "Professional illustration for thumbnail image based on Title 1. Include elements such as..."
      },
      {
        "heading": "Heading Text 2",
        "prompt": "Professional illustration for thumbnail image based on Title 2. Include elements such as..."
      }
    ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", 
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: AicontentPrompt },
      ],
      temperature: 0.7,
    });

    // const raw = completion.choices[0].message?.content ?? "";
    // const cleaned = raw.replace(/```json|```/g, "").trim();

    // let parsed = null;

    // try {
    //   parsed = JSON.parse(cleaned);
    // } catch (e) {
    //   console.warn("AI response is not valid JSON. Returning raw content.");
    // }

    // return NextResponse.json(
    //   parsed
    //     ? parsed // valid parsed object
    //     : raw  // fallback: send raw string
    // );
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("AI response content is null or undefined.");
    }
    return JSON.parse(content);
}