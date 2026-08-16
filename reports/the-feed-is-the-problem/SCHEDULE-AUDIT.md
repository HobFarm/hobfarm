# The Feed Is the Problem: schedule audit

Checked against the article corpus on August 15, 2026 in `America/Los_Angeles`.

| Date at 4:20 p.m. PDT | Article |
| --- | --- |
| August 21 | Hit the Source Directly |
| August 22 | The Feed Is the Problem |
| August 23 | Dragon’s Lair Was Better Once We Stopped Playing It |
| August 24 | I Stopped Writing Prompts and Built a Machine Instead |
| August 25 | Deserts Remember Water |
| August 26 | The Salton Sea Needs an Outlet |

The Dragon’s Lair article now occupies the day immediately after this follow-up. EZIZE remains on August 24, while the two environmental articles move to August 25 and 26. The result is six consecutive release dates with no duplicate timestamp.

Each article remains `status: scheduled` in source. A one-time GitHub Actions workflow verifies the exact timestamp, changes that article to `published` only after its release time, removes its own workflow and script, commits the release, and pushes `main` to trigger the normal Cloudflare Pages build.
