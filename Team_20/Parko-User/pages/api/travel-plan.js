import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import connectDB from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { destination, days, notes } = req.body;

  try {
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Plan a structured and precise ${days}-day trip to ${destination}.  
                  Use **emojis** for an engaging format and ensure **proper line breaks after each item**.  

                  Provide a **detailed itinerary** including **exact timings, places to visit, activities, and food recommendations**.  

                  The response must be **properly spaced** and **formatted for readability**.  

                  **Format:**
                  - **Day 1:**  
                    
                    🏰 **8:00 AM - 10:00 AM**: [Main attraction]  
                    
                    🎭 **10:30 AM - 12:30 PM**: [Cultural/historic site]  
                    
                    🍽 **1:00 PM - 2:00 PM**: [Lunch recommendation]  
                    
                    🖼 **3:00 PM - 5:00 PM**: [Museum/afternoon visit]  
                    
                    🌅 **6:00 PM - 8:00 PM**: [Evening leisure/dinner]  
                    
                  - **Day 2:** (Follow the same format)  

                  **Additional Notes:**  
                  ${notes}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    const aiData = await aiResponse.json();

    console.log("AI Response:", JSON.stringify(aiData, null, 2));

    if (!aiData.candidates || aiData.candidates.length === 0 || !aiData.candidates[0].content.parts[0].text) {
      return res.status(500).json({ error: "Invalid AI response", details: aiData });
    }

    // Format response for readability
    const formattedPlan = aiData.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold** to <strong>
      .replace(/- (.*?)(\n|$)/g, "<li style='margin-bottom: 15px;'>$1</li>") // Convert - list to <li>
      .replace(/\n{2,}/g, "</p><br><p>") // Add spacing between paragraphs
      .replace(/\n/g, "<br>"); // Ensure line breaks are properly converted

    // Store the travel plan in MongoDB
    const db = await connectDB();
    const newPlan = {
      userEmail: session.user.email,
      destination,
      days,
      notes,
      planHtml: `<div class="travel-plan"><p>${formattedPlan}</p></div>`,
      createdAt: new Date(),
    };

    const result = await db.collection("plans").insertOne(newPlan);

    res.status(200).json({
      message: "Plan saved successfully",
      planId: result.insertedId,
      plan: newPlan.planHtml, // 🛠 FIXED: Changed key to 'plan' so frontend can access it
    });

  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
