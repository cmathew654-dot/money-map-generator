# Runs N scraper shards in parallel windows, waits for all, merges and scores.
# Usage (from the scraper folder):  powershell -ExecutionPolicy Bypass -File run_parallel.ps1 -N 5
param([int]$N = 5, [string]$Extra = "--fast")
$py = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
$procs = @()
for ($i = 0; $i -lt $N; $i++) {
  $procs += Start-Process -FilePath $py -ArgumentList "-u ad_audit_scraper.py --shard $i/$N $Extra" -WorkingDirectory $PSScriptRoot -PassThru -RedirectStandardOutput (Join-Path $PSScriptRoot "shard$i.log") -RedirectStandardError (Join-Path $PSScriptRoot "shard$i.err")
}
Write-Host "started $N shards; waiting..."
$procs | Wait-Process
for ($i = 0; $i -lt $N; $i++) { Write-Host "--- shard $i (last lines) ---"; Get-Content (Join-Path $PSScriptRoot "shard$i.log") -Tail 3; Get-Content (Join-Path $PSScriptRoot "shard$i.err") -Tail 3 }
& $py (Join-Path $PSScriptRoot "merge_parts.py")
& $py (Join-Path $PSScriptRoot "score_ad_audit.py")
Write-Host "done. now: git add -f ..\ad_audit_filled.csv ..\ad_audit_scored.csv ..\niche_pass.csv; git commit -m 'feat(research): step 3 ad audit results'; git push origin claude/boring-niche-aaas-miner-4ptuvl"
