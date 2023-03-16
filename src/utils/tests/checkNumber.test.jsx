import { isNumber } from "@/utils/checkNumber";

describe("isNumber() - test if a value is a nummeric", () => {
  it("should return `false` if value is `alphabetical representation`", () => {
    const reflected = isNumber("alphabetical representation");
    expect(reflected).toEqual(false);
  });
  it("should return `false` if value is `1,1`", () => {
    const reflected = isNumber("1,1");
    expect(reflected).toEqual(false);
  });
  it("should return `false` if value is `@#!%`", () => {
    const reflected = isNumber("@#!%");
    expect(reflected).toEqual(false);
  });
  it("should return `false` if value is `0.0.`", () => {
    const reflected = isNumber("0.0.");
    expect(reflected).toEqual(false);
  });
  it("should return `false` if value is `0..`", () => {
    const reflected = isNumber("0..");
    expect(reflected).toEqual(false);
  });
  it("should return `true` if value is `0`", () => {
    const reflected = isNumber("0");
    expect(reflected).toEqual(true);
  });
  it("should return `true` if value is `0.0`", () => {
    const reflected = isNumber("0.0");
    expect(reflected).toEqual(true);
  });
  it("should return `true` if value is `-123`", () => {
    const reflected = isNumber("-123");
    expect(reflected).toEqual(true);
  });
});
