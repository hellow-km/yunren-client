set workPath=%~dp0
set packagePath=%~dp0out/win64/yunren_tools-win32-x64/resources/

copy "%workPath%toTop.exe" "%packagePath%toTop.exe"

xcopy "%workPath%webtorrent_commonjs" "%packagePath%webtorrent_commonjs" /E /I /H /Y

xcopy "%workPath%public" "%packagePath%public" /E /I /H /Y

xcopy "%workPath%images" "%packagePath%images" /E /I /H /Y

xcopy "%workPath%ffmpeg" "%packagePath%ffmpeg" /E /I /H /Y