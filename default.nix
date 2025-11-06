{
  pkgs ? import <nixpkgs> { },
}:

let
  src = pkgs.fetchFromGitHub {
    owner = "BlockstreamResearch";
    repo = "hal-simplicity";
    rev = "2f960979e2e0cc54961be59a888fce8850f43a9c";
    sha256 = "sha256-CzYPGKBbVxee2W1aCbnlF78YefCVCAQKIgU+903hUE4=";
  };
in
# force rebuild
pkgs.rustPlatform.buildRustPackage {
  pname = "hal-simplicity";
  version = "0.1.0";

  src = src;

  cargoHash = "sha256-1kGwjPJ5zzHVoFu2MgpFulNnc6G5HiYh+YFTvYwk+BQ=";

  meta = with pkgs.lib; {
    description = "HAL backend for Simplicity";
    homepage = "https://github.com/BlockstreamResearch/hal-simplicity";
    license = licenses.mit;
    platforms = platforms.linux;
  };
}
