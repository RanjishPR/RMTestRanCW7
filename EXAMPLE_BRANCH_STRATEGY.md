# Option 1: Subtree

Doesn't work because it gets confused with the same branches added multiple times

# Option 2: Copy content in

Requires some extra logic to merge the code. Would have the easiest handling. But loosing some info about

Merging:

```
git diff -C $SOURCE $(cat $TARGET/.MERGE_HEAD) >tmp/$TARGET.patch
git apply -p 2 --directory $TARGET <tmp/$TARGET.patch
```

# Option 3: Submodule

git submodule add
git update-index --add kyma/app --cacheinfo 160000,a6fedfa648e42366edb5720c72b902e9f37b8edd,kyma/app


* Its not required to checkout the submodule! Just for tracking the branch
* manage-examples.js will automatically update the submodule information with its current commit

