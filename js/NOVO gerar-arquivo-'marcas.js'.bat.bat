@echo off
setlocal enabledelayedexpansion

set output=marcas.js

:: Conta quantos anos possuem marcas com .js
set yearCount=0
for /d %%y in (*) do (
    set "hasBrands="
    for /d %%b in ("%%y\*") do (
        for %%f in ("%%b\*.js") do set "hasBrands=1"
    )
    if defined hasBrands set /a yearCount+=1
)

> %output% echo window.marcas = {

set currentYear=0
for /d %%y in (*) do (
    set "hasBrands="
    for /d %%b in ("%%y\*") do (
        for %%f in ("%%b\*.js") do set "hasBrands=1"
    )
    if defined hasBrands (
        set /a currentYear+=1
        echo    "%%y": { >> %output%

        :: Conta marcas com .js dentro do ano
        set brandCount=0
        for /d %%b in ("%%y\*") do (
            set "hasFiles="
            for %%f in ("%%b\*.js") do set "hasFiles=1"
            if defined hasFiles set /a brandCount+=1
        )

        set currentBrand=0
        for /d %%b in ("%%y\*") do (
            set "hasFiles="
            for %%f in ("%%b\*.js") do set "hasFiles=1"
            if defined hasFiles (
                set /a currentBrand+=1
                echo        "%%~nxb": [ >> %output%

                set fileCount=0
                for %%f in ("%%b\*.js") do set /a fileCount+=1

                set currentFile=0
                for %%f in ("%%b\*.js") do (
                    set /a currentFile+=1
                    set "filename=%%~nf"
                    set "filename=!filename:_= !"
                    set "line=            "!filename!""
                    if !currentFile! lss !fileCount! set "line=!line!,"
                    echo !line! >> %output%
                )
                echo        ] >> %output%
                if !currentBrand! lss !brandCount! echo , >> %output%
            )
        )
        echo    } >> %output%
        if !currentYear! lss !yearCount! echo , >> %output%
    )
)
echo }; >> %output%

echo Arquivo %output% gerado com sucesso!