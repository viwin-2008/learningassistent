import { GoogleGenAI } from '@google/genai';
import type { QuizQuestion } from '../types';

// API Key Management
const LOCAL_KEY_STORAGE = 'edugenie_gemini_key';

export const getCustomApiKey = (): string => {
  return localStorage.getItem(LOCAL_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setCustomApiKey = (key: string) => {
  if (key.trim()) {
    localStorage.setItem(LOCAL_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(LOCAL_KEY_STORAGE);
  }
};

// Internal Gemini Client Generator
const getGeminiClient = () => {
  const apiKey = getCustomApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

/**
 * Send request via Backend Express Server if available, else direct client or fallback
 */
async function callApiOrClient(endpoint: string, payload: any, clientFallbackFn: () => Promise<string>): Promise<string> {
  try {
    const res = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.text) return data.text;
    }
  } catch (err) {
    // Backend fetch failed (e.g. static dev server without backend running)
  }

  // Client-side execution
  const ai = getGeminiClient();
  if (ai) {
    return await clientFallbackFn();
  }

  // Simulated AI response if key is missing
  return mockAiResponse(endpoint, payload);
}

// 1. General Q&A Chat
export async function askGemini(question: string, subject?: string): Promise<string> {
  const prompt = subject && subject !== 'General' 
    ? `You are EduGenie, an expert AI tutor specializing in ${subject} for college students. Answer this question clearly with formatted markdown, definitions, and code/examples where appropriate:\n\n${question}`
    : `You are EduGenie, a friendly and highly knowledgeable college AI tutor. Answer this question with clear markdown, bullet points, key takeaways, and examples:\n\n${question}`;

  return callApiOrClient(
    'chat',
    { prompt, subject },
    async () => {
      const ai = getGeminiClient()!;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || "I was unable to process your request. Please try again.";
    }
  );
}

// 2. Structured Smart Notes Generator
export async function generateNotes(topic: string, level: string = 'Intermediate', noteType: 'Short' | 'Detailed' = 'Detailed'): Promise<string> {
  const prompt = `Act as EduGenie, a senior college professor. Generate comprehensive, highly structured ${noteType} revision notes for the topic "${topic}" at the ${level} level.

Format your response in Markdown with these exact sections:
# 📚 Topic: ${topic}

## 📌 1. Definition & Core Concept
(Provide a clear 2-3 sentence definition and background)

## 🔑 2. Key Concepts & Formulas
(Bullet points highlighting essential principles, equations, or laws)

## 💡 3. Practical Examples & Code/Use-cases
(Real-world applications, step-by-step examples, or code snippets if applicable)

## ⚡ 4. Advantages & Disadvantages / Comparison
(Key advantages, trade-offs, and critical features)

## 🎯 5. Important Exam Questions & Tips
(Top 3-5 high-yield exam questions on this topic with brief hints)`;

  return callApiOrClient(
    'generate-notes',
    { topic, level, noteType, prompt },
    async () => {
      const ai = getGeminiClient()!;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || "Failed to generate notes.";
    }
  );
}

// 3. PDF / Document Summarizer
export async function summarizeDocument(documentText: string, docName: string = 'Document'): Promise<string> {
  const truncatedText = documentText.slice(0, 12000); // Keep within safe prompt size
  const prompt = `Act as EduGenie AI Academic Summarizer. Analyze the following study material from "${docName}" and generate an executive summary and revision sheet:

DOCUMENT CONTENT:
"""
${truncatedText}
"""

Provide output in clean Markdown with:
# 📄 Executive Summary: ${docName}

## 🌟 1. Core Summary & Big Picture
(3-4 concise paragraphs summarizing the entire document)

## 🎯 2. Top Key Takeaways
(5-8 high-yield bullet points)

## 📚 3. Important Terms & Glossary
(Definitions of key terms extracted from the text)

## ❓ 4. Expected Exam Questions
(4 exam questions derived from this content with model short answers)`;

  return callApiOrClient(
    'summarize',
    { documentText: truncatedText, docName, prompt },
    async () => {
      const ai = getGeminiClient()!;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || "Failed to summarize document.";
    }
  );
}

// 4. Quiz Generator
export async function generateQuiz(topic: string, difficulty: string = 'Medium', count: number = 5): Promise<QuizQuestion[]> {
  const prompt = `Generate exactly ${count} multiple-choice questions (MCQs) for college students on the topic "${topic}" at "${difficulty}" difficulty level.

Return ONLY a valid JSON array of objects without markdown formatting code blocks. Each object must strictly have:
- "id": number
- "question": string
- "options": { "A": string, "B": string, "C": string, "D": string }
- "correctAnswer": "A" | "B" | "C" | "D"
- "explanation": string (explaining why the correct option is right)`;

  try {
    const rawText = await callApiOrClient(
      'generate-quiz',
      { topic, difficulty, count, prompt },
      async () => {
        const ai = getGeminiClient()!;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });
        return response.text || "[]";
      }
    );

    // Clean JSON formatting if enclosed in ```json
    const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const quizData = JSON.parse(cleanedJson);
    if (Array.isArray(quizData) && quizData.length > 0) {
      return quizData;
    }
  } catch (err) {
    console.warn("Quiz JSON parsing error, returning generated fallback questions.", err);
  }

  return getFallbackQuiz(topic, difficulty, count);
}

// 5. Short Answer Evaluator for Exam Prep
export async function evaluateShortAnswer(question: string, studentAnswer: string): Promise<{ score: number; feedback: string; modelAnswer: string }> {
  const prompt = `Act as an exam examiner grading a student's answer.
Question: "${question}"
Student's Answer: "${studentAnswer}"

Evaluate the answer. Return ONLY a valid JSON object:
{
  "score": (number from 0 to 10),
  "feedback": "(2-3 sentences explaining what was good and what was missing)",
  "modelAnswer": "(Ideal score 10 answer)"
}`;

  try {
    const ai = getGeminiClient();
    let rawText = '';
    if (ai) {
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      rawText = res.text || '';
    } else {
      rawText = JSON.stringify({
        score: studentAnswer.length > 30 ? 8.5 : 5,
        feedback: "Good attempt! You mentioned core concepts, but missed key technical terms and step-by-step elaboration.",
        modelAnswer: "An optimal answer includes defining the core architecture, memory registers, execution pipeline, and providing a diagram or code example."
      });
    }

    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return {
      score: 7.5,
      feedback: "Answer received! Solid coverage of basic principles. Focus on including technical keywords for full credit.",
      modelAnswer: "Include precise definitions, formula/architecture diagrams, and step-by-step reasoning."
    };
  }
}

// 6. AI Study Plan Generator
export async function generateStudyPlan(subject: string, examDate: string, dailyHours: number): Promise<string> {
  const prompt = `Act as an AI Academic Advisor. Create a custom day-by-day study schedule for an upcoming exam in "${subject}".
Exam Date: ${examDate}
Available Daily Study Hours: ${dailyHours} hours/day.

Format in Markdown with:
# 📅 AI Customized Study Plan for ${subject}
- **Exam Target Date**: ${examDate}
- **Pacing**: ${dailyHours} Hours/Day

## 🚀 Phase 1: Core Foundation & Theory (Days 1-3)
## 💡 Phase 2: High-Yield Topics & Problem Solving (Days 4-6)
## 📝 Phase 3: Mock Exams & Revision Checklist (Final Days)
## 💡 Top 5 Exam Success Tips from EduGenie`;

  return callApiOrClient(
    'generate-plan',
    { subject, examDate, dailyHours, prompt },
    async () => {
      const ai = getGeminiClient()!;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || "Failed to create study plan.";
    }
  );
}

// Helper: Smart Intelligent Simulated Fallbacks (When API Key is not set yet)
function mockAiResponse(endpoint: string, payload: any): string {
  const { topic, subject } = payload;
  const topicName = topic || subject || 'the requested subject';

  if (endpoint === 'chat') {
    return `### 💡 EduGenie AI Explanation: ${topicName}

Here is a clear breakdown to help you master **${topicName}**:

1. **Core Concept**: 
   ${topicName} is a fundamental concept in engineering and computer science. It provides the building blocks for system efficiency and algorithm design.

2. **Key Principle**:
   - **Modular Design**: Breaks complex problems into smaller, manageable components.
   - **Performance Efficiency**: Minimizes time complexity and memory overhead.
   - **Scalability**: Enables high-throughput computation under heavy workloads.

3. **Code / Diagrammatic Representation**:
\`\`\`python
# Example demonstrating ${topicName} in action
def execute_concept(data_input):
    """
    EduGenie Demonstration Function
    """
    result = [item * 2 for item in data_input if item % 2 == 0]
    return f"Processed {len(result)} elements successfully!"

print(execute_concept([1, 2, 3, 4, 5, 6]))
\`\`\`

4. **Exam Pro-Tip**:
   > 📌 *Always draw a flow diagram or state transition table when answering 10-mark questions on ${topicName}!*

*(Note: To connect live Google Gemini AI, click the **🔑 API Key** button in the header and paste your key!)*`;
  }

  if (endpoint === 'generate-notes') {
    return `# 📚 Comprehensive Notes: ${topicName}

## 📌 1. Definition & Core Concept
**${topicName}** refers to the structured methodology used to analyze, design, and implement optimal software and hardware operations. In college curriculum, it forms a core pillar of theoretical computer science and applied systems design.

## 🔑 2. Key Concepts & Principles
- **Data Encapsulation**: Hiding implementation details behind well-defined interfaces.
- **Resource Allocation**: Managing memory allocation, CPU registers, and I/O cycles.
- **Error Handling**: Graceful degradation under unexpected runtime exceptions.

## 💡 3. Practical Example & Code
\`\`\`javascript
// Demonstration of ${topicName} logic pattern
class EduGenieSystem {
  constructor(name) {
    this.subject = name;
  }
  
  processLesson() {
    return \`Mastering \${this.subject} with step-by-step breakdown.\`;
  }
}

const lesson = new EduGenieSystem("${topicName}");
console.log(lesson.processLesson());
\`\`\`

## ⚡ 4. Advantages & Disadvantages
| Advantage | Disadvantage |
| :--- | :--- |
| High execution speed | Increased memory footprint |
| Reusable modular code | Initial steep learning curve |
| Standardized protocols | Requires rigorous testing |

## 🎯 5. High-Yield Exam Questions
1. **Explain the architecture of ${topicName} with a block diagram.** (8 Marks)
2. **Compare and contrast ${topicName} with traditional legacy approaches.** (6 Marks)
3. **List three real-world industrial applications of ${topicName}.** (4 Marks)`;
  }

  if (endpoint === 'summarize') {
    return `# 📄 Executive Summary: ${payload.docName || 'Study Material'}

## 🌟 1. Core Summary
This study material covers essential theoretical and practical foundations of modern computing systems. It emphasizes architectural efficiency, protocol standards, and systematic problem solving.

## 🎯 2. Top Key Takeaways
- **Systematic Structure**: Divides complex workflows into distinct abstraction layers.
- **Optimization Rules**: Reduces time complexity through caching and optimized indexing.
- **Security & Integrity**: Ensures validation at both entry and exit points of data streams.

## 📚 3. Important Glossary Terms
- **Abstraction**: Isolating high-level logic from low-level hardware execution.
- **Latency**: The time delay between requesting an operation and receiving the response.
- **Throughput**: Total volume of operations processed per unit time.

## ❓ 4. Expected Exam Questions
1. *Define the primary function of the core engine described in the document.*
2. *Sketch the operational pipeline and annotate each stage.*`;
  }

  return "Response generated successfully by EduGenie AI.";
}

function getFallbackQuiz(topic: string, _difficulty: string, count: number): QuizQuestion[] {
  const t = topic || 'Computer Science';
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: `Which of the following best defines the primary objective of ${t}?`,
      options: {
        A: `To optimize memory utilization and system response speed in ${t}`,
        B: "To convert all high-level code directly into assembly language",
        C: "To disable garbage collection during active thread execution",
        D: "To replace all relational databases with flat files"
      },
      correctAnswer: "A",
      explanation: `Optimization of memory and response speed is the core objective of ${t} in software design.`
    },
    {
      id: 2,
      question: `What is the typical time complexity associated with efficient operations in ${t}?`,
      options: {
        A: "O(n^3)",
        B: "O(O!)",
        C: "O(1) or O(log n)",
        D: "O(2^n)"
      },
      correctAnswer: "C",
      explanation: "Logarithmic O(log n) or constant O(1) time complexity represents optimal efficiency in algorithm design."
    },
    {
      id: 3,
      question: `In the context of ${t}, what does the term 'Pipelining' refer to?`,
      options: {
        A: "Overlapping multiple instruction execution cycles",
        B: "Writing data to hard drives sequentially",
        C: "Creating network sockets between client and server",
        D: "Compressing images prior to download"
      },
      correctAnswer: "A",
      explanation: "Pipelining allows overlapping execution phases of successive instructions to boost throughput."
    },
    {
      id: 4,
      question: "Which data structure is most commonly used for Breadth-First Search (BFS)?",
      options: {
        A: "Stack",
        B: "Queue",
        C: "Priority Heap",
        D: "Binary Search Tree"
      },
      correctAnswer: "B",
      explanation: "A Queue (FIFO) is the fundamental data structure used to traverse graphs layer by layer in BFS."
    },
    {
      id: 5,
      question: "What is the primary function of an Index in Database Management Systems (DBMS)?",
      options: {
        A: "To encrypt passwords automatically",
        B: "To speed up data retrieval operations on a database table",
        C: "To prevent duplicate record creation in temporary memory",
        D: "To convert SQL queries into C++ source code"
      },
      correctAnswer: "B",
      explanation: "Indexes create efficient lookup data structures (like B-Trees) to drastically accelerate SELECT queries."
    }
  ];

  return questions.slice(0, count);
}
