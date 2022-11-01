let loadedProject = new SaveFile();
let loadedVersion = new Version();
let loadedScriptData = new ScriptData();

let fileNameText = document.getElementById("fileNameText");
fileNameInput = document.getElementById("fileNameInput");
let versionInput = document.getElementById("versionInput");
statusSelect = document.getElementById("statusSelect");
tumbnailSelect = document.getElementById("thumbnailSelect");
colorPicker = document.getElementById("colorPicker");
let thumbnailFile = "src/projectPreviewImg.png";

titleInput = document.getElementById("titleInput");
episodeInput = document.getElementById("episodeInput");
creditInput = document.getElementById("creditInput");
authorInput = document.getElementById("authorInput");
sourceInput = document.getElementById("sourceInput");
contactInput = document.getElementById("contactInput");
episodeCheck = document.getElementById("episodeCheck");
creditCheck = document.getElementById("creditCheck");
sourceCheck = document.getElementById("sourceCheck");
contactCheck = document.getElementById("contactCheck");

let savedIcon = document.getElementById("savedIcon");
let saved = true;

function GetThumbnailFromSelected(event)
{
    var reader = new FileReader();
    reader.addEventListener('load', function ()
    {
        thumbnailFile = reader.result;
        Unsave();
    });
    reader.readAsDataURL(thumbnailSelect.files[0]);
    Unsave();
}

function SaveFileToLocal(type, importSaveDate)
{
    if (saved) return;

    importSaveDate = importSaveDate || false;

    if (loadedProject.fileSaveName === null && fileNameInput.value.trim() === "")
    {
        fileNameInput.value = prompt(`¿Con qué nombre quieres guardar este archivo?`);
    }

    //Project data
    if (fileNameInput.value.trim() != fileName)
    {
        while (fileNameInput.value.trim() === "")
        {
            fileNameInput.value = prompt(`Oye, que no se pueden guardar proyectos sin nombre. Ponle alguno, porfa, aunque sea \'jhsjhd\'`);
        }
        if (!localStorage.getItem("SaveF" + fileNameInput.value.trim()))
        {
            localStorage.removeItem(`SaveF${fileName}`);
            fileName = fileNameInput.value.trim();
            loadedProject.fileSaveName = fileName;
            fileNameText.textContent = fileName;
            fileNameInput.value = fileName;
        }
        else alert("Ya existe un proyecto con este nombre, elige uno diferente.");
    }
    if (loadedProject.thumbnail != thumbnailFile) loadedProject.thumbnail = thumbnailFile;
    if (loadedProject.color != colorPicker.value) loadedProject.color = colorPicker.value;
    loadedProject.type = type;

    //Version data
    var index = 0;
    if (loadedProject.versions.length <= 0) { loadedProject.versions.push(new Version()); }
    else index = loadedProject.versions.indexOf(loadedProject.versions.find(x => x.versionId === loadedVersion.versionId));
    loadedProject.versions[index].versionLastMod = importSaveDate || Date.now().toString();
    loadedProject.versions[index].htmlSave = htmlOutput.innerHTML;
    if (loadedProject.versions[index].versionId != versionInput.value.trim())
    {
        if (loadedProject.versions.find(x => x.versionId === versionInput.value.trim())) { alert(`¡Ya existe una versión identifacada como \"${versionInput.value.trim()}\"! Elige otro identificador distinto.`); return; }
        loadedProject.versions[index].versionId = versionInput.value.trim();
    }
    if (loadedProject.versions[index].versionStatus != statusSelect.value) loadedProject.versions[index].versionStatus = statusSelect.value;

    loadedVersion.versionId = loadedProject.versions[index].versionId;
    loadedProject.lastVersionId = loadedProject.versions[loadedProject.versions.length - 1].versionId;

    //Script Data
    newScriptData = new ScriptData(titleInput.value, episodeInput.value, creditInput.value, authorInput.value, sourceInput.value, contactInput.value, episodeCheck.checked, creditCheck.checked, sourceCheck.checked, contactCheck.checked);
    Object.assign(loadedProject.scriptData, newScriptData);

    //Actually save
    localStorage.setItem(`SaveF${fileName}`, JSON.stringify(loadedProject));
    sessionStorage.setItem("currentSelectedVersion", loadedVersion.versionId);
    savedIcon.classList.remove("not-saved");
    saved = true;

    SetVersionsList();
}

function ShareFile()
{
    importSaveDate = false;

    if (loadedProject.fileSaveName === null)
    {
        fileNameInput.value = prompt(`¿Con qué nombre quieres guardar este archivo?`);
    }

    //Project data
    if (fileNameInput.value.trim() != fileName)
    {
        while (fileNameInput.value.trim() === "")
        {
            fileNameInput.value = prompt(`Oye, que no se pueden guardar proyectos sin nombre. Ponle alguno, porfa, aunque sea \'jhsjhd\'`);
        }
        if (!localStorage.getItem("SaveF" + fileNameInput.value.trim()))
        {
            localStorage.removeItem(`SaveF${fileName}`);
            fileName = fileNameInput.value.trim();
            loadedProject.fileSaveName = fileName;
            fileNameText.textContent = fileName;
            fileNameInput.value = fileName;
        }
        else alert("Ya existe un proyecto con este nombre, elige uno diferente.");
    }
    if (loadedProject.thumbnail != thumbnailFile) loadedProject.thumbnail = thumbnailFile;
    if (loadedProject.color != colorPicker.value) loadedProject.color = colorPicker.value;

    //Version data
    var index = 0;
    if (loadedProject.versions.length <= 0) { loadedProject.versions.push(new Version()); }
    else index = loadedProject.versions.indexOf(loadedProject.versions.find(x => x.versionId === loadedVersion.versionId));
    loadedProject.versions[index].versionLastMod = importSaveDate || Date.now().toString();
    loadedProject.versions[index].htmlSave = htmlOutput.innerHTML;
    if (loadedProject.versions[index].versionId != versionInput.value.trim())
    {
        if (loadedProject.versions.find(x => x.versionId === versionInput.value.trim())) { alert(`¡Ya existe una versión identifacada como \"${versionInput.value.trim()}\"! Elige otro identificador distinto.`); return; }
        loadedProject.versions[index].versionId = versionInput.value.trim();
    }
    if (loadedProject.versions[index].versionStatus != statusSelect.value) loadedProject.versions[index].versionStatus = statusSelect.value;

    loadedVersion.versionId = loadedProject.versions[index].versionId;
    loadedProject.lastVersionId = loadedProject.versions[loadedProject.versions.length - 1].versionId;

    //Script Data
    newScriptData = new ScriptData(titleInput.value, episodeInput.value, creditInput.value, authorInput.value, sourceInput.value, contactInput.value, episodeCheck.checked, creditCheck.checked, sourceCheck.checked, contactCheck.checked);
    Object.assign(loadedProject.scriptData, newScriptData);

    exportKedFile(JSON.stringify(loadedProject));
}

function Load()
{
    Object.assign(loadedProject, JSON.parse(localStorage.getItem("SaveF" + fileName)));
    Object.assign(loadedVersion, loadedProject.GetVersionByID(sessionStorage.getItem("currentSelectedVersion")));
    Object.assign(loadedScriptData, loadedProject.scriptData);
}

function LoadFileFromLocal()
{
    Load();
    fileNameText.textContent = fileName;
    fileNameInput.value = fileName;
    colorPicker.value = loadedProject.color;
    thumbnailFile = loadedProject.thumbnail;

    versionInput.value = loadedVersion.versionId;
    htmlOutput.innerHTML = loadedVersion.htmlSave;
    statusSelect.value = loadedVersion.versionStatus;

    LoadScriptData();

    SetVersionsList();
}

function LoadScriptData()
{
    titleInput.value = loadedScriptData.title;
    episodeInput.value = loadedScriptData.episode;
    creditInput.value = loadedScriptData.credit;
    authorInput.value = loadedScriptData.author;
    sourceInput.value = loadedScriptData.source;
    contactInput.value = loadedScriptData.contact;
    episodeCheck.checked = loadedScriptData.includeEpisode;
    creditCheck.checked = loadedScriptData.includeCredit;
    sourceCheck.checked = loadedScriptData.includeSource;
    contactCheck.checked = loadedScriptData.includeContact;
}

function Unsave()
{
    if (saved)
    {
        savedIcon.classList.add("not-saved");
        saved = false;
    }
}

if ("launchQueue" in window)
{
    launchQueue.setConsumer(async launchParams =>
    {
        if (launchParams.files.length)
        {
            let file = launchParams.files[0];
            if (/.*\.ked$/i.test(file.name))
            {
                let loadedFileName = file.name.replace(/(.*)\.ked$/i, `$1`);
                let newName = loadedFileName;
                if (localStorage.getItem(`SaveF${loadedFileName}`))
                {
                    newName = prompt(`¡Ojo! Ya tienes un proyecto con el nombre de archivo "${loadedFileName}". Escribe algo diferente abajo para abrir este archivo con otro nombre o déjalo como está si prefieres sobreescribirlo.`, loadedFileName);
                }
                let reader = new FileReader();
                reader.addEventListener('load', function (e)
                {
                    Object.assign(loadedProject, JSON.parse(e.target.result));
                    Object.assign(loadedVersion, loadedProject.GetVersionByID(loadedProject.lastVersionId));
                    Object.assign(loadedScriptData, loadedProject.scriptData);

                    fileName = newName;
                    loadedProject.fileSaveName = fileName;
                    fileNameText.textContent = fileName;
                    fileNameInput.value = fileName;
                    colorPicker.value = loadedProject.color;
                    thumbnailFile = loadedProject.thumbnail;

                    versionInput.value = loadedVersion.versionId;
                    inputElement.innerHTML = loadedVersion.htmlSave;
                    statusSelect.value = loadedVersion.versionStatus;

                    LoadScriptData();

                    SetVersionsList();
                });
                reader.readAsText(file);
            }
            else if (/.*\.fountain$/i.test(file.name))
            {
                OpenFile(launchParams);
            }
        }
    });
}