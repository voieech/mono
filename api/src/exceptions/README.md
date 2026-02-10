# api/src/exceptions/
All the shared Exception classes that can be used throughout the codebase. Try to reuse an Exception if possible and only create new ones if it is used extensively and no better alternatives exists for it.


## Notes
1. Traditionally `exception filters` would be used to filter for specific exception classes to handle them differently, but exceptions defined here uses a transformer method instead, where the exception defines its own methods for how to transform it when used in different situations, instead of defining separate exception filter classes.
1. They are called filters because they filter out Failures (exceptions) from Errors and handle them differently.