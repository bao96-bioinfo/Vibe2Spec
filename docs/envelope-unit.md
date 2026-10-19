# Paired record-envelope contract

The autonomous development authorization selects the methods and cases below. Primary implementation A is `scripts/envelope.mjs`; the independent second implementation must receive this contract and the saved cases without observing A. This is bounded unit validation, not two whole validators.

## Callable interface and input contract

Export: `checkRecordEnvelope(value, sourceOrder)`. It is synchronous and returns an array of findings. It reads no files, modifies no argument, invokes no external operation, and uses no environment-dependent setting. It has exactly two required arguments and accepts no optional arguments.

`value` is a JSON-derived value: null, a boolean, a string, a finite JavaScript Number, an array, or an ordinary object containing only such values. It has no getters, symbols, functions, undefined values, inherited data fields, or cycles. Objects produced with a null prototype are also permitted. Object keys are already decoded strings and unique within each object. Strings have already passed the approved parser's Unicode policy. The unit neither parses JSON nor recreates that parser's duplicate-key, encoding, or precision checks.

`sourceOrder` is a closed object with `root` and `author`, in that order. Each is either null or an array of unique strings. `root` contains the exact decoded source keys of `value` in source order when `value` is an object other than an array; otherwise it is null. `author` similarly contains the source keys of the root's own `author` value when that value is an object other than an array; otherwise it is null. Arrays have no envelope object order. Every supplied key list must contain exactly its corresponding object's own keys. The function must not reconstruct source order from JavaScript key enumeration.

Invocation validation precedes record checks. An argument count other than two, a value outside the JSON-derived domain, a malformed `sourceOrder`, or a key-list mismatch throws a TypeError whose exact message is `Invalid envelope-checker input.` It returns no findings in that case. Checking the declared input domain is separate from deciding whether the supplied JSON value is a valid record. A JSON-derived number outside a workflow field's range remains an assessable invalid record value.

The source-order container's own declared order is a caller contract, not a record finding. Its keys are ordinary nonnumeric names whose insertion order can be checked directly. Unsupported caller objects such as proxies lie outside this interface; the unit does not promise safe invocation of arbitrary executable JavaScript objects.

## Returned findings and ordering

Every returned finding has exactly `code`, `pointer`, and `message`, in that order. Pointers follow the [report proposal](../openspec/changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/draft/report-contract-proposal.md): the root is `""`; field segments escape `~` as `~0` and `/` as `~1`. Findings are sorted by pointer, then code, comparing UTF-8 bytes. Identical `(code, pointer)` pairs occur once. The report assembler adds `category: structural`, the actual artifact path, and `related_path: null`; it does not change these messages.

| Code | Exact message |
| --- | --- |
| `unsupported-version` | The record format version is unsupported. |
| `unknown-field` | This field is not declared for the containing object. |
| `missing-field` | This required field is absent. |
| `invalid-type` | This value does not have the type declared for this field. |
| `invalid-enumeration` | This value is not one of the declared alternatives. |
| `invalid-field-order` | The object fields are not in their declared order. |
| `invalid-identifier` | The identifier does not satisfy the declared spelling or length rule. |
| `invalid-integer` | The value does not satisfy the declared safe-integer range. |
| `empty-value` | This field requires a nonempty string or collection. |
| `context-conflict` | The declared context or actor identity violates the record's context rules. |

No runtime error text, observed value, path, or locale-specific wording is interpolated into a message. These literals must remain identical to the report registry in the approved final documents.

## Exact predicates and diagnostic precedence

A nonobject root, including null or an array, yields only `invalid-type` at `""`. Otherwise the required root keys, in order, are `schema_version`, `kind`, `id`, `revision`, `project_id`, `context`, `lifecycle`, `author`, and `content`.

For each object examined, emit `missing-field` at each absent required key and `unknown-field` at each unlisted present key. Check field order only when the object's key set is exactly the required set. Wrong order then yields one `invalid-field-order` at the object's pointer. A missing or unknown field therefore suppresses that object's order finding, while other present declared fields remain independently assessable. Unknown values are not inspected.

A present field first receives its primitive or object type check. A wrong type produces one `invalid-type` and suppresses its range, spelling, enumeration, and descendant checks. Missing fields receive only their missing-field finding. No field is coerced or trimmed.

| Field | Exact specified check after type succeeds |
| --- | --- |
| `schema_version` | Require a Number. A nonsafe integer or value below zero yields `invalid-integer`. Otherwise any value other than 1 yields `unsupported-version`. |
| `kind` | Require a string in `project`, `decision`, `evidence`, `approval`, `step`, `unit`, `review`, `run`, `comparison`, `acceptance`, `amendment`, `snapshot`; otherwise `invalid-enumeration`. |
| `id`, `project_id` | Require a string matching the complete ASCII pattern `[a-z][a-z0-9-]*`, with length at most 80; otherwise `invalid-identifier`. An empty string receives this spelling finding, not an additional empty-value finding. |
| `revision` | Require a Number that is an integer from 1 through 9007199254740991 inclusive; otherwise `invalid-integer`. Negative zero fails the lower bound. |
| `context` | Require a string equal to `authoring`, `example`, or `project`; otherwise `invalid-enumeration`. |
| `lifecycle` | Require a string equal to `draft` or `frozen`; otherwise `invalid-enumeration`. |
| `author` | Require an object other than null or an array. Its closed ordered keys are `session_id`, then `context_id`. Both require strings of length greater than zero; an empty string yields `empty-value`. |
| `content` | Require an object other than null or an array, including for a draft. Do not inspect its fields in this unit. |

Actor context checks apply independently to each author field that passed its string and nonempty checks, and only when `context` passed its enumeration check. In `example` context, each string must start with the exact prefix `example-`; a failed prefix yields `context-conflict` at that author field. The prefix itself satisfies this spelling rule. In `authoring` context, `session_id` must equal `template-session` and `context_id` must equal `template-author`. Project context adds no reserved-prefix prohibition. Whether recorded labels describe real provenance belongs to separate review.

An invalid kind or lifecycle does not suppress independent envelope or Actor checks. Draft status does not permit unresolved envelope fields. A frozen authoring record can pass this envelope unit while remaining ineligible for an actual project gate. Structural completeness of kind-specific content is assessed elsewhere.

## Shared fixture representation

The specified saved fixture is one JSON object with `fixture_version`, `base`, and `cases`, in that order. Its version is 1. The complete base value is:

```json
{
  "schema_version": 1,
  "kind": "project",
  "id": "record-a",
  "revision": 1,
  "project_id": "project-a",
  "context": "example",
  "lifecycle": "draft",
  "author": {
    "session_id": "example-session",
    "context_id": "example-author"
  },
  "content": {}
}
```

Each case starts from a separate copy of this base and its listed source orders. No case inherits another case's changes. A case object has exactly `id`, `changes`, and `expected`, in that order. Changes are applied in listed order. The following operation arrays define the entire specified fixture language; there are no inferred operations.

| Operation | Exact effect |
| --- | --- |
| `["set", pointer, value]` | Replace an existing direct root or author field without moving its key; append a missing direct field at the end. Values preserve their displayed JSON object order. Recompute author order when replacing author, and root/author order when replacing the root at pointer `""`. |
| `["remove", pointer]` | Remove the specified present direct root or author field and its order entry. An absent target is a fixture-definition error. |
| `["order", pointer, keys]` | Set the source order of root `""` or author `/author` to the supplied complete permutation. Values and key membership remain unchanged. A nonpermutation is a fixture-definition error. |
| `["repeat", pointer, character, count]` | Set the direct field to the stated single ASCII character repeated exactly count times, with the same key-position rule as set. Only the repetitions explicitly listed below are permitted. |
| `["revision-above-safe"]` | Set revision to the JavaScript Number obtained by adding 1 to 9007199254740991. This exact operation produces the exactly representable value 9007199254740992, without decoding an unsafe numeric JSON token. |
| `["override-order", name, value]` | Replace only the `root` or `author` member of sourceOrder with the supplied array or null. This intentionally creates invalid invocation metadata in the two specified cases. |

The fixture container is decoded under the approved raw parser policy. It contains no unsafe numeric literal. The above-safe revision is produced only by the explicitly defined harness operation after fixture decoding. The pure unit accepts that finite Number as an invalid record field and returns `invalid-integer`; a raw record containing the unsafe revision would be rejected at ingestion before this unit is called. The two routes must not emit duplicate findings. No paired worker implements a second JSON parser or a general expression evaluator.

For a findings case, `expected` is `{"kind":"findings","items":[...]}`, with each item containing `code` then `pointer`. The following table supplies every item in its exact expected order. The harness adds the exact message from the registry above to obtain the complete expected return value. A throw case instead uses `{"kind":"throw","name":"TypeError","message":"Invalid envelope-checker input."}`. The compact `code @ pointer` notation below describes those objects; it is not an alternative runtime format. `[]` means no findings.

## Specified finite cases

For the first twelve cases, each changes array contains precisely `["set","/kind",K]`, with K set to the displayed kind. All other rows show complete changes arrays. Every root and author order is derived by the preceding operations unless overridden explicitly.

| Case identifier | Changes | Expected code and pointer list |
| --- | --- | --- |
| `kind-project` | K = `project` | `[]` |
| `kind-decision` | K = `decision` | `[]` |
| `kind-evidence` | K = `evidence` | `[]` |
| `kind-approval` | K = `approval` | `[]` |
| `kind-step` | K = `step` | `[]` |
| `kind-unit` | K = `unit` | `[]` |
| `kind-review` | K = `review` | `[]` |
| `kind-run` | K = `run` | `[]` |
| `kind-comparison` | K = `comparison` | `[]` |
| `kind-acceptance` | K = `acceptance` | `[]` |
| `kind-amendment` | K = `amendment` | `[]` |
| `kind-snapshot` | K = `snapshot` | `[]` |
| `authoring` | `[["set","/context","authoring"],["set","/author/session_id","template-session"],["set","/author/context_id","template-author"]]` | `[]` |
| `project-actors` | `[["set","/context","project"],["set","/author/session_id","session-a"],["set","/author/context_id","worker-a"]]` | `[]` |
| `frozen` | `[["set","/lifecycle","frozen"]]` | `[]` |
| `maximum-revision` | `[["set","/revision",9007199254740991]]` | `[]` |
| `maximum-identifiers` | `[["repeat","/id","a",80],["repeat","/project_id","b",80]]` | `[]` |
| `untrimmed-actors` | `[["set","/context","project"],["set","/author/session_id"," "],["set","/author/context_id"," "]]` | `[]` |
| `root-null` | `[["set","",null]]` | `invalid-type @ ""` |
| `root-array` | `[["set","",[]]]` | `invalid-type @ ""` |
| `root-number` | `[["set","",0]]` | `invalid-type @ ""` |
| `root-string` | `[["set","","record"]]` | `invalid-type @ ""` |
| `root-boolean` | `[["set","",true]]` | `invalid-type @ ""` |
| `all-fields-missing` | `[["set","",{}]]` | `missing-field @ /author`, `missing-field @ /content`, `missing-field @ /context`, `missing-field @ /id`, `missing-field @ /kind`, `missing-field @ /lifecycle`, `missing-field @ /project_id`, `missing-field @ /revision`, `missing-field @ /schema_version` |
| `unknown-root-field` | `[["set","/extra",false]]` | `unknown-field @ /extra` |
| `numeric-root-key` | `[["set","/0",false]]` | `unknown-field @ /0` |
| `root-order` | `[["order","",["kind","schema_version","id","revision","project_id","context","lifecycle","author","content"]]]` | `invalid-field-order @ ""` |
| `version-type` | `[["set","/schema_version","1"]]` | `invalid-type @ /schema_version` |
| `version-fraction` | `[["set","/schema_version",1.5]]` | `invalid-integer @ /schema_version` |
| `version-unsupported` | `[["set","/schema_version",2]]` | `unsupported-version @ /schema_version` |
| `version-negative` | `[["set","/schema_version",-1]]` | `invalid-integer @ /schema_version` |
| `kind-type` | `[["set","/kind",null]]` | `invalid-type @ /kind` |
| `kind-unknown` | `[["set","/kind","other"]]` | `invalid-enumeration @ /kind` |
| `identifier-length` | `[["repeat","/id","a",81],["repeat","/project_id","b",81]]` | `invalid-identifier @ /id`, `invalid-identifier @ /project_id` |
| `identifier-spelling` | `[["set","/id","A"],["set","/project_id",""]]` | `invalid-identifier @ /id`, `invalid-identifier @ /project_id` |
| `identifier-types` | `[["set","/id",0],["set","/project_id",null]]` | `invalid-type @ /id`, `invalid-type @ /project_id` |
| `revision-zero` | `[["set","/revision",0]]` | `invalid-integer @ /revision` |
| `revision-negative` | `[["set","/revision",-1]]` | `invalid-integer @ /revision` |
| `revision-fraction` | `[["set","/revision",1.5]]` | `invalid-integer @ /revision` |
| `revision-unsafe` | `[["revision-above-safe"]]` | `invalid-integer @ /revision` |
| `revision-type` | `[["set","/revision","1"]]` | `invalid-type @ /revision` |
| `context-type` | `[["set","/context",null]]` | `invalid-type @ /context` |
| `context-unknown` | `[["set","/context","other"]]` | `invalid-enumeration @ /context` |
| `lifecycle-type` | `[["set","/lifecycle",null]]` | `invalid-type @ /lifecycle` |
| `lifecycle-unknown` | `[["set","/lifecycle","approved"]]` | `invalid-enumeration @ /lifecycle` |
| `author-null` | `[["set","/author",null]]` | `invalid-type @ /author` |
| `author-array` | `[["set","/author",[]]]` | `invalid-type @ /author` |
| `author-fields-missing` | `[["set","/author",{}]]` | `missing-field @ /author/context_id`, `missing-field @ /author/session_id` |
| `author-unknown-field` | `[["set","/author/extra",true]]` | `unknown-field @ /author/extra` |
| `author-order` | `[["order","/author",["context_id","session_id"]]]` | `invalid-field-order @ /author` |
| `actor-types` | `[["set","/author/session_id",null],["set","/author/context_id",0]]` | `invalid-type @ /author/context_id`, `invalid-type @ /author/session_id` |
| `actor-empty` | `[["set","/author/session_id",""],["set","/author/context_id",""]]` | `empty-value @ /author/context_id`, `empty-value @ /author/session_id` |
| `example-session-prefix` | `[["set","/author/session_id","session-a"]]` | `context-conflict @ /author/session_id` |
| `example-context-prefix` | `[["set","/author/context_id","worker-a"]]` | `context-conflict @ /author/context_id` |
| `authoring-actor-conflict` | `[["set","/context","authoring"]]` | `context-conflict @ /author/context_id`, `context-conflict @ /author/session_id` |
| `project-prefix-not-reserved` | `[["set","/context","project"]]` | `[]` |
| `frozen-authoring` | `[["set","/context","authoring"],["set","/author/session_id","template-session"],["set","/author/context_id","template-author"],["set","/lifecycle","frozen"]]` | `[]` |
| `content-null` | `[["set","/content",null]]` | `invalid-type @ /content` |
| `content-array` | `[["set","/content",[]]]` | `invalid-type @ /content` |
| `content-boolean` | `[["set","/content",false]]` | `invalid-type @ /content` |
| `content-uninspected` | `[["set","/content",{"undeclared":null,"nested":{"10":true,"2":false}}]]` | `[]` |
| `independent-findings` | `[["order","",["kind","schema_version","id","revision","project_id","context","lifecycle","author","content"]],["set","/schema_version",2],["set","/id","?"],["remove","/author/context_id"],["set","/author/session_id",""],["set","/content",null]]` | `invalid-field-order @ ""`, `missing-field @ /author/context_id`, `empty-value @ /author/session_id`, `invalid-type @ /content`, `invalid-identifier @ /id`, `unsupported-version @ /schema_version` |
| `root-order-metadata-invalid` | `[["override-order","root",[]]]` | TypeError with the exact invocation message |
| `author-order-metadata-invalid` | `[["override-order","author",null]]` | TypeError with the exact invocation message |

These are exactly 64 cases. Specified bounds are at most 64 cases, at most 16 KiB for each materialized case input and source-order metadata, and at most 256 KiB for the saved fixture container. A KiB is 1,024 bytes. Materialized size uses two-space JSON serialization plus one final line feed; the unsafe revision's serialized bytes are measured, not reingested. These bounds are selected under autonomous development authorization. Runtime duration and total execution-resource bounds belong in the complete Step 2 verification specification.

## Correctness, direct comparison, and integration

For each case, both implementations are called independently with separate copies of identical inputs and source-order metadata. The harness checks the exact ordered return array, every code, pointer, and message against the fixed expected result. Throw cases check TypeError identity and the exact message. Unexpected throwing, returning rather than throwing, missing findings, additional findings, changed order, or changed arguments fail correctness. Input preservation includes object membership, source-order arrays, string values, numeric values, and signed zero where present; inspection must not rely on JSON serialization alone to detect a negative-zero change.

The harness additionally compares the two complete observations directly using exact JSON equality with preserved array order and ignored object-key order. Observation objects have either `kind: findings` plus `items`, or `kind: throw` plus `name` and `message`, in that field order. Each return object must separately satisfy its declared field order. No numeric tolerance applies to these discrete outputs. Agreement between two incorrect outputs cannot pass because individual expected-result checks remain mandatory.

The function exported as implementation A is designated before either implementation begins. After both implementations pass individual correctness, direct comparison, nonmutation checks, and the applicable separate review, A becomes the integrated helper implementation. Selection never depends on which code is shorter, faster, or produces preferred observed results. Implementation B and its evidence remain preserved. A failure triggers the approved clarification or correction process; it does not authorize replacing expected findings, selecting B automatically, or expanding the unit's scope.

The shared harness and parser remain outside the paired unit and require their own specified checks and separate review. This pair establishes bounded evidence for envelope behavior only. It is not evidence that two whole validators agree or that a research workflow is reproducible without its remaining specifications.
