$ErrorActionPreference = "Stop"

$python = "C:\Users\takah\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location $root
& $python -m http.server 4173 --bind 127.0.0.1
