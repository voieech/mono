## src/api/
Folder for all API integrations / calls, regardless of whether they make the call through a hook or a direct call.


## Folder structure
All API call functions are split in these 4 folders:
1. [direct-mutations](./direct-mutations/)
    1. For all direct "CUD" / "POST based" API calls to the server.
1. [direct-queries](./direct-queries/)
    1. For all direct "R" / "GET based" API calls to the server.
    1. This has no caching unlike the "hooks-queries"
1. [hooks-mutations](./hooks-mutations/)
    1. For all hook + react-query based "CUD" / "POST based" API calls to the server.
    1. These react-query useMutation hooks can modify cached data loaded via "hooks-queries"
1. [hooks-queries](./hooks-queries/)
    1. For all hook + react-query based "R" / "GET based" API calls to the server.
    1. These react-query useQuery hooks can cache data