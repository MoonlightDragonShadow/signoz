#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  cat <<'HELP'
Usage: bash build-source-image.sh [--mirror | --mirror=REGISTRY_PREFIX]

Build the current frontend and backend sources into one local image.
Options:
  --mirror        Use m.daocloud.io/docker.io for Docker Hub images
  --mirror=PATH   Use another Docker Hub mirror prefix (without https://)
Environment variables:
  SIGNOZ_VERSION          Source release version (default: v0.149.0)
  SIGNOZ_IMAGE            Output image tag (default: signoz-zh:<SIGNOZ_VERSION>)
  SIGNOZ_DOCKERHUB_MIRROR Docker Hub mirror prefix; also enables mirror mode

Run this script from the source directory or call it by path. Docker with
BuildKit and access to the base images and package registries is required.
Mirror mode uses --build-context and requires a Docker version that supports it.
HELP
  exit 0
fi

mirror_prefix="${SIGNOZ_DOCKERHUB_MIRROR:-}"
case "${1:-}" in
  --mirror)
    mirror_prefix="${mirror_prefix:-m.daocloud.io/docker.io}"
    shift
    ;;
  --mirror=*)
    mirror_prefix="${1#--mirror=}"
    if [[ -z "$mirror_prefix" ]]; then
      echo "The mirror prefix cannot be empty." >&2
      exit 2
    fi
    shift
    ;;
esac

if [[ $# -ne 0 ]]; then
  echo "Unexpected argument: $1. Use --help for usage." >&2
  exit 2
fi

source_dir="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$source_dir"

signoz_version="${SIGNOZ_VERSION:-v0.149.0}"
signoz_image="${SIGNOZ_IMAGE:-signoz-zh:${signoz_version}}"
case "$signoz_version" in
  *[!a-zA-Z0-9._+-]*|'')
    echo "SIGNOZ_VERSION contains unsupported characters." >&2
    exit 2
    ;;
esac

build_context_args=()
if [[ -n "$mirror_prefix" ]]; then
  # Docker image references use a registry prefix, not an HTTP URL.
  mirror_prefix="${mirror_prefix%/}"
  if [[ ! "$mirror_prefix" =~ ^[a-zA-Z0-9][a-zA-Z0-9._:/-]*$ || "$mirror_prefix" == *://* || "$mirror_prefix" == *//* ]]; then
    echo "Invalid mirror prefix. Example: m.daocloud.io/docker.io" >&2
    exit 2
  fi

  # Read the FROM references so version changes in Dockerfile.source also
  # apply in mirror mode. Fail clearly if its stage layout changes.
  node_image="$(awk 'toupper($1) == "FROM" && tolower($3) == "as" && tolower($4) == "frontend-build" {print $2; exit}' Dockerfile.source)"
  go_image="$(awk 'toupper($1) == "FROM" && tolower($3) == "as" && tolower($4) == "backend-build" {print $2; exit}' Dockerfile.source)"
  alpine_image="$(awk 'toupper($1) == "FROM" {image=$2} END {print image}' Dockerfile.source)"
  if [[ "$node_image" != node:* && "$node_image" != node@* ]] || \
     [[ "$go_image" != golang:* && "$go_image" != golang@* ]] || \
     [[ "$alpine_image" != alpine:* && "$alpine_image" != alpine@* ]]; then
    echo "Cannot identify the Node, Go and Alpine images in Dockerfile.source; update the mirror mapping after changing its stages." >&2
    exit 2
  fi
  for image_ref in "$node_image" "$go_image" "$alpine_image"; do
    build_context_args+=(--build-context "$image_ref=docker-image://$mirror_prefix/library/$image_ref")
  done

  # The Dockerfile frontend is an image too; route it through the same mirror.
  syntax_image="$(awk '/^#[[:space:]]*syntax=/ {sub(/^#[[:space:]]*syntax=/, ""); print; exit}' Dockerfile.source)"
  if [[ "$syntax_image" == docker/dockerfile:* || "$syntax_image" == docker/dockerfile@* ]]; then
    build_context_args+=(--build-arg "BUILDKIT_SYNTAX=$mirror_prefix/$syntax_image")
  fi
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker was not found. Install Docker Engine and enable BuildKit first." >&2
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "Cannot connect to Docker. Check that the daemon is running and accessible." >&2
  exit 1
fi

revision=unknown
branch=unknown
if [[ -e .git ]] && command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  revision="$(git rev-parse --short HEAD)"
  branch="$(git symbolic-ref --quiet --short HEAD || echo detached)"
  if [[ -n "$(git status --porcelain --untracked-files=normal)" ]]; then
    revision="${revision}-dirty"
  fi
fi
build_time="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

printf 'Building %s from %s (revision: %s, branch: %s)\n' \
  "$signoz_image" "$source_dir" "$revision" "$branch"
if [[ -n "$mirror_prefix" ]]; then
  printf 'Docker Hub image mirror: %s\n' "$mirror_prefix"
fi

docker_args=(build --file Dockerfile.source)
if [[ -n "$mirror_prefix" ]]; then
  docker_args+=("${build_context_args[@]}")
fi
docker_args+=(
  --build-arg "SIGNOZ_VERSION=$signoz_version"
  --build-arg "SIGNOZ_REVISION=$revision"
  --build-arg "SIGNOZ_BRANCH=$branch"
  --build-arg "SIGNOZ_BUILD_TIME=$build_time"
  --tag "$signoz_image"
  .
)
if DOCKER_BUILDKIT=1 docker "${docker_args[@]}"; then
  :
else
  build_exit=$?
  echo "Docker build failed (exit $build_exit). Check the first error in the build output." >&2
  if [[ -n "$mirror_prefix" ]]; then
    echo "Mirror mode requires --build-context support; the mirror and the npm, Go and Alpine package registries must also be reachable." >&2
  else
    echo "If Docker Hub mirror access failed, try: bash build-source-image.sh --mirror" >&2
  fi
  exit "$build_exit"
fi

printf '\nImage built: %s\n' "$signoz_image"
docker image inspect "$signoz_image" --format 'Platform: {{.Os}}/{{.Architecture}}; ID: {{.Id}}'
