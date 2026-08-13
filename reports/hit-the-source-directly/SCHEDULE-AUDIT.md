# Hit the Source Directly: schedule audit

Checked against the live article corpus on August 12, 2026 in `America/Los_Angeles`.

## Result

The next available release slot is Friday, August 21, 2026 at 4:20 p.m. PDT:

```text
The Future Was Already There
2026-08-20T16:20:00-07:00
        + 24 hours
Hit the Source Directly
2026-08-21T16:20:00-07:00
```

The difference is exactly 86,400 seconds. The article frontmatter uses `status: scheduled` and `draft: false`.

## Queue evidence

The final seven scheduled entries before this addition were:

| Date at 4:20 p.m. PDT | Article |
| --- | --- |
| August 14 | Reviewing Request for Safety |
| August 15 | Every Sentence Is a Keynote Conclusion |
| August 16 | I Want My MTV |
| August 17 | From Wetlands to the Wash |
| August 18 | Before Wavy Gravy, There Was Hugh Romney |
| August 19 | Songs We Learned Backwards |
| August 20 | The Future Was Already There |

The attached task packet described an older expected sequence around August 18 through 20. The current repository is the schedule source of truth, so no existing dates were moved. The user's proposed August 21 date remains correct and places the new article immediately after the old-YouTube-video article.

## Boundary tests

- One millisecond before `2026-08-21T16:20:00-07:00`: excluded.
- At `2026-08-21T16:20:00-07:00`: public.
- Current production build on August 12: article route absent; combined feed absent; Technology feed absent.
