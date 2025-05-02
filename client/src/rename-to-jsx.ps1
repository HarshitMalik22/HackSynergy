# Rename all .js files in components, pages, and context directories to .jsx
$directories = @("src/components", "src/pages", "src/context")

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -Filter "*.js" | ForEach-Object {
            $newName = $_.FullName -replace "\.js$", ".jsx"
            Rename-Item -Path $_.FullName -NewName $newName -Force
            Write-Host "Renamed $($_.Name) to $($_.Name -replace '\.js$', '.jsx')"
        }
    }
}

Write-Host "All JavaScript files have been renamed to .jsx" 