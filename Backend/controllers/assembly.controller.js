const createAssemblyToken = async (req, res) => {
  try {
    const rawApiKey = process.env.ASSEMBLY_API;
    const apiKey = (rawApiKey || "").trim().replace(/^['"]|['"]$/g, "");


    if (!apiKey) {
      return res.status(500).json({
        error: "Missing ASSEMBLY_API in environment variables.",
      });
    }

    const tokenUrl = new URL("https://streaming.assemblyai.com/v3/token");
    tokenUrl.searchParams.set("expires_in_seconds", "600");

    const requestInit = {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    };

    let response = await fetch(tokenUrl, requestInit);

    if (response.status === 401) {
      response = await fetch(tokenUrl, {
        ...requestInit,
        headers: {
          ...requestInit.headers,
          Authorization: `Bearer ${apiKey}`,
        },
      });
    }

    if (!response.ok) {
      const details = await response.text();
      return res.status(response.status).json({
        error: "Failed to create AssemblyAI realtime token.",
        hint: `ASSEMBLY_API loaded (length=${apiKey.length}, startsWith=${apiKey.slice(0, 4)}...)`,
        details,
      });
    }

    const data = await response.json();

    return res.json({
      token: data.token,
      sessionId: `asm-${Date.now()}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected error while creating AssemblyAI token.",
      details: error.message,
    });
  }
};

module.exports = createAssemblyToken;
