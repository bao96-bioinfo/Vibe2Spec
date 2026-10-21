// Evaluation source only. Inputs are finite-number arrays; cutoffs are finite.
// The reference contract defines the mean of an empty array as zero.
// The candidate functions have not been approved for implementation or execution.
export const reference = {
  keepAtLeast(values, cutoff) {
    return values.filter(value => value >= cutoff);
  },
  sum(values) {
    return values.reduce((total, value) => total + value, 0);
  },
  mean(values) {
    return values.length === 0 ? 0 : this.sum(values) / values.length;
  },
};

export const candidate = {
  keepAtLeast(values, cutoff) {
    return values.filter(value => value >= cutoff);
  },
  sum(values) {
    return values.reduce((total, value) => total + value, 0);
  },
  mean(values) {
    return this.sum(values) / values.length;
  },
};
