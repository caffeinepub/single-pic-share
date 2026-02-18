import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
  public func handleError(message : Text) : async () {
    let parsingError = message.contains(#text("parsing "));
    let buildError = message.contains(#text("build "));
    let deployError = message.contains(#text("legacy ")) or message.contains(#text("canister ")) or message.contains(#text("wallet "));
    let networkError = message.contains(#text("network ")) or Text.equal(message, "no response from subnet");
    if (parsingError) {
      Runtime.trap(
        "Failed to parse the message returned by the deployment process. Please ensure the message is in the expected format and try again. Diagnostics: " # message,
      );
    } else if (buildError) {
      Runtime.trap(
        "Deployment failed at the build step. Please check build diagnostics and try again. Raw error: " # message,
      );
    } else if (deployError) {
      Runtime.trap(
        "Deployment failed at the deploy step. Please check deployment diagnostics and try again. Raw error: " # message,
      );
    } else if (networkError) {
      Runtime.trap(
        "Deployment failed due to a network issue. This is usually a transient error and you can safely retry. Raw error: " # message,
      );
    } else {
      Runtime.trap(
        "An unexpected error occurred. Please report the error message to #support of ISAAC. Include the raw error message for further assistance: " # message,
      );
    };
  };
};
