# Install Vibe2Spec

Vibe2Spec 0.1.0 includes the coordinator, worker and reviewer skills, specification templates, and read-only Node.js helpers. Install Node.js 24.22.0 or later within major version 24, or 26.11.1 or later within major version 26. No dependency installation or OpenSpec installation is needed.

## Claude Code

Add the repository marketplace, then install its plugin:

```sh
claude plugin marketplace add bao96-bioinfo/Vibe2Spec
claude plugin install vibe2spec@vibe2spec-marketplace
```

Start a new Claude Code session in the project workspace and invoke:

```text
/vibe2spec:vibe2spec I want to develop a reproducible analysis. Interview me before planning the current step.
```

`/vibe2spec:vibe2spec-worker` receives a complete approved handoff. `/vibe2spec:vibe2spec-review` performs a specified review phase in a separate context. The coordinator arranges these roles. Invoking the reviewer in the worker's existing context does not satisfy independence.

Update the catalog and installed package when a new version is available:

```sh
claude plugin marketplace update vibe2spec-marketplace
claude plugin update vibe2spec@vibe2spec-marketplace
```

Remove the installed package with:

```sh
claude plugin uninstall vibe2spec@vibe2spec-marketplace
```

## Codex

Add the same repository using Codex's marketplace interface, then install the plugin:

```sh
codex plugin marketplace add bao96-bioinfo/Vibe2Spec
codex plugin add vibe2spec@vibe2spec-marketplace
```

Start a new Codex session in the project workspace. Invoke the `vibe2spec` skill through the skill picker, or enter `$vibe2spec` followed by the project goal. If the client shows a namespaced skill, select the Vibe2Spec plugin's coordinator. The worker and reviewer skills are named `vibe2spec-worker` and `vibe2spec-review`.

Refresh a Git-backed catalog and install the current package version:

```sh
codex plugin marketplace upgrade vibe2spec-marketplace
codex plugin add vibe2spec@vibe2spec-marketplace
```

Remove the installed package with:

```sh
codex plugin remove vibe2spec@vibe2spec-marketplace
```

These commands target the verified Codex command-line interface. Desktop marketplace availability depends on the client surface. An official directory listing is a separate publication route. See [host compatibility](host-compatibility.md) for the tested versions and limits of the observations.

## Local checkout and verification

A local checkout also supports actual marketplace installation. After cloning the repository, substitute its absolute path for `bao96-bioinfo/Vibe2Spec` in the marketplace-add commands above. The committed `plugins/vibe2spec/` package is self-contained. You do not need to build it to install. Codex reads local catalogs directly, so `marketplace upgrade` is unnecessary for a local source; repeat `plugin add` after the source version changes.

From a development checkout, run:

```sh
npm test
npm run demo
npm run build
```

The build regenerates the shared host package from source. Each host installs the same skills, helpers and templates. Node.js scripts have no package dependencies. The demonstration contains fictional choices and does not approve work in a real project.

## Project data and capability gaps

The coordinator asks for the workspace and record-store location before writing project evidence. Project records belong in that workspace, outside the installed plugin cache. Updating or removing the plugin preserves those workspace files. A new session can resume from the exact selected project record in either host.

A missing Node.js runtime leaves helper checks pending. Missing research access leaves source-dependent decisions unresolved. If native delegation cannot supply a separate reviewer, the coordinator prepares a handoff for a separate review session. Missing review cannot be replaced by a self-review or a successful helper report. See [review](review.md) and [validation](validation.md) for the operational details.

The installation formats follow the official [Claude marketplace documentation](https://code.claude.com/docs/en/plugin-marketplaces) and [OpenAI plugin packaging documentation](https://developers.openai.com/plugins/build/plugins). The local host observations are retained in [release evidence](release/host-install-observation.json).
