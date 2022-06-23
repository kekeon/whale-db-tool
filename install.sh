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

detect_arch() {
  local arch
  arch="$(uname -m | tr '[:upper:]' '[:lower:]')"

  case "${arch}" in
    x86_64) arch="x64" ;;
    amd64) arch="x64" ;;
    armv*) arch="arm" ;;
    arm64 | aarch64) arch="arm64" ;;
  esac

  # `uname -m` in some cases mis-reports 32-bit OS as 64-bit, so double check
  if [ "${arch}" = "x64" ] && [ "$(getconf LONG_BIT)" -eq 32 ]; then
    arch=i686
  elif [ "${arch}" = "arm64" ] && [ "$(getconf LONG_BIT)" -eq 32 ]; then
    arch=arm
  fi

  case "$arch" in
    x64*) ;;
    arm64*) ;;
    *) return 1
  esac
  printf '%s' "${arch}"
}

download_and_install() {
  echo "install start whale db tool"
}

download_and_install || abort "Install Error!"