#!/bin/zsh
set -euo pipefail

archive_dir="site-html-archive"
sitemap_url="https://www.pennkdsap.org/pages-sitemap.xml"

mkdir -p "$archive_dir/pages"
curl --fail --location --retry 3 --retry-all-errors --silent --show-error \
  "$sitemap_url" -o "$archive_dir/pages-sitemap.xml"

sed -n 's|[[:space:]]*<loc>\(.*\)</loc>[[:space:]]*|\1|p' \
  "$archive_dir/pages-sitemap.xml" > "$archive_dir/urls.txt"

typeset -i downloaded=0
while IFS= read -r url; do
  page_path="${url#https://www.pennkdsap.org}"
  [[ -z "$page_path" || "$page_path" == "/" ]] && page_path="/"
  if [[ "$page_path" == "/" ]]; then
    output="$archive_dir/pages/index.html"
  else
    output="$archive_dir/pages${page_path}.html"
  fi
  mkdir -p "${output:h}"
  print -r -- "$url" >&2
  curl --fail --location --retry 3 --retry-all-errors --silent --show-error \
    --header 'User-Agent: Mozilla/5.0 (compatible; site-archive/1.0)' \
    "$url" -o "$output"
  (( downloaded += 1 ))
done < "$archive_dir/urls.txt"

print -r -- "Downloaded $downloaded pages to $archive_dir/pages"
