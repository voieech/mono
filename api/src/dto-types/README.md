# shared-dto-types
Shared folder of TS type definitions imported by all subrepos to use common definition instead of duplicating them.

1. This folder will ONLY export `type` symbols and nothing else. This cannot have any non type constructs.
1. The way this folder is consumed is through custom path symbol in tsconfig files of all the subrepos
    1. Which also means that these type definition files are essentially treated as part of each subrepo project, and each subrepo have no knowledge that other subrepos are using these files too.
    1. Specifically `"dto": ["../shared-dto-types/index.ts"]`