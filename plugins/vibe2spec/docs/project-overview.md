# The project overview and repeated step cycle

The overview identifies the route to the user's outcome. Select the number and order of steps from the task and its dependencies. A software interface and a scientific study need different plans. An illustrative ten-stage research plan is not a mandatory sequence.

Show two levels clearly. The project view identifies ordered steps, dependencies, and recorded state. The current-step view explains the complete cycle repeated for each step. Approving the overview does not authorize all steps for implementation.

```text
Project overview, illustrative three-step project

+---------------------------+
| Step 1: Prepare inputs     |
| finished, accepted r1      |
+---------------------------+
              |
              v
+---------------------------+
| Step 2: Implement method  |
| current, interviewing     |
+---------------------------+
              |
              v
+---------------------------+
| Step 3: Report results    |
| provisional               |
+---------------------------+

Repeat for each current step

Interview and research
          |
          v
Complete specification + explicit approval
          |
          v
Separate specification review
          |
          v
Prepare code and configuration
          |
          v
Separate pre-execution review
          |
          v
Execute reviewed work and check outputs
          |
          v
Separate results review
          |
          v
Explicit user acceptance
          |
          v
Mark finished --> Next step begins its own interview
          |
          +------> All required steps accepted: project finished

Any unresolved choice returns to the current-step interview.
Any changed reviewed artifact requires its applicable review again.
```

The helper renders the recorded overview; it does not change state or infer completion. Use its project entry and workspace arguments explicitly. Display meaningful step names from the approved overview or referenced contracts. When a future step has no contract yet, identify it by its recorded step identity and provisional status. Do not invent a completed specification for the sake of a label.

Dependencies describe which accepted step revisions supply another step's prerequisites. They must have no cycle. A later dependent step cannot proceed with stale evidence after its prerequisite reopens. The diagram must show the reopened current revision, suspended affected steps, and unchanged finished steps.

```text
Necessary amendment, illustrative state

prepare-inputs r2 [reopened, current]
       |
       +--> implement-method r1 [suspended: prepare-inputs]
                    |
                    +--> report-results r1 [suspended: implement-method]

unrelated-documentation r1 [finished, accepted]
```

Present the readable explanation with the diagram. A suspended step retains historical results for its earlier inputs, but those results cannot establish a current pass. Reopening starts a new specification process and requires renewed acceptance before dependent work resumes.
