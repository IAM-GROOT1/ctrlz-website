---
title: Contributing
summary: Where the code lives, how to build it, and what a useful report looks like.
order: 2
---

### The repository

CTRL+Z lives at [github.com/IAM-GROOT1/ctrlz](https://github.com/IAM-GROOT1/ctrlz). Issues and pull
requests are welcome there. This website is a separate repository; copy changes belong in this one,
app changes in the app one.

### Build and test

The app needs the .NET 8 SDK and Windows:

```powershell
git clone https://github.com/IAM-GROOT1/ctrlz.git
cd ctrlz
dotnet restore
dotnet run --project src/CtrlZ.App
dotnet test
```

`CtrlZ.Core` is a plain class library with no WPF dependency, so scanning, matching, profile and
browser-archive logic can be tested without a desktop session. If you change behaviour there, add a
test next to the existing ones.

### A useful bug report

Include the Windows build, whether CTRL+Z was elevated, the app or browser involved, and the log
from `%LOCALAPPDATA%\CTRL+Z\logs`. Redact anything personal before pasting it into an issue.

### Pull requests

Keep a pull request focused. Describe what changed and why, mention how you tested it, and say if it
changes profile JSON or archive formats — those are the parts other people's backups depend on.
