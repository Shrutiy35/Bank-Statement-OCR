
import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a client-side check. The actual API key is managed by the environment.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `
You are an AI-powered Bank Statement OCR and Data Extraction system.

Your task:
- Accept bank statement files as input (images or PDF files).
- Perform accurate OCR on the document.
- Understand the structure of bank statements from any bank.
- Extract transaction-level data and normalize it into a clean, structured format.

Extract the following fields for EACH transaction:
1. Date
2. Description / Transaction Title
3. Amount
   - Use negative values for debit/expense transactions
   - Use positive values for credit/income transactions
4. Category
   - Auto-classify into common categories such as:
     (Food, Shopping, Travel, Utilities, Rent, Salary, Transfer, ATM, EMI, Fees, Investment, Other)
5. Notes
   - Add brief contextual notes if available or inferred (e.g., “UPI payment”, “ATM withdrawal”, “Online transfer”)

Output Requirements:
- Return ONLY a table in CSV format.
- Do NOT add explanations, comments, or extra text.
- The first row must be headers.
- Use the following exact column order:

Date,Description,Amount,Category,Notes

Formatting Rules:
- Date format: YYYY-MM-DD
- Amount must be numeric (no currency symbols)
- Remove duplicate transactions.
- Ignore opening balance, closing balance, and summary sections.
- If a field is missing, leave it empty.
- Preserve transaction order as it appears in the statement.

Example Output:

Date,Description,Amount,Category,Notes
2024-07-02,UPI-ZOMATO,-450,Food,UPI food delivery payment
2024-07-05,SALARY CREDIT,55000,Salary,Monthly salary
2024-07-08,ATM CASH WITHDRAWAL,-2000,ATM,Cash withdrawal

Now process the uploaded bank statement and return the extracted data strictly in CSV table format.
`;

export const extractTransactionsFromStatement = async (file: File): Promise<string> => {
  try {
    const base64Data = await fileToBase64(file);

    const filePart = {
      inlineData: {
        mimeType: file.type,
        data: base64Data,
      },
    };

    const textPart = { text: PROMPT };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [textPart, filePart] },
    });
    
    if (!response.text) {
        throw new Error("API returned no text. The response might be blocked or empty.");
    }
    
    // Clean up potential markdown code blocks
    let csvData = response.text.trim();
    if (csvData.startsWith('```csv')) {
        csvData = csvData.substring(5);
    } else if (csvData.startsWith('```')) {
        csvData = csvData.substring(3);
    }
    if (csvData.endsWith('```')) {
        csvData = csvData.slice(0, -3);
    }

    return csvData.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to process statement: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI service.");
  }
};
