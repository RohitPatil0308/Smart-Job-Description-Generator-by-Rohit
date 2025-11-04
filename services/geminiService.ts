import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function* generateJobDescriptionStream(jobTitle: string, skills: string, experience: string): AsyncGenerator<string> {
  const prompt = `
    As an expert AI HR assistant, generate a professional and engaging job description suitable for a LinkedIn post.

    The job description should be based on the following details:
    - **Job Title:** ${jobTitle}
    - **Key Skills & Technologies:** ${skills}
    - **Required Experience:** ${experience}

    The output should be well-structured and include the following sections in this order:
    1.  **Introduction:** A brief, exciting overview of the role and our company. Use a positive and welcoming tone.
    2.  **Key Responsibilities:** A bulleted list of the main duties and tasks for this position. Use action verbs.
    3.  **Qualifications & Skills:** A bulleted list detailing the necessary skills, qualifications, and experience.
    4.  **Why Join Us?:** A short paragraph about our company culture, benefits, or what makes us a great place to work.

    Format the entire output in Markdown for easy readability. Ensure the formatting is clean with clear headings and bullet points. Do not include any introductory or concluding text outside of the job description itself, such as "Here is the job description you requested:".
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating job description:", error);
    throw new Error("Failed to communicate with the AI model. Please check your connection and API key.");
  }
};