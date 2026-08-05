# Permission Matrix

| Resource | Action | Guest | User (Owner) | Admin | System |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Account` | Create | Deny | Allow | Deny | Deny |
| `Account` | Read | Deny | Allow (If owner) | Allow | Allow |
| `Account` | Update | Deny | Allow (If owner) | Deny | Allow |
| `Account` | Delete | Deny | Allow (If owner, Balance=0) | Deny | Deny |
| `Transaction` | Create | Deny | Allow (If owner) | Deny | Allow |
