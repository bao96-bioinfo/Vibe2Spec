# Revised execution design

Read artifacts/input.json, wrap its vector under values, and write artifacts/output-r2.json. Preserve values, order, and the original input. The method decision fixes this representation and path; the unchanged resource and pairing decisions retain their original provenance. The fictional runtime is fictional-copy-1. One invocation and no retry are permitted. Use exact JSON comparison with array order preserved.
