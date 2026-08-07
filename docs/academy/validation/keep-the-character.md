# Validation: Keep the Character

Version: 1  
Updated: 2026-08-06  
Launch decision: blocked by operator walkthrough

| Gate | Result | Evidence or remaining work |
| --- | --- | --- |
| Source-backed content | Partial pass | Public Workshop evidence and course source map exist. Exact operator correction steps are still missing. |
| Operator review | Pending | `OPERATOR_INPUT_REQUIRED`. |
| Complete lesson path | Draft complete | Two previews and seven paid lesson drafts/outlines exist. |
| Successful clean-account walkthrough | Pending | Required before `available`. |
| Working free previews | Pass in build | Two normalized public preview routes are generated. |
| Working paid access | Platform code exists | Course remains `review`; paid body endpoint intentionally refuses publication. |
| Accessible media/transcript | Pass in build; approval pending | Existing workflow film has a poster, controls, text transcript, caption track, and no autoplay. The operator still needs to approve the final captions and rights record. |
| Paid-body leakage | Pass for current review build | The course remains unavailable; exact paid bodies are not published or served. Its public routes contain objective-and-artifact previews only. |
| Correct price and grant | Draft only | $7 product key exists but product is not active and has no provider Price mapping. |
| Correct support/refund route | Pass in code; policy decision pending | `/helpcenter/` and the implemented refund state are linked. The operator must approve the refund window before sale. |

Do not change the manifest status from `review` to `available` until every pending row is closed and dated by the operator.
