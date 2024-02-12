# Tutorial Development Setup

## Check Out GitHub Repository for Tutorial Development

Usually, you need to change both the `master` and several example branches. Therefore, it's suggested to check out the repository `master` branch and create an additional work tree for the examples. To have multiple work trees is a probably not so well-known git feature, that allows to work on different branches at the same time, but still have the same state of the GIT repository. As a limitation, you can't check out the same branch in multiple work trees as the same time.

To check out the tutorial and create the second work tree, run:

```bash
git clone https://github.tools.sap/CPES/CPAppDevelopment-dev.git CPAppDevelopment-doc
git --git-dir=CPAppDevelopment-doc/.git work tree add CPAppDevelopment-app create-cap-application
```

This creates two folders:

- `CPAppDevelopment-doc` - Use this to edit the documentation (`master` branch)
- `CPAppDevelopment-app` - Use this to edit the example branches


* [MkDocs](https://www.mkdocs.org/)
* [Mermaid Graphs](https://mermaid-js.github.io/mermaid/#/)
* [Material Markdown Extensions](https://squidfunk.github.io/mkdocs-material/extensions/admonition)

## Software Installation for Tutorial Development

1. Install software as described in section [Set-Up Local Development](../Set-Up-Local-Development).

2. Install `python3`:

    === "Mac"

        ```
        brew install python@3
        ```

    === "Windows"

        1. Go to https://www.python.org/downloads/windows/.
        2. Choose *Latest Python 3 Release - Python 3.x.x*.
        3. Cchoose *Windows x86-64 executable installer*.

    === "Linux"

        Check if python3 is already installed:

        ```
        python3 --version
        ```

        If not, use your Linux distribution's package manager to install it.

3. Install markdown page utilities:

    ```
    pip3 install mkdocs
    pip3 install mkdocs-material
    pip3 install markdown-include
    pip3 install mkdocs-mermaid-plugin
    ```

4. Install the tool to convert the tutorial from mkdocs to the 1DX format:

    * Follow the [tutorial](https://developers-qa.sap.com/tutorials/docs-tutorial-1-getting-started-new.html) to set up your environment to write tutorials and install the necessary tools.
    * You should now have Tutorials-Contribution and Tutorials in your GitHub Folder.
    * Clone this [repository](https://github.tools.sap/CPES/cpmscf-1dx-converter) to your GitHub folder
    * run npm install inside the directory:
    ```
    cd cpmscf-1dx-converter
    npm install
    ```
    * Optionally you can remove the old installation in your existing repository folder run:
    ```
    rm package-lock.json
    rm -rf node_modules
    npm install
    ```
    * Now you can run the build to convert your documents by using the commands
    ```
    npm run 1dx-build
    npm run 1dx-watch
    ```
    in your project directory

### Tools Documentation Links

* [MkDocs](https://www.mkdocs.org/)
* [Mermaid Graphs](https://mermaid-js.github.io/mermaid/#/)
* [Material Markdown Extensions](https://squidfunk.github.io/mkdocs-material/extensions/admonition)

## View Tutorial Locally

To view the tutorial and check for writing, you can start the local `mkdocs` server. It updates on any file change:

*SAP-internal version*:

```
mkdocs serve
```

It launches a server to locally service the `mkdocs` generated files: http://127.0.0.1:8000.

Further, it watches for file changes and will update itself. This can take a few seconds.


*External version:*

You need to install the node modules first:

```
npm install
```

Run the external version:

```
npm run external-docs-serve
```

It builds files for external shipment of the tutorial and opens an HTTP server to view the files: http://localhost:8001.

After changing a file, refresh the browser when the rebuild is completed.
