# AI-assisted editing guide

Use Pages CMS for ordinary content changes. It is the safest workflow for people
who do not work in code: open the **Website pages** section, edit **Homepage**
or **Gallery**, preview the text carefully, and save. The CMS commits the change
and GitHub Pages publishes it automatically.

## Using ChatGPT or Claude for content

Ask an AI to draft or revise copy, then have an editor paste the final text into
Pages CMS. Include the page, audience, desired tone, length, and facts that must
remain unchanged. Treat AI output as a draft: a Penn KDSAP member must verify
medical statements, names, dates, links, and image permissions before publishing.

Example prompt:

> Rewrite this Gallery introduction for prospective volunteers in 35–45 words.
> Keep every factual claim, use plain language, and do not add medical advice:
> [paste the current text]

## Using an AI coding tool for site changes

For layout, navigation, accessibility, or new editable fields, use a GitHub
branch and pull request. Give collaborators repository access appropriate for
reviewing pull requests; do not share an owner account or a personal access token.

Each contributor connects Claude or ChatGPT to *their own* GitHub account, then
grants that tool access to this repository from its integration settings. They
should clone or select the repository, create a branch, describe the desired
page/element, and open a pull request. The repository includes
[`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md), and a pull-request template
so AI tools and reviewers receive the same build and safety rules.

Tell the AI tool to work only in the requested content or feature area, run
`npm run verify:site`, and open a pull request. A maintainer should review the
deployed preview and the diff before merging. GitHub branch protection for
`main` should require a pull request and one maintainer approval.

AI tools and CMS editors must not change these without a maintainer's explicit
approval:

- `.github/workflows/` (deployment)
- `scripts/` and `public/js/` (site behavior)
- `.pages.yml` (CMS permissions and fields)
- credentials, API keys, or third-party form settings

## Editorial roles

- **Content editor:** invited to Pages CMS; can edit approved fields and media.
- **Maintainer:** GitHub access; reviews CMS commits and pull requests, and
  manages Pages CMS collaborators.
- **Technical contributor:** works on a branch through a pull request; never
  commits directly to `main`.
