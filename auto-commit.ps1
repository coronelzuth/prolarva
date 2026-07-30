# Auto-commit + push cada 30 minutos
# Solo actua si hay cambios pendientes

$repo = "C:\Users\HP\Desktop\Zu Office\01 - PROYECTOS\HUB PROLARVA\06 - Apps y Artifacts\prolarva-monitor"

Set-Location $repo

$changes = git status --porcelain
if ($changes) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    git add -A
    git commit -m "auto-save: $timestamp"
    git push origin main
}
