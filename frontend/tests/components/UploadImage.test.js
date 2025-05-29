import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import UploadImage from "@/components/UploadImage";
import '@testing-library/jest-dom'

describe("UploadImage Component", () => {
  let setImageMock, setImageNameMock;

  beforeEach(() => {
    setImageMock = jest.fn();
    setImageNameMock = jest.fn();

    // Mock canvas and Image elements for Node environment
    Object.defineProperty(global, "Image", {
      writable: true,
      value: class {
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 10);
        }
        set src(_) {
          // trigger onload via constructor
        }
      },
    });

    // Mock canvas
    const createElement = document.createElement.bind(document);
    jest.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        return {
          width: 0,
          height: 0,
          getContext: () => ({
            drawImage: jest.fn(),
          }),
          toDataURL: () => "data:image/png;base64,mockImageData",
        };
      }
      return createElement(tag);
    });

    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/mock");
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders upload button and handles image upload", async () => {
    render(
      <UploadImage
        image={null}
        setImage={setImageMock}
        imageName=""
        setImageName={setImageNameMock}
        inputId="testUpload"
      />
    );

    const input = screen.getAllByLabelText(/upload image/i)[0];
    const file = new File(["mock"], "testphoto.jpg", { type: "image/jpeg" });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(setImageMock).toHaveBeenCalledWith(
        "data:image/png;base64,mockImageData"
      );
    });

    expect(setImageNameMock).toHaveBeenCalledWith(expect.stringContaining("testphoto"));
  });

  it("displays image name and remove button when image is set", () => {
    render(
      <UploadImage
        image="data:image/png;base64,mockImageData"
        setImage={setImageMock}
        imageName="testphoto.jpg"
        setImageName={setImageNameMock}
        inputId="testUpload"
      />
    );

    expect(screen.getByText("testphoto.jpg")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove"));
    expect(setImageMock).toHaveBeenCalledWith(null);
    expect(setImageNameMock).toHaveBeenCalledWith("");
  });
});
