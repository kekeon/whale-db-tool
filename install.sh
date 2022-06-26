#!/bin/sh


download() {
  if command -v curl > /dev/null 2>&1; then
    curl -fsSL "$1"
  else
    wget -qO- "$1"
  fi
}

validate_url() {
  local url="$1"

  if command -v curl > /dev/null 2>&1; then
    curl --output /dev/null --silent --show-error --location --head --fail "$url"
  else
    wget --spider --quiet "$url"
  fi
}

detect_platform() {
  local platform
  platform="$(uname -s | tr '[:upper:]' '[:lower:]')"

  case "${platform}" in
    linux) platform="linux" ;;
    darwin) platform="macos" ;;
    windows) platform="win" ;;
  esac

  printf '%s' "${platform}"
}


download_and_install() {
  echo "install start whale db tool"
}

download_and_install || abort "Install Error!"