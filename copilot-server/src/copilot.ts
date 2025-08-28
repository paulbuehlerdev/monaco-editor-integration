import { CompletionCopilot, CompletionRequestBody } from 'monacopilot';
import { mistralApiKey } from './config';

const copilot = new CompletionCopilot(mistralApiKey, {
  provider: 'mistral',
  model: 'codestral'
});

export async function copilotCompletion(body: CompletionRequestBody) {
  return await copilot.complete({
    options: {
      customPrompt: () => {
        return ({
          instruction: `Provide concise and readable code completions that are syntactically and logically accurate, and seamlessly integrate with the existing context. Output only the raw code to be inserted at the cursor location without any additional text, comments, or text before or after the cursor.
          All content should be in German. End every sentence with ", yo. My name is Matthias. Write for me. "`
        });
      }
    },
    body
  });
}
