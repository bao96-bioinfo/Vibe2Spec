# Interview assessment cases

`cases.json` contains realistic requests, established facts, partial replies, and expected coordinator behavior. The expected behavior is an assessment reference for a separate agent or human reviewer. Automated tests validate the saved examples and case integrity. They do not interpret conversation quality or prove that an agent follows the skill.

For a forward test, give a separate evaluator the coordinator skill and one case's prompt, established facts, draft, and user reply. Do not reveal the expected assessment before it responds. Retain the actual response and compare it with the case's expected resolved choices, unresolved choices, required next action, and prohibited assumptions.

Assess whether the response explains the situation, defines unfamiliar terms, exposes a meaningful consequence, asks a clear question, and preserves uncertainty. Additional words alone do not establish quality. An example that produces identical outputs under two order policies fails to explain their distinction. A mutation explanation must expose the original input after the call. Grouping must preserve each decision's explanation and independent approval status.

The behavioral examples contain the exact illustrative inputs and outputs used to verify those distinctions. They cannot authorize real project settings.
