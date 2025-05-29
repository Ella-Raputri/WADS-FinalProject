import React from "react";
import { render, screen } from "@testing-library/react";
import SaveButton from "../../src/components/SaveButton";
import '@testing-library/jest-dom'

test("renders SaveButton", () => {
  render(<SaveButton data={[{ a: 1 }]} type="testfile" />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
