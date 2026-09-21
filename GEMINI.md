# Rules & Constraints

- **Do NOT use the built-in browser tool / browser subagent**: Do not attempt to use the IDE's built-in browser (`browser_subagent` / built-in preview) for testing, fetching, or interacting with web pages.
- **Permission & Autonomy Policy**: Do NOT ask for permission or prompt the user for routine tasks, file edits, reading files, running dev server, or building/testing. ONLY request permission for:
  1. `git push` or `git pull`
  2. Credential/ID/Password operations
  3. Destructive deletions of files or critical data
