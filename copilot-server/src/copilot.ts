import { CompletionCopilot, CompletionRequestBody } from 'monacopilot';

const copilot = new CompletionCopilot(process.env.AI_API_KEY, {
  provider: 'mistral',
  model: 'codestral'
});

export async function copilotCompletion(body: CompletionRequestBody) {
  return await copilot.complete({
    body
  });
}
