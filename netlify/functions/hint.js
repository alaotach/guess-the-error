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
                    { type: "text", text: `You are a hint generator for an HTTP status code guessing game. The code is ${errorCode}. Give a single short hint about what this status code means. RULES: never mention the number ${errorCode}, never say the words "status code" or "error code", do not say "without revealing" or anything meta. Just give the hint directly.` },
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
