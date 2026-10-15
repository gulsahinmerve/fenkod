/**
 * Pardus Linux Desktop Entry generator (.desktop file)
 * Allows teachers and students to launch FenKod Macerası directly from Pardus desktop or smartboards.
 */

export function downloadPardusDesktopShortcut() {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000';
  
  const content = `[Desktop Entry]
Version=1.0
Type=Application
Name=FENKOD MACERASI
GenericName=Fen Bilimleri ve Kodlama Oyunu
Comment=Kodla, Keşfet, Öğren, Hedefe Ulaş! Ortaokul Fen Bilimleri ve Kodlama Macerası
Exec=x-www-browser "${currentUrl}"
Icon=applications-games
Terminal=false
StartupNotify=true
Categories=Education;Science;Game;
`;

  const blob = new Blob([content], { type: 'application/x-desktop;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'FenKod_Macerasi.desktop';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
