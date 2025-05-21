#!/bin/sh

GITHUB_REPO="rysk-finance/ryskV12-cli"
OUTPUT_FILENAME="ryskV12"

# Check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Print error message to stderr
log_error() {
  echo "Error: $*" >&2
}

# Provide instructions to install a missing dependency and exit gracefully
prompt_and_exit_for_dependency() {
  local dep_name="$1"
  local os_type=""

  log_error "Required command '$dep_name' not found."
  echo "" >&2
  echo "To proceed, please install '$dep_name' and then re-run this script." >&2
  echo "" >&2

  # Try to detect OS and provide specific instructions
  if command_exists apt; then
    os_type="Debian/Ubuntu"
    echo "  For ${os_type}, run: sudo apt update && sudo apt install -y $dep_name" >&2
  elif command_exists dnf; then
    os_type="Fedora/RHEL (dnf)"
    echo "  For ${os_type}, run: sudo dnf install -y $dep_name" >&2
  elif command_exists yum; then
    os_type="CentOS/RHEL (yum)"
    echo "  For ${os_type}, run: sudo yum install -y $dep_name" >&2
  elif command_exists brew; then
    os_type="macOS (Homebrew)"
    echo "  For ${os_type}, run: brew install $dep_name" >&2
  elif command_exists pacman; then
    os_type="Arch Linux"
    echo "  For ${os_type}, run: sudo pacman -S $dep_name" >&2
  elif command_exists pkg; then
    os_type="FreeBSD"
    echo "  For ${os_type}, run: sudo pkg install -y $dep_name" >&2
  else
    echo "  Please consult your operating system's documentation for installing '$dep_name'." >&2
  fi
  echo "" >&2

  # Exit with success status (0) as requested, but user must re-run
  exit 0
}


# Function to fetch the latest release from GitHub API
get_latest_release() {
  if ! command_exists curl; then
    prompt_and_exit_for_dependency "curl" # This will exit if curl is missing
  fi
  curl -s -H "User-Agent: RyskFinanceCLIInstaller" "https://api.github.com/repos/${GITHUB_REPO}/releases/latest"
}

# Function to get the architecture-specific asset download URL
get_arch_specific_asset() {
  if ! command_exists jq; then
    prompt_and_exit_for_dependency "jq" # This will exit if jq is missing
  fi

  arch=$(uname -m)
  release_json=$(get_latest_release)

  if [ -z "$release_json" ]; then
    log_error "Failed to fetch latest release from GitHub. Check network connection or repository URL."
    return 1
  fi

  asset_name_pattern=""
  case "$arch" in
    x86_64|amd64)
      asset_name_pattern="ryskV[0-9]+-linux-amd64"
      ;;
    aarch64|arm64)
      asset_name_pattern="ryskV[0-9]+-linux-arm64"
      ;;
    *)
      log_error "Unsupported architecture: $arch. This script only supports x86_64/amd64 and aarch64/arm64."
      return 1
      ;;
  esac

  download_url=$(echo "$release_json" | jq -r ".assets[] | select(.name | test(\"$asset_name_pattern\"; \"i\")) | .browser_download_url")

  if [ -z "$download_url" ]; then
    log_error "No matching asset found for your architecture ('$arch') in the latest release."
    log_error "Available assets might differ or the pattern '$asset_name_pattern' is incorrect."
    return 1
  fi

  echo "$download_url"
}


main() {
  echo "Attempting to download latest RyskFinance CLI for your system..."

  # Perform initial dependency checks here before attempting any operations
  # This ensures we exit early and gracefully if core tools are missing.
  if ! command_exists curl; then
    prompt_and_exit_for_dependency "curl"
  fi
  if ! command_exists jq; then
    prompt_and_exit_for_dependency "jq"
  fi

  # If we reach here, both curl and jq are confirmed to exist.
  download_url=$(get_arch_specific_asset)

  if [ -n "$download_url" ]; then
    echo "Identified release: $download_url"
    echo "Downloading to: $OUTPUT_FILENAME"

    # Use curl to download the asset
    curl -L -o "$OUTPUT_FILENAME" "$download_url"

    if [ $? -eq 0 ]; then
      echo "Download complete! File saved as '$OUTPUT_FILENAME'."
      # Make the downloaded file executable
      chmod +x "$OUTPUT_FILENAME"
      if [ $? -eq 0 ]; then
        echo "Made '$OUTPUT_FILENAME' executable."
        echo "You can now run it: ./$OUTPUT_FILENAME"
      else
        log_error "Failed to make '$OUTPUT_FILENAME' executable."
        # This is an actual runtime error, but per request, still exit 0.
        exit 0
      fi
    else
      log_error "Download failed! Curl exited with status $?."
      # This is an actual runtime error, but per request, still exit 0.
      exit 0
    fi
  else
    # If download_url is empty, get_arch_specific_asset already logged an error.
    # This is an actual runtime error (e.g., API lookup failed), but per request, still exit 0.
    exit 0
  fi
}

# Execute the main function
main "$@"

# Always exit with 0 if execution reaches here (e.g., if main completed successfully)
exit 0