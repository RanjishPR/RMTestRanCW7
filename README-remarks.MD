
# cds init (@Uwe)

cds init creates a new folder this is a bit strange. I would assume that the current folder is the folder you want to work with.

Tim: Both is possible, either
```
cds init cpapp
cd cpapp
```
or
```
mkdir cpapp
cd cpapp
cds init
```
I am not bothered either way

# cds init - VS Code settings (@Uwe)

Why not directly create a VS Code launch config when creating a new project. One for `cds run` and one for `cds watch` with the right debugging config.

Tim: You mean adding adding a debug config like this, right? So, people don't have to go through the pain to understand how to debug?
```
    {
      "name": "debug cds run",
      "type": "node",
      "request": "launch",
      "program": "/usr/local/bin/cds",
      "args": [ "run", "--with-mocks", "--in-memory?" ],
      "skipFiles": [ "<node_internals>/**" ],
      "internalConsoleOptions": "openOnSessionStart",
      "console": "internalConsole",
      "autoAttachChildProcesses": true
    }
```
Would make sense, because this proved to be quite a barrier for the 2 of us as well.


# README.md - "codeandfinder" (@Uwe)

Wouldn't it be easier to instruct people to open the template as a 2nd folder in VS code? I added it as an alternative.

Tim: possibly, yes, need to look into it whether if feels better.

# README.md - `1. Generate the application, make sure that it points to the ```app``` part` (@Uwe)

What does this mean?

Tim: Wording is not nice, I will change it. It means that one should check whether the "Your app will be generated in this folder" path points to the app folder within one's project.

# cds build/all (@Uwe)

CDS does not recognize that it needs to build the `db` part. Maybe this is because we have the separation in `[development]` and `[productive]` for the db.

