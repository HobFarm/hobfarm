---
title: "Data Processing Agreement"
description: "Data processing terms for HobFarm services, including creative tools, generated media workflows, infrastructure providers, subprocessors, security, and data requests."
publishedAt: 2026-05-15
---

## Parties

This Data Processing Agreement ("DPA") is between HobFarm ("Processor") and you, the user of HobFarm services ("Controller"), and supplements the Terms of Service.

## Scope

This DPA applies to the processing of personal data that you provide to HobFarm through StyleFusion, Grimoire, or any other HobFarm service where personal data may be involved (for example, images containing identifiable faces).

## Definitions

**Personal Data:** any information relating to an identifiable natural person, as defined by applicable data protection law.

**Processing:** any operation performed on personal data, including collection, storage, transformation, retrieval, and deletion.

## Data Processing Details

| Element | Description |
|---------|-------------|
| **Subject matter** | Provision of AI image generation, knowledge graph, and content automation services |
| **Duration** | For the duration of service use, plus any retention periods specified in the Privacy Policy |
| **Nature and purpose** | Image processing, prompt compilation, visual feature extraction, content generation |
| **Types of personal data** | Email addresses, uploaded images (which may contain faces or identifiable features), authentication tokens, IP addresses |
| **Categories of data subjects** | Registered users, individuals depicted in uploaded images |

## Processor Obligations

HobFarm will:

1. Process personal data only as necessary to provide the services, or as otherwise instructed by the Controller
2. Ensure that persons authorized to process data are bound by confidentiality obligations
3. Implement appropriate technical and organizational security measures (encryption in transit and at rest, access controls via Cloudflare Access)
4. Assist the Controller in responding to data subject requests (access, deletion, portability)
5. Delete or return personal data upon termination of services, at the Controller's request
6. Make available information necessary to demonstrate compliance with these obligations

## Sub-Processors

HobFarm uses the following sub-processors to deliver services:

| Sub-Processor | Service | Data Processed | Location |
|---------------|---------|----------------|----------|
| Cloudflare, Inc. | Infrastructure (Pages, Workers, D1, R2, Access) | All service data, authentication, stored objects | Global (distributed network) |
| Google Cloud (Vertex AI) | AI model inference | Compiled text prompts, generation parameters | United States / Global |
| Third-party AI model providers | Image generation | Compiled text prompts, generation parameters | Varies by provider |

HobFarm will notify users of changes to sub-processors through updates to this document. Compiled prompts sent to AI providers do not include source images, email addresses, or other directly identifying information.

## Security

HobFarm maintains security measures appropriate to the nature of the data processed:

- All data encrypted in transit (TLS 1.2+)
- Data encrypted at rest (Cloudflare default encryption)
- Access control via Cloudflare Access (zero-trust model)
- No direct database access from the public internet
- Security vulnerability reporting via the security report form (see Bug Bounty policy)

## Data Breach Notification

In the event of a personal data breach, HobFarm will notify the Controller without undue delay (and within 72 hours where feasible) after becoming aware of the breach. Notification will include the nature of the breach, categories and approximate number of affected individuals, likely consequences, and measures taken or proposed.

## International Transfers

Data may be processed in any country where Cloudflare operates infrastructure. Cloudflare's network spans 300+ cities globally. For transfers outside the EEA/UK, Cloudflare maintains appropriate safeguards (Standard Contractual Clauses). AI model providers may process data in the United States or other jurisdictions.

## Governing Law

This DPA is governed by the laws of the State of Nevada, United States.

## Contact

Data processing inquiries: [contact HobFarm](/contact/)
Security incidents: [security report form](/contact/?subject=security)
