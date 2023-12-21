
/*
 This file is used to configure url filtering.
 The file can contain entries as many as you want.
 Each entry contains two fields:
  - First field is regex string to match url you want to filter
  - Second field is the list of roles to be allowed to visit the url(s) mentioned in the first field

  Let me give you several examples to show how this configuration file works:
  scenario1:
     A user with roles 'admin, user' wants to visit /apis/v1/accounts/
     He/she is allowed to visit this url because the matched entry is '^/apis/v[0-9]+/accounts.*' : ['admin'], and he/she
     has the role 'admin' shown in the second field of the matched entry

  scenario2:
     A user with roles 'user' wants to visit /apis/v1/accounts/
     He/she is not allowed to visit this url because the matched entry is '^/apis/v[0-9]+/accounts.*' : ['admin'], and he/she
     doesn't have at least one role shown in the second field of the matched entry


  For somebody who is not familiar with regex will feel struggling to configure this file.
  I feel sorry for that, I promise I will enhance it in a near future but not now.
  I would appreciate your effort if you would like to enhance it before my action
 */
module.exports = {
 '^/apis/v[0-9]+/accounts.*' : ['admin'], //  /apis/v1/accounts/*
 '^/apis/v[0-9]+/users.*' : ['user'], //  /apis/v1/users/*
 '^/apis/v[0-9]+/todos.*' : ['user'], //  /apis/v1/todos/*
}