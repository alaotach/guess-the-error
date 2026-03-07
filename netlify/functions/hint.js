exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    let errorCode, mode;
    try {
        ({ errorCode, mode } = JSON.parse(event.body));
    } catch {
        return { statusCode: 400, body: "Invalid JSON" };
    }

    const imageUrl = mode === "cat"
        ? `https://http.cat/${errorCode}`
        : `https://http.dog/${errorCode}.jpg`;

    const response = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: `Provide a hint about HTTP error code ${errorCode} without revealing the actual code. for guessing image game.` },
                    { type: "image", image_url: imageUrl }
                ]
            }],
            max_tokens: 100,
            temperature: 0.7
        })
    });

    const data = await response.json();
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hint: data.choices[0].message.content })
    };
};
