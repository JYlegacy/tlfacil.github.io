@echo off
setlocal enabledelayedexpansion

set output=marcas.js
> %output% echo window.marcas = {

:: Conta quantas marcas possuem arquivos
set marcaCount=0
for /d %%d in (*) do if exist "%%d\*.js" set /a marcaCount+=1

set currentMarca=0
for /d %%d in (*) do (
    if exist "%%d\*.js" (
        set /a currentMarca+=1
        echo    "%%d": [ >> %output%
        
        :: Conta quantos arquivos na pasta
        set fileCount=0
        for %%f in ("%%d\*.js") do set /a fileCount+=1
        
        set currentFile=0
        for %%f in ("%%d\*.js") do (
            set /a currentFile+=1
            set "filename=%%~nf"
            set "filename=!filename:_= !"
            set "line=        "!filename!""
            if !currentFile! lss !fileCount! set "line=!line!,"
            echo !line! >> %output%
        )
        echo    ] >> %output%
        if !currentMarca! lss !marcaCount! echo , >> %output%
    )
)
echo }; >> %output%

echo Arquivo %output% gerado com sucesso!