# The Feed Is the Problem: schedule audit

Checked against the article corpus on August 14, 2026 in `America/Los_Angeles`.

| Date at 4:20 p.m. PDT | Article |
| --- | --- |
| August 21 | Hit the Source Directly |
| August 22 | The Feed Is the Problem |
| August 23 | Deserts Remember Water |
| August 24 | I Stopped Writing Prompts and Built a Machine Instead |
| August 25 | The Salton Sea Needs an Outlet |

The new follow-up occupies the day immediately after the RSS article. Moving EZIZE from August 22 to the previously open August 24 slot preserves both surrounding environmental articles and produces five consecutive release dates with no duplicate timestamp.

Each article remains `status: scheduled` in source. A one-time GitHub Actions workflow verifies the exact timestamp, changes that article to `published` only after its release time, removes its own workflow and script, commits the release, and pushes `main` to trigger the normal Cloudflare Pages build.
