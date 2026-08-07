# Production System Sprint application draft

Status: inactive. Do not connect this draft to a form endpoint, calendar, invoice, checkout, or payment link until the operator approves the offer, terms, intake, and dates.

## Proposed record

- signed-in account ID;
- applicant name;
- project title;
- intended audience;
- problem to solve;
- finished result desired;
- existing sources and assets;
- current tools and accounts;
- technical comfort;
- budget beyond the sprint;
- rights and consent status;
- deadline and known blockers;
- previous attempts;
- reason self-serve courses are insufficient;
- session format and time zone;
- accessibility needs;
- scope-boundary agreement and timestamp.

Do not accept card data, account passwords, API keys, private provider tokens, or large media uploads in the first application form.

## Manual statuses

`submitted -> clarification_requested | rejected | accepted -> scope_sent -> payment_verified -> preparation_open`

Acceptance must remain manual. Scheduling and payment follow the accepted written scope; they are not embedded in the public application.

## Operator decisions still required

- final terms and cancellation policy;
- privacy/retention period for applications;
- active months and available session windows;
- acceptance and rejection templates;
- invoice/payment provider and tax treatment;
- private preparation-page access method;
- whether unaccepted files are deleted immediately or after a short review period.
