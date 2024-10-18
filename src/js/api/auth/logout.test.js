import { logout } from "./logout";
import { remove } from "../../storage/index";

jest.mock("../../storage/index", () => ({
  remove: jest.fn(),
}));

describe("logout function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("removes the token from storage", () => {
    logout();

    expect(remove).toHaveBeenCalledWith("token");
  });
});
