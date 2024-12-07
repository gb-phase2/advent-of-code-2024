param(
    [Parameter(Mandatory=$true)]
    [string]$InputFile
)

$FullPath = (Resolve-Path $InputFile).ProviderPath

Write-Host "Input file: $FullPath"

# Split path into directory and filename
$Dir = Split-Path $FullPath -Parent
$File = Split-Path $FullPath -Leaf
$BaseName = [System.IO.Path]::GetFileNameWithoutExtension($File)
$Extension = [System.IO.Path]::GetExtension($File)

$MinFile = Join-Path $Dir "$BaseName.min$Extension"
$ObfFile = Join-Path $Dir "$BaseName.obf$Extension"

Write-Host "Working directory: $Dir"
Set-Location $Dir

Write-Host "Minifying $File..."
$terserCmd = "terser `"$File`" -o `"$MinFile`""
Write-Host $terserCmd
Invoke-Expression $terserCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "Terser minification failed!"
    exit 1
}

Write-Host "Obfuscating $MinFile..."
$obfCmd = "javascript-obfuscator `"$MinFile`" --output `"$ObfFile`" --control-flow-flattening true --string-array true --string-array-encoding base64 --compact true"
Write-Host $obfCmd
Invoke-Expression $obfCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "Obfuscation failed!"
    exit 1
}

Write-Host "Replacing original file with obfuscated file..."
Move-Item -Force $ObfFile $FullPath

Write-Host "Cleaning up temporary minified file..."
Remove-Item $MinFile

Write-Host "Done."
Set-Location $PSScriptRoot
exit 0
