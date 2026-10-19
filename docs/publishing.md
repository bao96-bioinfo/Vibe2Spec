# Distribution and publication

The repository contains a project-maintained marketplace for Claude Code at `.claude-plugin/marketplace.json` and for Codex at `.agents/plugins/marketplace.json`. Both select `plugins/vibe2spec/`. The package includes a portable root manifest and compatibility manifests for each host. Sources under `packaging/` define the host metadata; `npm run build` assembles the shared package.

The initial version is `0.1.0`. The package name is `vibe2spec`; the marketplace name is `vibe2spec-marketplace`. These identifiers remain stable across versions. Update the source package version, both host manifest versions and the Claude catalog version together. Rebuild and run the package-content tests before distributing a changed version.

## Submission materials

The generated archive at `dist/vibe2spec-0.1.0.zip` contains the self-contained package. Its root manifest declares the Agent Plugins schema, publisher identity, description, category, starter prompts and square vector icon. The Claude compatibility manifest is included. The [listing copy](release/listing.md), [review scenarios](release/submission-cases.json), [verification report](release/verification.md), and the existing illustrative cartoon support a submission review.

This is a skills-only package with local Node.js helpers. It has no bundled Model Context Protocol server, remote service authentication, commerce flow or hosted data store. Model Context Protocol is a standard interface through which an agent can call an external tool server. The package itself does not introduce one.

The public OpenAI directory uses a developer submission and review process described in [Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission). The current manifest includes the skills-only listing information and image. A publisher must choose the verified developer identity, review the portal's current requirements, accept applicable terms, and submit through their account. Claude's public marketplace inclusion likewise requires the publisher's submission through the [official publishing route](https://code.claude.com/docs/en/plugins/publish).

No official directory submission, approval, or published listing is claimed. Local marketplace installation and archive preparation do not establish those external states. The package and listing materials are prepared for the publisher's review; the actual submission remains a separately authorized action.

## Data handling

Helpers read only explicitly selected project records and referenced files within the approved locations. They print reports and do not send project content to a package-operated server. The host model processes the content supplied to it under that host's settings and service terms. Research performed by the agent can use the host's configured browsing tools. Those host capabilities remain subject to project approval and access controls.

Project records remain in the selected workspace. Plugin update and removal affect the installed package cache. Preserve accepted project evidence through ordinary project storage and version-control practices.

## Reproduce the archive

Build the package from the repository root with `npm run build`. The following commands use the developer's ZIP utility to create a submission archive; that utility is not a plugin runtime dependency.

```sh
mkdir -p dist
cd plugins/vibe2spec
zip -qrX ../../dist/vibe2spec-0.1.0.zip .
```

Return to the repository root and run `unzip -t dist/vibe2spec-0.1.0.zip` to check archive integrity. The archive root contains `plugin.json`, both host compatibility manifests, skills, templates, helpers and their documentation. Official review can impose additional account-specific requirements at submission time.
