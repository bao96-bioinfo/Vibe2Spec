# Step 2 policy responses

## Provenance and scope

This document records actual responses received through the conversation's question interface while preparing Step 2. The quoted answers are preserved exactly. The question identifiers below identify the received question items. They are not invented user-message identifiers or version 1 approval records. The full questions remain in the conversation. This manually maintained evidence applies to the stated policies only.

These responses do not approve a complete Step 2 specification, its exact fixtures, proposed commands, new runtime installation, or implementation. Those contents must be presented as a complete preserved specification and receive explicit approval and separate specification review. Step 1 remains finished under its existing acceptance.

## Initial grouped approval

Question item: `["request_user_input_async","call_4225977d3fac4893bb3c901c26bda426",0]`.

Actual response: `Approve these three recommendations`.

The question explicitly grouped use of Node.js built-in modules, JSON and readable reports derived from the same findings, and two independent implementations of one small validation function on identical saved synthetic examples. Its approval covers the following independent policy decisions.

| Decision | Approved scope | Details still unresolved |
| --- | --- | --- |
| S2-DEPENDENCIES | Use Node.js built-in modules only. | Exact module usage and interfaces belong in the complete contract. |
| S2-REPORTS | Produce JSON and readable reports from one set of findings. | Exact fields, messages, order, serialization, and process exit statuses. |
| S2-PAIR | Compare two independent implementations of one small validation function. | The envelope checker was selected in the later response below. Its detailed contract, shared fixture bytes, expected results, direct comparison, and resource limits remain pending. |

## Interface selection

Question item: `["request_user_input_async","call_d145fb911c8c45a3a9c469c94fb5bf5f",0]`.

Actual response: `Reusable functions plus a command-line interface (Recommended)`.

S2-INTERFACE selects reusable JavaScript functions plus a thin command-line layer. Both use the same implementation of each rule. Function exports, argument types, process arguments, and return contracts remain subject to the detailed specification.

## File-writing selection

Question item: `["request_user_input_async","call_d145fb911c8c45a3a9c469c94fb5bf5f",1]`.

Actual response: `Read-only inspection; print reports to the caller (Recommended)`.

S2-WRITES selects read-only product helpers that return or print their reports. They do not save reports, repair files, change approvals, or execute stored commands. Report retention by the coordinator needs its own approved evidence procedure. Source preparation and test-fixture setup remain subject to the complete Step 2 scope.

## Development runtime and compatibility

Question item: `["request_user_input_async","call_d145fb911c8c45a3a9c469c94fb5bf5f",2]`.

Actual response: `Use the current version but also make it compatible with Node.js long-term-support environment`.

S2-RUNTIME selects the observed installed Node.js `26.11.1` for development and requires compatibility with a Node.js long-term-support environment. The question had described Node.js 24 as its long-term-support alternative. Targeting that line is the coordinator's proposed interpretation. Exact compatibility versions, acquisition, commands, and evidence remain to be fixed in the complete contract. The response is not recorded as approval to omit compatibility verification.

## Input-state selection

Question item: `["request_user_input_async","call_c98b1aa8c26f4d159d57ba51c6e3c8b2",0]`.

Actual response: `Explicit entry record and approved read locations (Recommended)`.

S2-INPUT-SCOPE selects an explicit entry record and workspace. The helper follows its exact references within approved read locations and limits. An external path inside a record supplies no access authorization. Directory discovery is not part of Step 2. Exact path arguments, traversal, limits, and authority representation remain for the complete contract.

## Finding collection

Question item: `["request_user_input_async","call_c98b1aa8c26f4d159d57ba51c6e3c8b2",1]`.

Actual response: `Collect independent findings; distinguish incomplete checks (Recommended)`.

S2-FINDINGS selects collection of independent findings. A broken reference stops the affected branch. Reports distinguish confirmed defects, unresolved requirements, and checks that could not finish. Missing evidence and incomplete checks cannot establish readiness. Deterministic traversal, ordering, diagnostic categories, and resource behavior still require the complete contract.

## Paired-unit selection

Question item: `["request_user_input_async","call_c98b1aa8c26f4d159d57ba51c6e3c8b2",2]`.

Actual response: `Record-envelope checker (Recommended)`.

S2-PAIRED-UNIT selects the record-envelope checker. Its scope is the shared identification fields and envelope structure. The twelve kind-specific content validators are implemented once. The full envelope interface, complete context, identical saved synthetic inputs, correctness expectations, direct comparison, and execution limits must be approved before either paired worker implements the function.

## Numeric interpretation

Question item: `["request_user_input_async","call_0e5eae07b12240e4812ec8757a82124a",0]`.

Actual response: `Standard JavaScript numbers with strict precision-loss checks (Recommended)`.

S2-NUMBERS selects standard JavaScript finite-number representation with explicit precision-loss detection. The question explained that `0.1` has a small binary representation error. It specified accepting `0.1` and `1e-1` as the same supported value, rejecting `0.10000000000000001` when conversion collapses it to `0.1`, and rejecting oversized integers, overflow, and underflow. Values requiring exact decimal precision can use a string with an approved meaning where the accepted record format permits it. This choice introduces no numerical tolerance and does not authorize interpreting a numeric string automatically.

The exact source-token comparison method, negative-zero behavior, field-specific numeric bounds, and boundary fixtures remain for the complete specification. This evidence records the approved representation policy without pretending those details were included in the question.
