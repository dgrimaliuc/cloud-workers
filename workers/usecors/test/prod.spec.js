const { expect } = require("@jest/globals");
const { config } = require("../config");
const { urlHTML, streamURL, streamParams, requiredHeaders } = require("./test-data");
const prod = config.prod;

describe("prod tests", () => {
  test("prod get html test", async () => {
    const re = await fetch(`${prod.url}/${urlHTML}`, {
      headers: requiredHeaders,
    });
    const responseBody = await re.text();

    console.log("responseBody: ", responseBody);
    expect(responseBody).toContain("b-search__section_title");
  });

  test("url prod get html test", async () => {
    const re = await fetch(
      `https://usecors.nodeapp.workers.dev/https://hdrezka.ag/films/horror/67660-omen-neporochnaya-2024.html`,
      {
        headers: {
          Origin: "https://neonstream-git-cors-server-setted-denis-projects-8a211662.vercel.app",
        },
      }
    );
    const responseBody = await re.text();

    console.log("responseBody: ", responseBody);
    // expect(responseBody).toContain("b-search__section_title");
  });

  test("prod get stream test", async () => {
    const re = await fetch(`${prod.url}/${streamURL}`, {
      method: "POST",
      headers: {
        ...requiredHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(streamParams),
    });
    const responseBody = await re.json();
    console.log("responseBody: ", responseBody);
    expect(responseBody.success).toBe(true);
    expect(responseBody.url).toBeDefined();
    expect(responseBody.url.length).toBeGreaterThan(10);
  });
});
