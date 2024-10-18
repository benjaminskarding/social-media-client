import { login } from "./login";
import { save } from "../../storage/index";

jest.mock("../../storage/index", () => ({
  save: jest.fn(),
  load: jest.fn(),
}));

describe("login function", () => {
  const mockFetchSuccess = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      accessToken: "fake-token",
      name: "John Doe",
    }),
  });

  const mockFetchFailure = jest.fn().mockResolvedValue({
    ok: false,
    statusText: "Invalid credentials",
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("stores a token when provided with valid credentials", async () => {
    global.fetch = mockFetchSuccess;

    const profile = await login("user@example.com", "password123");

    expect(save).toHaveBeenCalledWith("token", "fake-token");
    expect(save).toHaveBeenCalledWith("profile", {
      name: "John Doe",
    });

    expect(profile).toEqual({ name: "John Doe" });
  });

  it("throws an error when the login fails", async () => {
    global.fetch = mockFetchFailure;

    await expect(login("user@example.com", "wrongpassword")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  afterEach(() => {
    delete global.fetch;
  });
});
