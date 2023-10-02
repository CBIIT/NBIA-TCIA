#!/bin/bash

echo "This script will delete all files from the webapps directory and copy the war files and frontend code from the specified installer directory"

# Prompt for the base directory
read -p "Enter the base installer directory (source_dir): " source_dir

# Check if source directory exists
if [ ! -d "$source_dir" ]; then
  echo "Source directory does not exist."
  exit 1
fi

# Define the target directory
target_dir="./webapps"

# Create /tmp directory if it doesn't exist
mkdir -p /tmp

# Backup properties files
cp "$target_dir/nbia-search/assets/properties.ts" "/tmp/properties_search.ts.bak"
cp "$target_dir/nbia-admin/assets/properties.ts" "/tmp/properties_admin.ts.bak"
# Backup configuration files
cp "$target_dir/nbia-search/assets/configuration" "/tmp/configuration_search.bak"
cp "$target_dir/nbia-admin/assets/configuration" "/tmp/configuration_admin.bak"

# Clear the webapps directory
rm -rf "$target_dir/*"

# Copy directories
cp -r "$source_dir/nbia-search/" "$target_dir/"
cp -r "$source_dir/nbia-uat/" "$target_dir/"
cp -r "$source_dir/nbia-viewer/" "$target_dir/"
cp -r "$source_dir/nbia-admin/" "$target_dir/"

# Copy war files
cp "$source_dir/nbia-wars/nbia-api.war" "$target_dir/nbia-api.war"
cp "$source_dir/nbia-wars/nbia-download.war" "$target_dir/nbia-download.war"

# Restore properties files
cp "/tmp/properties_search.ts.bak" "$target_dir/nbia-search/assets/properties.ts"
cp "/tmp/properties_admin.ts.bak" "$target_dir/nbia-admin/assets/properties.ts"
# Restore configuration files
cp "/tmp/configuration_search.bak" "$target_dir/nbia-search/assets/configuration"
cp "/tmp/configuration_admin.bak" "$target_dir/nbia-admin/assets/configuration"

# Change ownership to tomcat:tomcat recursively
chown -R tomcat:tomcat "$target_dir"

echo "All tasks completed."
