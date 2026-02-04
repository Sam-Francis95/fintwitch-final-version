$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Play Finance City.lnk")
$Shortcut.TargetPath = "c:\Users\Sanjana\Downloads\FinTwitch-main (2)\FinTwitch-main\FinTwitch-main\start_game.bat"
$Shortcut.WindowStyle = 1
$Shortcut.IconLocation = "c:\Users\Sanjana\Downloads\FinTwitch-main (2)\FinTwitch-main\FinTwitch-main\public\vite.svg"
$Shortcut.Description = "Start Finance City Game"
$Shortcut.Save()
