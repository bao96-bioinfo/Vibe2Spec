/** Stable diagnostic registry. Messages never include platform-specific errors. */
export const MESSAGES = Object.freeze({
  "completion": "One value defined above.",
  "structure": "One value defined above.",
  "operation": "`structure`, `implementation_readiness`, or null when no valid operation was supplied.",
  "findings": "Array of the finding objects defined below, including an empty array when none exist.",
  "invalid-encoding": "The file is not valid under the approved text encoding.",
  "invalid-json": "The file does not contain one complete valid JSON value.",
  "duplicate-key": "This object contains the same decoded field name more than once.",
  "unsupported-version": "The record format version is unsupported.",
  "unknown-field": "This field is not declared for the containing object.",
  "missing-field": "This required field is absent.",
  "invalid-type": "This value does not have the type declared for this field.",
  "invalid-enumeration": "This value is not one of the declared alternatives.",
  "invalid-field-order": "The object fields are not in their declared order.",
  "invalid-identifier": "The identifier does not satisfy the declared spelling or length rule.",
  "invalid-integer": "The value does not satisfy the declared safe-integer range.",
  "invalid-number": "The value does not satisfy the declared finite-number or nonnegative-number rule.",
  "empty-value": "This field requires a nonempty string or collection.",
  "duplicate-value": "This collection contains a value that its uniqueness rule prohibits repeating.",
  "invalid-order": "This collection is not in its declared order.",
  "invalid-timestamp": "The timestamp or timestamp ordering does not satisfy the declared rule.",
  "invalid-digest": "The digest is not a lowercase SHA-256 hexadecimal value.",
  "invalid-path": "The path does not satisfy the declared path syntax or location rule.",
  "path-alias": "The path identifies an artifact through a prohibited alias or case collision.",
  "symbolic-path": "The artifact or one of its ancestor directories is symbolic.",
  "not-ordinary-file": "The referenced artifact is not an ordinary file.",
  "missing-reference": "The referenced file does not exist at its specified location.",
  "digest-mismatch": "The referenced file bytes do not match the specified digest.",
  "size-mismatch": "The file byte length does not match the snapshot entry.",
  "reference-kind-mismatch": "The referenced record has a different kind from the one required here.",
  "reference-project-mismatch": "The referenced record belongs to a different project.",
  "reference-cycle": "Following these record references creates a cycle.",
  "dependency-cycle": "Following these step dependencies creates a cycle.",
  "duplicate-identity": "This project graph contains more than one record for the same identity and revision.",
  "identity-conflict": "This record identity changes its kind or project.",
  "revision-conflict": "The revision does not satisfy the applicable preserved-revision rule.",
  "context-conflict": "The declared context or actor identity violates the record's context rules.",
  "association-mismatch": "The referenced identities, revisions, or ordered associations do not match the containing record's requirements.",
  "snapshot-membership-mismatch": "The claimed target is absent from the exact snapshot scope required here.",
  "forbidden-snapshot-entry": "The snapshot includes itself or evidence that must be created after it.",
  "record-inconsistency": "These declared fields contradict an explicit cross-field rule of the record format.",
  "non-project-context": "Authoring templates and fictional examples cannot establish readiness for an actual project.",
  "missing-current-step": "The selected project evidence does not identify an assessable current step.",
  "incomplete-step": "The current step has an unresolved required contract value.",
  "incomplete-unit": "A required unit has an unresolved required contract value.",
  "unresolved-decision": "A required decision has no resolved selection.",
  "missing-pair-decision": "The current step lacks the required explicit paired-validation decision.",
  "unapproved-decision": "No applicable approval covers these exact required decision contents.",
  "unapproved-specification": "No applicable specification approval covers this required artifact and its exact contents.",
  "unpreserved-specification": "A required specification artifact is not preserved as the required frozen version.",
  "missing-comparison-coverage": "A required output or check lacks its specified comparison coverage.",
  "missing-specification-review": "No applicable specification review covers the complete required specification scope.",
  "review-not-passing": "The applicable specification review does not report a pass with no unresolved findings.",
  "review-not-independent": "The recorded reviewer context is also an assessed author's or relevant worker's context.",
  "missing-acceptance": "A required dependency lacks acceptance for its applicable revision.",
  "dependency-not-current": "A required dependency has unresolved current evidence or recorded suspension.",
  "access-not-authorized": "The requested location is outside the approved read scope.",
  "access-denied": "The required artifact could not be read because access was denied.",
  "read-failed": "The required artifact could not be read because a filesystem operation failed.",
  "input-changed": "The input changed during assessment, so its checked identity is not established.",
  "resource-limit": "An approved assessment resource limit prevented completion.",
  "unsupported-number": "This numeric representation is outside the helper's approved precision support; the affected assessment remains incomplete.",
  "check-not-supported": "This required check is outside the approved mechanical check set.",
  "invalid-operation": "A supported assessment operation must be selected.",
  "invalid-argument": "An invocation argument is missing, repeated, unknown, or invalid.",
  "invalid-read-scope": "The invocation does not provide a valid approved read scope.",
  "invalid-limits": "The invocation does not provide the required valid resource limits.",
  "internal-failure": "The helper encountered an unexpected failure and did not complete the assessment.",
  "semantic-completeness": "A separate reviewer must assess whether the specification resolves every effective decision and whether its readable and structured statements agree.",
  "approval-provenance": "The coordinator and separate reviewer must assess the actual user response and its exact approval scope; text fields alone do not authenticate approval.",
  "review-independence": "The separate review process must assess the actual handoff and context separation; distinct recorded labels alone do not prove independence.",
  "evidence-authenticity": "The separate reviewer must assess whether preserved artifacts and claimed observations describe the actual work; matching record fields alone do not establish that fact.",
  "missing-run": "No applicable execution record covers the required work.",
  "missing-pre-execution-review": "No applicable passing separate review covers the prepared work.",
  "missing-results-review": "No applicable passing separate review covers the results.",
  "missing-prepared-work": "The required prepared-work snapshot is absent.",
  "check-not-passing": "A required check does not report a pass.",
  "unapproved-effective-setting": "An effective setting lacks applicable approval.",
  "unapproved-output": "An observed artifact is neither an approved output or unit write path nor an unchanged recorded input.",
  "unapproved-input": "An execution input is absent from the approved step inputs and unit fixtures.",
  "effective-setting-mismatch": "An observed effective setting differs from its approved value.",
  "amendment-scope-changed": "The proposed change exceeds the approved amendment scope.",
  "missing-reopening-approval": "The reopened revision lacks exact-scope amendment approval.",
  "stale-dependency-evidence": "The dependency evidence does not apply to the current accepted revision."
});

export function compareUtf8(a, b) {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return Buffer.compare(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
}

export function finding(category, code, path = null, pointer = null, related_path = null) {
  if (!Object.hasOwn(MESSAGES, code)) throw new TypeError('Unknown finding code.');
  return { category, code, path, pointer, related_path, message: MESSAGES[code] };
}

export function sortFindings(findings) {
  const ranks = { invocation: 0, internal: 1, structural: 2, readiness: 3, incomplete: 4 };
  const unique = new Map();
  for (const item of findings) unique.set(JSON.stringify([item.category,item.path,item.pointer,item.code,item.related_path]), item);
  return [...unique.values()].sort((a,b) => ranks[a.category]-ranks[b.category] || compareUtf8(a.path,b.path) || compareUtf8(a.pointer,b.pointer) || compareUtf8(a.code,b.code) || compareUtf8(a.related_path,b.related_path));
}

export function escapePointer(value) { return String(value).replaceAll('~', '~0').replaceAll('/', '~1'); }
