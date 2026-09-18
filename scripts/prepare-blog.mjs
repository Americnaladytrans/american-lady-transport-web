import fs from "node:fs/promises";
const posts = JSON.parse(await fs.readFile("src/data/blog-posts.json", "utf8"));
const summaries = posts.map(({content, ...summary}) => summary);
await fs.writeFile("src/data/blog-summaries.json", JSON.stringify(summaries));
