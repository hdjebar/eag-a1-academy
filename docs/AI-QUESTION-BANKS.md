# AI-assisted question-bank workflow

This repository treats model output as untrusted candidate material.

1. Configure an OpenAI-compatible provider with repository secrets `AI_API_URL` and `AI_API_KEY`, plus repository variable `AI_MODEL`.
2. Run **Actions → Generate candidate test bank → Run workflow**.
3. The workflow generates JSON, performs an independent model review, validates structure, uploads an artifact, and opens a pull request.
4. A human reviewer checks every item before merge.
5. Move accepted items to `data/approved/`, set `reviewStatus` to `approved`, and reject or rewrite the rest.

Never paste API keys into code, workflow files, issues, logs, or pull requests. Do not merge a generated bank merely because automated checks pass.
