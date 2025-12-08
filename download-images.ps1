$imgFolder = "c:\Users\Admin\Desktop\demo\img"

$imageUrls = @(
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/RESCUER_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/OMNIPOTENT_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/LIQUID_AMBER_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/THE_CURE_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/R.S_WARRIOR_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/MOODY_SAPPHIRE_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/TRICKY_DUET_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/GOODNIGHT_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/VELVET_DREAM_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/THE_ONE_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/ROUGH_ADDICTION_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/FAIRY_WATER_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/EASE_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/QUENCHING_QUEEN_220x.png",
    "https://cdn.shopify.com/s/files/1/0656/1746/5733/products/SCARBOROUGH_FAIR_220x.png"
)

Write-Host "Bat dau tai anh vao folder: $imgFolder" -ForegroundColor Green

$successCount = 0
$failCount = 0

foreach ($url in $imageUrls) {
    try {
        $fileName = Split-Path $url -Leaf
        $filePath = Join-Path $imgFolder $fileName
        
        Write-Host "Dang tai: $fileName" -ForegroundColor Cyan
        
        Invoke-WebRequest -Uri $url -OutFile $filePath -ErrorAction Stop
        
        if (Test-Path $filePath) {
            $fileSize = (Get-Item $filePath).Length
            Write-Host "OK - Tai thanh cong: $fileName" -ForegroundColor Green
            $successCount++
        }
    }
    catch {
        Write-Host "FAIL - Loi tai: $fileName" -ForegroundColor Red
        $failCount++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n============ KET QUA ============" -ForegroundColor Yellow
Write-Host "Thanh cong: $successCount" -ForegroundColor Green
Write-Host "Loi: $failCount" -ForegroundColor Red
Write-Host "================================" -ForegroundColor Yellow

Write-Host "`nCac file trong folder img:" -ForegroundColor Cyan
Get-ChildItem $imgFolder | ForEach-Object { Write-Host "  - $($_.Name)" }
