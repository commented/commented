
# Firebase

## Security rules

These rules will allow people to edit their own comments, but not others'.

```json
{
  "rules": {
    ".read": true,
    "comments": {
      "$slug": {
        "$commentID": {
          ".write": "auth != null &&
          (!data.exists() || 
           (data.child('userid').val() === auth.uid &&
            now - data.child('created').val() < 1000 * 3600 * 24
          ))",
          ".validate": "newData.hasChildren(['userid', 'text', 'displayName', 'target', 'quote', 'created', 'picture'])",
          "displayName": {
            ".validate":"newData.isString()"
          },
          "picture": {
            ".validate":"newData.isString()"
          },
          "text": {
            ".validate":"newData.isString()"
          },
          "parent": {
            ".validate":"newData.isString()"
          },
          "userid": {
            ".validate":"newData.val() == auth.uid"
          },
          "created": {
            ".validate": "newData.isNumber()"
          },
          "flags": {
            "$userID": {
              ".write": "auth != null &&
                         auth.uid === $userID &&
                         auth.uid !== data.parent().child('userid').val()",
              ".validate": "newData.isBoolean()"
            }
          },
          "votes": {
            "$userID": {
              ".write": "auth != null &&
                         auth.uid === $userID &&
                         auth.uid !== data.parent().child('userid').val()",
              ".validate": "newData.isBoolean()"
            }
          }
        }
      }
    }
  }
}
```

