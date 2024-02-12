
## Writing Guidance

*Design:*

* Keep it minimalistic and focus on the functionality that you want to explain.
* Think about how to integrate it in the existing tutorial. Is it an additional topic (leave) or should it be integrated into the main flow, see [Module Sequence](Module_Sequence).
* Even if it should be part of the main flow, it could still be optional. If so, make sure that the main flow can be passed without this new part.
* Consider to split it off in multiple modules (a module is a markdown file, which results in an HTML page). Each module should have a result with a concrete benefit.

*Writing:*

* Stick to [SAP Style Guide for Technical Communication](https://help.sap.com/viewer/DRAFT/e33c591ae4494a659a3f5f983c9d1161/PROD/en-US).
* While the tutorial is currently SAP-internal, prepare it for external publication.
* Provide pull requests of your documentation changes for review.
* Update [What's New](../WhatsNew.md) page on significant changes.

*Example Code Handling:*

* [Create an Example Branch For a New Module](#create-an-example-branch-for-a-new-module).
* Always keep example branches up-to-date (suggestion: create example branch as you write the tutorial).
* Merge changes to the example branches downstream (see [Merging Example Branch Changes Downstream the Tutorial](#merging-example-branch-changes-downstream-the-tutorial)).
* Take-over code snippets from the example branches (see [Automatic Code Snippet Generation](#automatic-code-snippet-generation)).
* Retest your changes also for the affected tutorial modules downstream in the tutorial flow.

### Navigation Tree

The navigation tree is part of the MkDocs configuration. There are separate files for the SAP-internal and external version of the tutorial.

* *SAP-internal version of the tutorial:* `mkdocs.yml`
* *external* (public) version of the tutorial:* `external/mkdocs.yml`

## Examples Development

The steps described in the tutorial are also offered as prepared examples in each in an individual branch.

Since the tutorial modules are based on each other, they might need to be updated, if there’s a change in one of the modules.

To have this definition machine readable, the file is generated based on that contents of the file `examples.yml`.

## Prerequisites

Install the tutorial management scripts by running `npm link` from the `CPAppDevelopment-doc` folder.

It will install two scripts `tutorial-update-example.js` and `tutorial-update-code-snippets.js`. The scripts are explained below.

## Managing Examples

### Create an Example Branch for a New Module

The final code of each module (= page) of the tutorial that instructs code changes should be part of the tutorial GitHub repository. Each of them needs to be stored in an individual GitHub branch.

1. Decide carefully about the base module when creating a new tutorial.
2. Check out the branch of base module (`branch` in `examples.yaml` file) in the `CPAppDevelopment-app` folder.
3. Create a new branch for your module with: `git checkout -b <new branch>`.
4. Do the code changes, commit, and push the new branch.
5. In the `CPAppDevelopment-doc` folder, edit the file `examples.yaml`.
6. Create a new entry in the file:

    ```yaml
      - description: <module description (title) - avoid special chars>
        doc: <file name of markdown file without (.MD) suffix>
        branch: <new branch>
        baseBranch: <base branch>
    ```

7. Create pull request for your tutorial changes.

    When you create a pull request, all members of team `@CPES/TutorialReview` will be automatically added for review.
    Although there’s no technical constraint, there should be at least one approving reviewer to submit the change.

### Handling Modules Down-Stream the Tutorial Flow for a New Module

If the new module should be integrated in an existing flow, then you need to change the base branch of the following module, that has been the base branch of your new tutorial, to the new branch.

After that, the changes need to be propagated downstream to the following branches like explained in [Merging Example Branch Changes Downstream the Tutorial](#merging-example-branch-changes-downstream-the-tutorial).

Don't forget to retest the modified tutorials.

It’s suggested to do this after the code review of the tutorial.

### Merging Example Branch Changes Downstream the Tutorial

When updating an example, that is, a specific example branch, the examples based on this branch need to be updated as well. For that the base example's changes are merged into the all successor examples. The information how the examples are based on each other is stored in the `examples.yaml` file. Additionally, the `README.md` file in the example branch is overwritten with the file from `SAP/README.md` from the `master` branch.

You can use the following script to do updates for all examples, in the order of their appearance in the `examples.yaml` file, and push the results to the remote (SAP GitHub).

You need to run the command from your `CPAppDevelopment-app` folder.

#### Update local branches

Before working with the local example branches, make sure that they are in sync with the repository on GitHub.

*Fetch remote example branches and rebase local branches:*

```
tutorial-update-example.js sync-all
```

#### Merge base branch

*Option 1: Merge base branch for current example branch:*

```
tutorial-update-example.js
```

*Option 2: Merge base branch for all examples starting from current branch:*

```
tutorial-update-example.js from-here
```

*Option 3: Merge base branch for all examples:*

```
tutorial-update-example.js all
```

#### Merge issues



The script will also output the changes for each branch compared to the branch on the remote GitHub repository.

Further, it puts templates in the `generators/cpapp/templates/` folder.

The script will break if there’s a conflict and you need to resolve it and complete the merge.

There can be different reasons for the abort:
* Error in `git rebase`: The rebase to its origin branch is done before update an example branch to make sure that the latest content is available. This may fail if you forgot to push your previous changes to the remote. In that case run `git rebase --abort` and `git push` and continue.
* Error in `git merge`: The merge of the base example into the current example failed due to a conflict. You need to look into the conflicts and fix them. You may need to check if the example still works after the merge. Complete the merge by submitting the conflicting files, with `git add ...`, `git commit`, and `git push`.

After solving the error you have to options:

*Option 1: Complete to merge the current branch only:*

```
tutorial-update-example.js
```

*Option 2: Complete to merge the current branch and continue with all successor branches from here:*

```
tutorial-update-example.js from-here
```

#### Update remote GitHub repository

```
tutorial-update-example.js push-all
```

### Updating Templates from Example Branch

To update the `template` folder in the `master` branch of the repository, run the following script:

```
tutorial-update-example.js templates
```

All files listed in the `files` section of the `example.yml` file of a branch will be copied **from the examples to the template folder**.

## Tagging Current State of Examples (TEMPORARILY NOT AVAILABLE)

To fix a working version of all example branches in the GitHub repository, you can set tags to all that branches:

```
node ../CPAppDevelopment-doc/bin/internal/manage-examples.js --tag TAG-PREFIX
```

It creates a tag for each example branch with the scheme: `TAG-PREFIX/BRANCH-NAME`

For example, if you want to mark them as belonging to version "1.0" you can run:

```
node ../CPAppDevelopment-doc/bin/internal/manage-examples.js --tag 1.0
```

If will create, for example, the branches: `1.0/create/service`, ..., `1.0/cp/roles`, ...

This helps to publish a dedicated version the examples and also helps to roll back if there's a problem with the examples.

## Generated Markdown Files

* [Examples](Examples) contain a table with all examples, their branches, the tutorial link describing the step, and the branch the tutorial is based on. The file is automatically generated in the build based on the `examples.yaml` file, using:

    ```
    node bin/internal/build-examples-md.js
    ```

* The markdown `diffs/*` files, reachable from [Examples](Examples), contain the diff between an example and its base branch. The file is generated as well, by executing:

    ```
    node bin/internal/build-examples-md.js
    ```

* [Module Sequence](Module_Sequence) shows a diagram of the different tutorial modules (pages) with their order and dependency. The file is automatically generated during the build based on the `examples.yaml` file, using:

    ```
    node bin/internal/build-modules-md.js
    ```

*  The [Links](Links) contains a table of links from `links.yaml`. The file automatically generated in the build, by executing:

    ```
    node bin/internal/build-links-md.js
    ```


## Automatic Code Snippet Generation

There’s a preprocessor that automatically created code snippets from example branches, by comparing code of a file to the version in its base branch.

*Option 1: Update the snippets for the doc file associated with the current example branch:*

    ```
    tutorial-update-code-snippets.js
    ```

*Option 2: Update all snippets for all the doc files:*

    ```
    tutorial-update-code-snippets.js all
    ```

This needs to be triggered manually and the results need to be checked in. There’s no automatic run in the build, because it’s required to review all updated snippets.

The advantage of this approach is that the snippets in the tutorial can be easily kept in sync with example code. The example code can be seen as the "source of truth" that needs to be always maintained properly.

The preprocessor search for the "cpes-file" directive, that is kept in an HTML comment.

The complete file will be displayed, while inserted and modified parts are highlighted. Deleted parts aren’t displayed. By default, the complete file is differed. However, for YAML and JSON file it’s supported to diff sections of the file. The section has to be identified with a JSON Path behind a colon (`:`) after the file path.

### Full File Diff Example

Example of a full-file diff. The file was newly created in the current example. Therefore, no highlighting appears.

```
    <!-- cpes-file approuter/package.json -->
    ```json
    {
        "name": "approuter",
        "dependencies": {
            "@sap/approuter": "^6.8.2"
        },
        "engines": {
            "node": "^10.0.0"
        },
        "scripts": {
            "start": "node node_modules/@sap/approuter/approuter.js"
        }
    }
    ```
```

### Partial File Diff Example

Only the array element with the name `cpapp-destination` within `resources` should be diffed. In the example, this array element has been added, therefore it’s highlighted. The three dots (`...`) show that the diff isn’t complete and parts have been omitted in the snippet.

```
    <!-- cpes-file mta.yaml:$.resources[?(@.name=="cpapp-destination")] -->
    ```yaml hl_lines="3-9"
    _schema-version: '3.1'
    ...
    resources:
    ...
    - name: cpapp-destination
        type: org.cloudfoundry.managed-service
        parameters:
        service: destination
        service-plan: lite
    ```
```

The links are defined in the `links.yml` page.

## Terminology

* *tutorial* - The whole tutorial consisting of several *tutorial modules*.
* *tutorial module* - A part of the *tutorial*. Modules are based on each other. Usually they consist of one web page and an *example*.
* *example* - Example code for a *tutorial module*. Each *example* has an individual branch in the GitHub repository.
