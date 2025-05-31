// Polyfill TextEncoder/TextDecoder first
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Now require everything else (no import statements)
const React = require("react");
const { render } = require("@testing-library/react");
const { MemoryRouter, Routes, Route } = require("react-router-dom");
const ScrollToTop = require("../../src/components/ScrolltoTop").default;

describe("ScrollToTop", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it("calls window.scrollTo on route change", () => {
    const { rerender } = render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/initial"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: "*", element: React.createElement(ScrollToTop) })
        )
      )
    );

    // Simulate route change
    rerender(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/new-route"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: "*", element: React.createElement(ScrollToTop) })
        )
      )
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("calls window.scrollTo on initial render", () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: "*", element: React.createElement(ScrollToTop) })
        )
      )
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("does not call window.scrollTo again if pathname does not change", () => {
    const { rerender } = render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/same-path"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: "*", element: React.createElement(ScrollToTop) })
        )
      )
    );

    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    rerender(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/same-path"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: "*", element: React.createElement(ScrollToTop) })
        )
      )
    );

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });
});
