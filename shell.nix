{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  nativeBuildInputs = with pkgs.buildPackages; [
    nodePackages_latest.nodejs
    cargo
    rustc
  ];
}
