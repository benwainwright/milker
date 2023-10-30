export const priorityMapping = {
  1: "High",
  2: "Medium",
  3: "Low",
  N: "None",
} as const;

export type TaskPriority =
  (typeof priorityMapping)[keyof typeof priorityMapping];
