# Step 2 input-handling interview

## Status

The runtime matrix and assessment profile are approved in [the response record](../decisions/runtime-profile-responses-v1.md). The following three independent choices remain unanswered. Their recommendations are proposals. Exact implementation details will be presented together in the complete specification after these choices are resolved.

## S2-EXTERNAL-SCOPE: individual external files or directory authorization

An external file lies outside the selected project workspace. The helper already requires explicit authorization before reading such a location. The remaining choice is whether authorization can cover a directory and its descendants.

For example, approval of `/research/contracts/data.json` would permit that one file. Approval of the directory `/research/contracts` could permit explicitly referenced files anywhere below it, including a file added later. Both options retain exact fingerprint checks, bounded reads, and the prohibition on directory discovery. An unreferenced file is not read merely because it lies inside an approved directory.

| Choice | Consequence |
| --- | --- |
| A. Individual external files only, recommended for Step 2 | Every external input has an explicitly named file location. Adding another external input requires extending that authorization. This keeps the initial access contract small and precise. |
| B. Individual files or explicitly approved directory subtrees | The user can choose either scope for each grant. A directory grant reduces repeated authorization for related files, but covers a broader set of potential future inputs. |

The approval here selects a supported authorization mechanism. It does not grant access to the illustrative paths above. Necessary metadata inspection of selected paths and their ancestors must be specified separately without enabling unrelated content reads. Status: awaiting response.

## S2-ENCODING-MARKER: a leading marker in a JSON file

An encoding marker is an invisible character that some editors place at the beginning of a text file. The JSON standard allows a reader to ignore a leading byte-order mark for interoperability. The package needs one explicit interpretation so that its workers do not choose differently. [JSON standard, character encoding](https://www.rfc-editor.org/rfc/rfc8259#section-8.1).

| Choice | Consequence |
| --- | --- |
| A. Require input without the leading marker, recommended | A marked file receives an unsupported-input assessment and cannot establish readiness. The coordinator explains the issue; any corrected file needs its own explicit editing scope and renewed affected evidence. The helper performs no repair. |
| B. Recognize exactly one leading UTF-8 marker | The reader interprets the JSON after that marker while retaining the original file bytes. File size and fingerprints still include the marker. This supports such editor-produced files without rewriting them and adds a precise parsing case. |

Under B, only the exact three-byte UTF-8 marker at byte offset zero receives special handling. A repeated marker, a marker after whitespace, or a marker within a JSON value receives no additional exception. A marker character inside a quoted string remains ordinary string content. The complete contract must specify diagnostics for each boundary.

Neither option permits selecting a winning value from duplicate fields, guessing a correction, replacing invalid character sequences, or rewriting the input. Repeated field names can produce different interpretations across JSON readers; the complete contract must make the no-guessing behavior explicit. [JSON standard, object names](https://www.rfc-editor.org/rfc/rfc8259#section-4). Status: awaiting response.

## S2-SIGNED-ZERO: preserve the sign of zero

JavaScript represents positive and negative zero separately. Ordinary equality considers them equal, but some numerical operations distinguish their signs. For example, dividing one by positive zero produces positive infinity; dividing one by negative zero produces negative infinity. These illustrate the representation difference, not a calculation the validation helper will perform. [ECMAScript Number type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type).

| Choice | Consequence |
| --- | --- |
| A. Preserve negative zero, recommended | Reading `-0` retains its sign in the interpreted value. The helper does not discard information that could affect a later approved calculation. |
| B. Explicitly interpret both spellings as positive zero | Reading `-0` and `0` produces the same interpreted value. This simplifies value handling, but deliberately discards signed-zero information. |

Both options retain unchanged source bytes and therefore distinguish the two spellings when checking file fingerprints. Neither changes the requirement that a revision is at least 1. Neither selects a future numerical tolerance or comparison rule. The choice concerns interpretation of numeric settings, including permitted literal decision values. Status: awaiting response.
