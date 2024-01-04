import isDeepEqual from "../isDeepEqual"; // Update the path based on your file structure

describe("isDeepEqual Tests", () => {
  test("returns true for equal primitive values", () => {
    expect(isDeepEqual(42, 42)).toBe(true);
  });

  test("returns true for equal objects", () => {
    const obj1 = { key1: "value1", key2: { nested: "nestedValue" } };
    const obj2 = { key1: "value1", key2: { nested: "nestedValue" } };

    expect(isDeepEqual(obj1, obj2)).toBe(true);
  });

  test("returns true for equal arrays", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];

    expect(isDeepEqual(arr1, arr2)).toBe(true);
  });

  test("returns false for different primitive values", () => {
    expect(isDeepEqual("hello", "world")).toBe(false);
  });

  test("returns false for different objects", () => {
    const obj1 = { key1: "value1", key2: { nested: "nestedValue" } };
    const obj2 = { key1: "value1", key2: { nested: "differentValue" } };

    expect(isDeepEqual(obj1, obj2)).toBe(false);
  });

  test("returns false for different arrays", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];

    expect(isDeepEqual(arr1, arr2)).toBe(false);
  });
});
