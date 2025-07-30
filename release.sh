#!/bin/bash

# Fullstory Forms Release Script
# This script synchronizes versions across packages and creates a coordinated release

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to get current version from package.json
get_version() {
    local package_path=$1
    cat "$package_path/package.json" | grep '"version":' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]'
}

# Function to validate version format
validate_version() {
    if [[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to compare versions
version_gt() {
    test "$(printf '%s\n' "$@" | sort -V | head -n 1)" != "$1"
}

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    print_error "You must be on the main branch to create a release. Current branch: $current_branch"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_error "You have uncommitted changes. Please commit or stash them before releasing."
    git status --short
    exit 1
fi

# Get current versions
CORE_VERSION=$(get_version "packages/form-core")
REACT_VERSION=$(get_version "packages/form-react")

print_status "Current versions:"
echo "  form-core: $CORE_VERSION"
echo "  form-react: $REACT_VERSION"

# Determine release version
if [ -n "$1" ]; then
    RELEASE_VERSION="$1"
    print_status "Using provided version: $RELEASE_VERSION"
else
    print_status "No version provided. Choose an option:"
    echo "1. Use form-core version ($CORE_VERSION)"
    echo "2. Use form-react version ($REACT_VERSION)"
    echo "3. Enter custom version"
    
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            RELEASE_VERSION="$CORE_VERSION"
            ;;
        2)
            RELEASE_VERSION="$REACT_VERSION"
            ;;
        3)
            read -p "Enter custom version (e.g., 1.0.0, 1.0.0-beta.1): " RELEASE_VERSION
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
fi

# Validate version format
if ! validate_version "$RELEASE_VERSION"; then
    print_error "Invalid version format: $RELEASE_VERSION"
    print_error "Version should follow semantic versioning (e.g., 1.0.0, 1.0.0-beta.1)"
    exit 1
fi

# Check if this is a newer version
if version_gt "$CORE_VERSION" "$RELEASE_VERSION" && version_gt "$REACT_VERSION" "$RELEASE_VERSION"; then
    print_warning "The specified version ($RELEASE_VERSION) is older than current versions."
    read -p "Do you want to continue? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_status "Release cancelled."
        exit 0
    fi
fi

print_status "Preparing release v$RELEASE_VERSION..."

# Update package versions
print_status "Updating form-core version..."
cd packages/form-core
npm version "$RELEASE_VERSION" --no-git-tag-version
npm install --package-lock-only
cd ../..

print_status "Updating form-react version..."
cd packages/form-react
npm version "$RELEASE_VERSION" --no-git-tag-version
npm install --package-lock-only
cd ../..

# Show changes
print_status "Version changes:"
git diff packages/*/package.json packages/*/package-lock.json

# Confirm release
echo ""
print_warning "This will:"
echo "  1. Commit the version and package-lock changes"
echo "  2. Create and push tag v$RELEASE_VERSION"
echo "  3. Trigger CircleCI deployment"
echo ""
read -p "Are you sure you want to proceed? (y/N): " confirm

if [[ ! $confirm =~ ^[Yy]$ ]]; then
    print_status "Release cancelled. Reverting version changes..."
    git checkout -- packages/*/package.json packages/*/package-lock.json
    exit 0
fi

# Commit version changes
print_status "Committing version changes..."
git add packages/*/package.json packages/*/package-lock.json
git commit -m "Release: v$RELEASE_VERSION [skip ci]"

# Create and push tag
print_status "Creating and pushing tag v$RELEASE_VERSION..."
git tag "v$RELEASE_VERSION"
git push origin main
git push origin "v$RELEASE_VERSION"

print_success "Release v$RELEASE_VERSION created successfully!"
print_status "CircleCI will now build and deploy both packages."
print_status "Monitor the deployment at: https://app.circleci.com/pipelines/github/fullstorydev/fullstory-forms"