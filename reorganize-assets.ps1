# Script to reorganize item asset folders
# Renames folders from <gfxId>.swf to <gfxId> and moves all SVG files to root

$itemsPath = "public/assets/items"

Write-Host "Starting reorganization of item asset folders..." -ForegroundColor Green

# Get all typeId folders
$typeIdFolders = Get-ChildItem -Path $itemsPath -Directory

$totalFolders = 0
$processedFolders = 0

foreach ($typeIdFolder in $typeIdFolders) {
    Write-Host "`nProcessing typeId folder: $($typeIdFolder.Name)" -ForegroundColor Cyan

    # Get all gfxId folders (ending with .swf or .SWF)
    $gfxIdFolders = Get-ChildItem -Path $typeIdFolder.FullName -Directory | Where-Object { $_.Name -match '\.(swf|SWF)$' }

    foreach ($gfxIdFolder in $gfxIdFolders) {
        $totalFolders++
        $oldPath = $gfxIdFolder.FullName
        $newName = $gfxIdFolder.Name -replace '\.(swf|SWF)$', ''
        $newPath = Join-Path $typeIdFolder.FullName $newName

        Write-Host "  Processing: $($gfxIdFolder.Name) -> $newName" -ForegroundColor Yellow

        # Create temporary folder for SVG files
        $tempPath = Join-Path $typeIdFolder.FullName "_temp_$newName"
        New-Item -Path $tempPath -ItemType Directory -Force | Out-Null

        # Find and move all SVG files recursively
        $svgFiles = Get-ChildItem -Path $oldPath -Filter "*.svg" -Recurse
        foreach ($svg in $svgFiles) {
            $destPath = Join-Path $tempPath $svg.Name

            # Handle duplicate filenames by appending a number
            $counter = 1
            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($svg.Name)
            $extension = [System.IO.Path]::GetExtension($svg.Name)

            while (Test-Path $destPath) {
                $destPath = Join-Path $tempPath "$baseName`_$counter$extension"
                $counter++
            }

            Move-Item -Path $svg.FullName -Destination $destPath -Force
        }

        # Remove old folder
        Remove-Item -Path $oldPath -Recurse -Force

        # Rename temp folder to final name
        Rename-Item -Path $tempPath -NewName $newName

        $processedFolders++
        Write-Host "    Completed ($processedFolders/$totalFolders)" -ForegroundColor Green
    }
}

Write-Host "`n=== Reorganization Complete ===" -ForegroundColor Green
Write-Host "Total folders processed: $processedFolders" -ForegroundColor Green
