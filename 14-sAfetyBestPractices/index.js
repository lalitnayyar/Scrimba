import OpenAI from "openai";

const openai = new OpenAI({
    dangerouslyAllowBrowser: true
});

async function main() {
  // Relevant for both inputs and outputs
  const completion = await openai.moderations.create({
    input: "I hate you!",
    user: 'user_123432423'
  });
  const {flagged, categories} = completion.results[0];
  // console.log("flagged", flagged);
  // console.log("categories", categories);

  if (flagged) {
      renderWarning(categories);
  }
}

main();

function renderWarning(obj) {
  const keys = Object.keys(obj);
  const filtered = keys.filter((key) => obj[key]);
  document.body.innerText =
    `Your response has been flagged for the following reasons: ${filtered.join(", ")}.`
}

