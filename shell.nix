{
  pkgs ? import <nixpkgs> { },
}:

let
  hal-simplicity = pkgs.callPackage ./default.nix { };

  simc = pkgs.rustPlatform.buildRustPackage {
    pname = "simc";
    version = "0.1.0";

    src = pkgs.fetchFromGitHub {
      owner = "BlockstreamResearch";
      repo = "SimplicityHL";
      rev = "31c1ee829dcdf06bb1132b21973070f339ebee46";
      sha256 = "sha256-Etu2uCQrhgU0Y0Oi1I0W0GwbtBVxl+smT6bQVswJnNw=";
    };

    cargoHash = "sha256-Ck2z1OH3xq64b6UMZ8hako2otUiKY51vIat8QiDhF58=";
  };
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs.buildPackages; [
    nodejs_22
    hal-simplicity
    elementsd
    simc
  ];
}
