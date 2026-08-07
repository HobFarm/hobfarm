# Unresolved Academy question report

The private `academy_question_reports` table stores signed-in course questions. The `academy_unanswered_question_report` view groups open reports by course, lesson, and category so the operator can see which lesson should be improved without exporting account data.

Read-only operator query:

```sql
SELECT course_id, lesson_id, category, open_count, oldest_open_at, newest_open_at
FROM academy_unanswered_question_report
ORDER BY open_count DESC, oldest_open_at ASC;
```

Open an individual question only when revising the named course. Do not copy questions into advertising analytics, public logs, or public course pages. Billing and access reports should be moved to Customer Help rather than answered as curriculum.

The commerce worker also exposes the aggregated source records only on its internal service-binding surface. There is no public operator report endpoint.
