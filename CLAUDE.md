# Project Rules

## Composio / Contentful

- **Never call `COMPOSIO_MANAGE_CONNECTIONS`** for the `contentful` toolkit unless a tool call explicitly fails with "No active connection found". The Contentful connection is already active — do not re-initiate auth or generate new tokens proactively.
- **Never call `COMPOSIO_SEARCH_TOOLS` with `generate_id: true`** after the first call in a session. Always reuse the existing session ID to avoid losing the active connection context.
- When making Contentful Management API calls, prefer `proxy_execute` in `COMPOSIO_REMOTE_WORKBENCH` over individual Composio tools — it's more reliable and doesn't trigger session issues.

## Architecture

- Section infrastructure lives in `lib/sections/` (config, types, registry, renderer, definitions)
- Section UI components live in `components/sections/` (pure UI only)
- Section definitions (hydrate + render wiring) live in `lib/sections/definitions/`
- GraphQL fragments and queries live in `lib/contentful/graphql/` organized by content type
- Common reusable components live in `components/common/`
- Follow the skeleton + hydrate pattern for all Contentful data fetching
- Use `frontEndComponent` field for variant dispatch within section components
